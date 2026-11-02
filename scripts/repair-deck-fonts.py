"""Add browser-required metadata to previously generated deck WOFF2 subsets.

PDF readers accept some TrueType subsets without OS/2 or post tables, but
Chrome's OpenType Sanitizer rejects them. This keeps the existing glyphs,
coordinates, and font-family names while repairing only incomplete files.

Requires FontTools with Brotli support. Run without --write to list affected
fonts; use --write --backup-dir /path/to/backup to apply a reversible repair.
"""

from argparse import ArgumentParser
from pathlib import Path
import shutil
import tempfile

from fontTools.fontBuilder import FontBuilder
from fontTools.ttLib import TTFont


def repair(font: TTFont) -> bool:
    missing_os2 = "OS/2" not in font
    missing_post = "post" not in font
    if not (missing_os2 or missing_post):
        return False

    units = font["head"].unitsPerEm
    builder = FontBuilder(units, isTTF="glyf" in font)
    builder.font = font
    if missing_os2:
        ascent = font["hhea"].ascent
        descent = font["hhea"].descent
        builder.setupOS2(
            sTypoAscender=ascent,
            sTypoDescender=descent,
            usWinAscent=max(0, ascent),
            usWinDescent=max(0, -descent),
        )
    if missing_post:
        builder.setupPost(keepGlyphNames=False)
    return True


def main() -> None:
    parser = ArgumentParser(description=__doc__)
    parser.add_argument(
        "--fonts-dir",
        type=Path,
        default=Path(__file__).resolve().parents[1]
        / "public/narrative-course/decks/fonts",
    )
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--backup-dir", type=Path)
    args = parser.parse_args()
    if args.write and not args.backup_dir:
        parser.error("--write requires --backup-dir")

    files = sorted(args.fonts_dir.glob("*.woff2"))
    repaired = 0
    for path in files:
        font = TTFont(path)
        old_glyph_count = len(font.getGlyphOrder())
        old_cmap = font.getBestCmap()
        missing = ", ".join(tag for tag in ("OS/2", "post") if tag not in font)
        if not repair(font):
            continue
        print(f"{path.name}: add {missing}")
        repaired += 1
        if not args.write:
            continue

        args.backup_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, args.backup_dir / path.name)
        with tempfile.NamedTemporaryFile(dir=path.parent, suffix=".woff2", delete=False) as temp:
            temporary_path = Path(temp.name)
        try:
            font.save(temporary_path)
            check = TTFont(temporary_path)
            if "OS/2" not in check or "post" not in check:
                raise RuntimeError(f"required tables missing after repair: {path.name}")
            if len(check.getGlyphOrder()) != old_glyph_count or check.getBestCmap() != old_cmap:
                raise RuntimeError(f"glyph coverage changed during repair: {path.name}")
            temporary_path.replace(path)
        finally:
            temporary_path.unlink(missing_ok=True)

    print(f"{repaired} of {len(files)} WOFF2 files need repair" if not args.write
          else f"Repaired {repaired} of {len(files)} WOFF2 files")


if __name__ == "__main__":
    main()

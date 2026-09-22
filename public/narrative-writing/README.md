# Narrative Writing website restore package

This is a complete static export of the current Narrative Writing website.

## Deploy

1. Unzip the package.
2. Deploy the `site/` folder as the publish directory.
   - Netlify: drag the `site/` folder into a new manual deploy, or set the publish directory to `site`.
   - Vercel: use the `site/` folder as the project root and leave the build command empty.
3. Open `site/index.html` locally to inspect the site before deployment.

## Edit safely

- Main page: `site/index.html`
- Styles: `site/styles.css`
- Interactions: `site/app.js`
- Course images: `site/assets/`
- Original 16 flower images: `site/assets/title-flowers/`
- Generated transparent letter stickers: `site/assets/flower-letter-stickers/`

The homepage title is **Write What Matters**. Its 16 non-space characters are mapped in order to the 16 original flower images and 16 transparent letter stickers. Keep the mapping in `site-restore.json` synchronized if you change the title or replace any flower image.

No platform credential, source-control metadata, or private project identifier is included in this export.

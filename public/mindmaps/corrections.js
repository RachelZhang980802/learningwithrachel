// Corrections checked against the article text. The source map geometry stays intact.
const correctedNodeText = {
  '02': {
    '02-0-n85': 'Machines raise productivity',
    '02-0-n86': 'Higher corporate profits',
  },
  '04': {
    '04-2-n9': 'A Real Millionaire / Eligible bachelor',
  },
  '05': {
    '05-n58': 'Akira left, taking Chie’s ease,',
    '05-n59': 'like a cat making off with a fish',
    '05-n60': 'it had stolen.',
  },
  '06': {
    '06-reader-n31': 'The recent tragedy caused a public stir',
    '06-writer-n17': 'being fluent in speech',
    '06-writer-n18': 'being less persuasive in reasoning',
  },
  '07': {
    'ba47e9ab-0a5d-495c-bbd9-03004dc9251d': 'Smaller population',
    '18521c29-5d59-421d-890c-b3dba0874b50': 'Larger territory',
  },
};

export function applyMapCorrections(book) {
  const corrections = correctedNodeText[book.id];
  if (!corrections) return;
  for (const scene of book.scenes) {
    for (const node of scene.nodes) {
      const corrected = corrections[node.id];
      if (!corrected) continue;
      node.text = corrected;
      if (node.spans?.length === 1) {
        node.spans[0].text = corrected;
        delete node.spans[0].glyphs;
      }
    }
  }
}

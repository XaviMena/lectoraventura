/**
 * Normaliza las ilustraciones de un capítulo para admitir tanto el formato clásico
 * (`chapter.image`) como múltiples ilustraciones (`chapter.images: [...]`).
 *
 * Cada entrada resultante incluye `fromParagraph` (1-indexed) indicando desde qué
 * párrafo del capítulo se muestra esa escena.
 */
export function getChapterImages(chapter) {
  if (!chapter) return [];

  const raw = [];
  const seen = new Set();

  const pushUnique = (item) => {
    if (!item || !item.src || seen.has(item.src)) return;
    seen.add(item.src);
    raw.push(item);
  };

  if (Array.isArray(chapter.images) && chapter.images.length > 0) {
    chapter.images.forEach(pushUnique);
  }
  if (chapter.image?.src) {
    // Si existen ambos, image va primero solo si no estaba ya en images
    if (raw.length === 0) {
      pushUnique(chapter.image);
    }
  }

  if (raw.length === 0) return [];

  const totalParagraphs = Math.max(1, chapter.content?.length || 1);

  return raw
    .map((item, idx, arr) => {
      const explicit = Number(item.fromParagraph);
      const fallback =
        idx === 0
          ? 1
          : Math.min(
              totalParagraphs,
              Math.max(2, Math.ceil((totalParagraphs * idx) / arr.length) + 1)
            );
      const fromParagraph =
        idx === 0
          ? 1
          : Number.isFinite(explicit) && explicit >= 2
            ? Math.min(totalParagraphs, Math.floor(explicit))
            : fallback;

      return {
        ...item,
        fromParagraph,
      };
    })
    .sort((a, b) => a.fromParagraph - b.fromParagraph);
}

/**
 * Devuelve el índice (0-based) de la fotografía activa para un párrafo (0-based).
 */
export function getActiveImageIdxForParagraph(chapterImages, paragraphIdx0Based) {
  if (!chapterImages || chapterImages.length <= 1) return 0;
  const pNum = Math.max(1, paragraphIdx0Based + 1);
  let active = 0;
  for (let i = 0; i < chapterImages.length; i += 1) {
    if (pNum >= chapterImages[i].fromParagraph) {
      active = i;
    }
  }
  return active;
}

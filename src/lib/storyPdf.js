import { jsPDF } from "jspdf";
import { site } from "../data/site";
import { assetUrl } from "./assetUrl";

// Generador único para todas las lecturas.
// Toma el objeto de src/data/readings.js (título, capítulos, imágenes)
// y arma el PDF tipo cuento. No hace falta un script por historia.

const PAGE = { w: 210, h: 297 };
const MARGIN = 18;
const INNER = 8;
const CONTENT_W = PAGE.w - MARGIN * 2;
const PAPER = [251, 247, 238];
const INK = [55, 38, 26];
const INK_SOFT = [92, 68, 48];
const GOLD = [166, 124, 72];
const RULE = [196, 168, 122];

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function forPdf(text) {
  return String(text || "")
    .replace(/\*/g, "")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"');
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Imagen inválida"));
    img.src = dataUrl;
  });
}

function toCleanJpeg(img) {
  const maxW = 1200;
  const scale = Math.min(1, maxW / Math.max(1, img.naturalWidth || img.width));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  canvas.height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar la ilustración");
  ctx.fillStyle = "#fbf7ee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

async function loadImage(src) {
  if (!src) return null;
  const url = new URL(assetUrl(src), window.location.href).href;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar ${src}`);
  const dataUrl = await blobToDataUrl(await res.blob());
  const img = await dataUrlToImage(dataUrl);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  return {
    dataUrl: toCleanJpeg(img),
    ratio: width / Math.max(1, height),
  };
}

function savePdf(doc, filename) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function paintPaper(doc) {
  doc.setFillColor(...PAPER);
  doc.rect(0, 0, PAGE.w, PAGE.h, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.rect(INNER, INNER, PAGE.w - INNER * 2, PAGE.h - INNER * 2);
  doc.setLineWidth(0.25);
  doc.rect(INNER + 1.6, INNER + 1.6, PAGE.w - (INNER + 1.6) * 2, PAGE.h - (INNER + 1.6) * 2);
}

function ornament(doc, y) {
  const cx = PAGE.w / 2;
  doc.setDrawColor(...GOLD);
  doc.setFillColor(...GOLD);
  doc.setLineWidth(0.35);
  doc.line(cx - 28, y, cx - 5, y);
  doc.line(cx + 5, y, cx + 28, y);
  doc.circle(cx, y, 1.3, "F");
}

function footer(doc, page, total, title) {
  const y = PAGE.h - 11;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y - 4, PAGE.w - MARGIN, y - 4);
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...INK_SOFT);
  doc.text(forPdf(title), MARGIN, y);
  doc.setFont("times", "normal");
  doc.text(String(page), PAGE.w - MARGIN, y, { align: "right" });
}

function imageBox(doc, image, x, y, maxW, maxH) {
  let w = maxW;
  let h = w / image.ratio;
  if (h > maxH) {
    h = maxH;
    w = h * image.ratio;
  }
  const drawX = x + (maxW - w) / 2;
  doc.setFillColor(230, 220, 200);
  doc.rect(drawX - 0.6, y - 0.6, w + 1.2, h + 1.2, "F");
  try {
    doc.addImage(image.dataUrl, "JPEG", drawX, y, w, h, undefined, "FAST");
  } catch (err) {
    console.warn("No se pudo incrustar una ilustración en el PDF", err);
  }
  return h + 1.2;
}

function wrap(doc, text, font, style, size, width) {
  doc.setFont(font, style);
  doc.setFontSize(size);
  return doc.splitTextToSize(forPdf(text), width);
}

export async function downloadStoryPdf(reading) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const images = {};
  const coverSrc = reading.cover || reading.chapters.find((ch) => ch.image)?.image?.src;
  if (coverSrc) {
    try {
      images.cover = await loadImage(coverSrc);
    } catch {
      images.cover = null;
    }
  }
  for (const chapter of reading.chapters) {
    if (chapter.image?.src) {
      try {
        images[chapter.id] = await loadImage(chapter.image.src);
      } catch {
        images[chapter.id] = null;
      }
    }
  }

  let pageCount = 1;
  const title = reading.title;

  // Portada
  paintPaper(doc);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...GOLD);
  doc.text(forPdf(site.name), PAGE.w / 2, 22, { align: "center" });

  let y = 28;
  if (images.cover) {
    const imgH = imageBox(doc, images.cover, MARGIN, y, CONTENT_W, 118);
    y += imgH + 10;
  }

  ornament(doc, y);
  y += 10;

  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...INK);
  const titleLines = wrap(doc, reading.title, "times", "bold", 26, CONTENT_W - 10);
  titleLines.forEach((line) => {
    doc.text(line, PAGE.w / 2, y, { align: "center" });
    y += 11;
  });

  y += 2;
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(...INK_SOFT);
  const subLines = wrap(doc, reading.subtitle || reading.synopsis, "times", "italic", 13, CONTENT_W - 16);
  subLines.slice(0, 4).forEach((line) => {
    doc.text(line, PAGE.w / 2, y, { align: "center" });
    y += 6.2;
  });

  y += 6;
  ornament(doc, y);
  y += 12;

  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(forPdf(site.subject), PAGE.w / 2, y, { align: "center" });
  footer(doc, pageCount, 0, title);

  // Capítulos
  const bodySize = 12;
  const lineH = 6.4;
  const bottom = PAGE.h - 20;

  const newPage = (withHeader = true) => {
    doc.addPage();
    pageCount += 1;
    paintPaper(doc);
    if (withHeader) {
      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...GOLD);
      doc.text(forPdf(title), PAGE.w / 2, 16, { align: "center" });
    }
    footer(doc, pageCount, 0, title);
    return 22;
  };

  const ensure = (needed, currentY) => {
    if (currentY + needed > bottom) return newPage(true);
    return currentY;
  };

  const writeParagraph = (text, currentY, { indent = true, italic = false } = {}) => {
    const isDialogue = /^\s*[—–-]/.test(text);
    const style = italic ? "italic" : "normal";
    const lines = wrap(doc, text, "times", style, bodySize, CONTENT_W - (indent && !isDialogue ? 6 : 0));
    doc.setFont("times", style);
    doc.setFontSize(bodySize);
    doc.setTextColor(...INK);
    let yPos = currentY;
    lines.forEach((line, idx) => {
      yPos = ensure(lineH, yPos);
      const x = indent && !isDialogue && idx === 0 ? MARGIN + 6 : MARGIN;
      doc.text(line, x, yPos);
      yPos += lineH;
    });
    return yPos + 1.8;
  };

  reading.chapters.forEach((chapter, idx) => {
    y = newPage(true);
    y += 4;
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(...GOLD);
    doc.text(`Capítulo ${idx + 1}`, PAGE.w / 2, y, { align: "center" });
    y += 8;

    const chapterTitle = chapter.title.replace(/^Capítulo\s+\d+:\s*/i, "");
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...INK);
    const chTitleLines = wrap(doc, chapterTitle, "times", "bold", 18, CONTENT_W);
    chTitleLines.forEach((line) => {
      doc.text(line, PAGE.w / 2, y, { align: "center" });
      y += 8;
    });
    y += 2;
    ornament(doc, y);
    y += 8;

    const chapterImage = images[chapter.id];
    if (chapterImage) {
      y = ensure(88, y);
      const imgH = imageBox(doc, chapterImage, MARGIN, y, CONTENT_W, 86);
      y += imgH + 4;
      if (chapter.image?.caption) {
        doc.setFont("times", "italic");
        doc.setFontSize(9);
        doc.setTextColor(...INK_SOFT);
        const cap = wrap(doc, chapter.image.caption, "times", "italic", 9, CONTENT_W);
        cap.forEach((line) => {
          y = ensure(5, y);
          doc.text(line, PAGE.w / 2, y, { align: "center" });
          y += 4.4;
        });
        y += 3;
      }
    }

    (chapter.content || []).forEach((paragraph, pIdx) => {
      const looksQuoted = paragraph.trim().startsWith("«");
      y = writeParagraph(paragraph, y, {
        indent: pIdx > 0,
        italic: looksQuoted,
      });
    });
  });

  // Contraportada breve
  const lastChapter = reading.chapters[reading.chapters.length - 1];
  const lastLine = [...(lastChapter?.content || [])].reverse().find((p) => p && !p.startsWith("—")) || reading.synopsis;
  y = newPage(false);
  y = 70;
  ornament(doc, y);
  y += 16;
  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(...INK);
  const closing = wrap(doc, lastLine, "times", "italic", 14, CONTENT_W - 20);
  closing.forEach((line) => {
    doc.text(line, PAGE.w / 2, y, { align: "center" });
    y += 7.2;
  });
  y += 12;
  ornament(doc, y);
  y += 16;
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK_SOFT);
  doc.text("Fin", PAGE.w / 2, y, { align: "center" });
  y += 8;
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text(forPdf(`${site.name}  ·  ${site.subject}`), PAGE.w / 2, y, { align: "center" });

  const filename = `${slugify(reading.title) || "cuento"}.pdf`;
  savePdf(doc, filename);
}

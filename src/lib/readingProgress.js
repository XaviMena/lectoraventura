const KEY = "lectoraventura-progress-v1";

function readStore() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    if (!data.readings || typeof data.readings !== "object") data.readings = {};
    return data;
  } catch {
    return null;
  }
}

function writeStore(data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* cuota llena o modo privado */
  }
}

export function getReadingProgress(readingId) {
  if (!readingId) return null;
  const store = readStore();
  const saved = store?.readings?.[readingId];
  if (!saved || typeof saved !== "object") return null;
  return saved;
}

export function saveProgress({ readingId, chapterIndex, viewMode, screen, quizIndex, quizAnswers }) {
  if (!readingId) return;
  const store = readStore() || { lastReadingId: readingId, readings: {} };
  const prev = store.readings[readingId] || {};
  store.lastReadingId = readingId;
  store.readings[readingId] = {
    ...prev,
    ...(chapterIndex !== undefined ? { chapterIndex } : {}),
    ...(viewMode !== undefined ? { viewMode } : {}),
    ...(screen !== undefined ? { screen } : {}),
    ...(quizIndex !== undefined ? { quizIndex } : {}),
    ...(quizAnswers !== undefined ? { quizAnswers } : {}),
    updatedAt: Date.now(),
  };
  writeStore(store);
}

export function restartProgress(readingId) {
  saveProgress({
    readingId,
    chapterIndex: 0,
    viewMode: "chapters",
    screen: "reading",
    quizIndex: 0,
    quizAnswers: [],
  });
}

export function getContinueState(getReadingById) {
  const store = readStore();
  const readingId = store?.lastReadingId;
  if (!readingId) return null;
  const reading = getReadingById(readingId);
  if (!reading || reading.status !== "available") return null;
  const saved = store.readings?.[readingId] || {};
  const lastChapter = Math.max(0, (reading.chapters?.length || 1) - 1);
  const chapterIndex = Math.min(Math.max(0, Number(saved.chapterIndex) || 0), lastChapter);
  const inQuiz = saved.screen === "quiz" && reading.quiz?.length > 0;
  const chapter = reading.chapters[chapterIndex];
  return {
    reading,
    chapterIndex,
    chapterTitle: chapter?.title || `Capítulo ${chapterIndex + 1}`,
    screen: inQuiz ? "quiz" : "reading",
    href: inQuiz ? `/lectura/${reading.id}/evaluacion` : `/lectura/${reading.id}`,
  };
}

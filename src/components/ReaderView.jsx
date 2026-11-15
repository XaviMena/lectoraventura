import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Bookmark,
  X,
  Image as ImageIcon,
  ZoomIn,
  Monitor,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import DownloadStoryButton from "./DownloadStoryButton";
import ProjectorTopBar from "./ProjectorTopBar";
import ProjectorDock from "./ProjectorDock";
import { assetUrl } from "../lib/assetUrl";
import { saveProgress } from "../lib/readingProgress";
import { useSettings } from "../context/SettingsContext";

export default function ReaderView({
  reading,
  onGoToQuiz,
  initialChapterIndex = 0,
  initialViewMode = "chapters",
}) {
  const {
    isProjectorMode,
    setIsProjectorMode,
    fontSizePx,
    fontFamilyClass,
    colorTheme,
  } = useSettings();

  const lastChapter = Math.max(0, reading.chapters.length - 1);
  const [viewMode, setViewMode] = useState(
    initialViewMode === "continuous" ? "continuous" : "chapters"
  );
  const [currentChapterIdx, setCurrentChapterIdx] = useState(() =>
    Math.min(Math.max(0, initialChapterIndex), lastChapter)
  );
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);

  // Estados exclusivos del Modo Proyector
  const [teleprompterActive, setTeleprompterActive] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(32);
  const [focusMode, setFocusMode] = useState(true);
  const [autoFocusSync, setAutoFocusSync] = useState(true);
  const [focusedParagraphIdx, setFocusedParagraphIdx] = useState(0);
  const [rulerVisible, setRulerVisible] = useState(false);
  const [rulerTopPct, setRulerTopPct] = useState(38);
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);
  const [isBlackoutOpen, setIsBlackoutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const chapterTopRef = useRef(null);
  const scrollPaneRef = useRef(null);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const remainderRef = useRef(0);
  const focusedIdxRef = useRef(0);
  focusedIdxRef.current = focusedParagraphIdx;

  const currentChapter = reading.chapters[currentChapterIdx];
  const isLastChapter = currentChapterIdx === reading.chapters.length - 1;
  const paragraphs = currentChapter?.content || [];

  useEffect(() => {
    saveProgress({
      readingId: reading.id,
      chapterIndex: currentChapterIdx,
      viewMode,
      screen: "reading",
    });
  }, [reading.id, currentChapterIdx, viewMode]);

  useLayoutEffect(() => {
    if (isProjectorMode) {
      if (scrollPaneRef.current) {
        scrollPaneRef.current.scrollTop = 0;
      }
      return;
    }
    if (viewMode !== "chapters") return;
    const node = chapterTopRef.current;
    if (node) {
      node.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentChapterIdx, viewMode, isProjectorMode]);

  const stopTeleprompter = useCallback(() => {
    setTeleprompterActive(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
    remainderRef.current = 0;
  }, []);

  // Detener teleprompter al cambiar de capítulo, salir de proyector o desmontar
  useEffect(() => {
    stopTeleprompter();
    setFocusedParagraphIdx(0);
    focusedIdxRef.current = 0;
  }, [currentChapterIdx, isProjectorMode, stopTeleprompter]);

  useEffect(() => () => stopTeleprompter(), [stopTeleprompter]);

  const syncFocusToScroll = useCallback(() => {
    if (!focusMode || !autoFocusSync || !paragraphs.length) return;
    const pane = scrollPaneRef.current;
    if (!pane) return;

    if (pane.scrollTop <= 16) {
      if (focusedIdxRef.current !== 0) {
        focusedIdxRef.current = 0;
        setFocusedParagraphIdx(0);
      }
      return;
    }

    if (pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 24) {
      const lastIdx = paragraphs.length - 1;
      if (focusedIdxRef.current !== lastIdx) {
        focusedIdxRef.current = lastIdx;
        setFocusedParagraphIdx(lastIdx);
      }
      return;
    }

    const paneRect = pane.getBoundingClientRect();
    const focalY = paneRect.top + pane.clientHeight * 0.36;
    let bestIdx = focusedIdxRef.current;
    let bestDist = Infinity;

    for (let i = 0; i < paragraphs.length; i += 1) {
      const el = document.getElementById(`proj-para-${i}`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= focalY && r.bottom >= focalY) {
        bestIdx = i;
        bestDist = 0;
        break;
      }
      const center = (r.top + r.bottom) / 2;
      const dist = Math.abs(center - focalY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    if (bestIdx !== focusedIdxRef.current) {
      focusedIdxRef.current = bestIdx;
      setFocusedParagraphIdx(bestIdx);
    }
  }, [focusMode, autoFocusSync, paragraphs.length]);

  useEffect(() => {
    if (!teleprompterActive || !isProjectorMode) return;
    const pane = scrollPaneRef.current;
    if (!pane) return;

    lastTsRef.current = null;
    remainderRef.current = 0;

    const tick = (ts) => {
      if (lastTsRef.current !== null) {
        const dt = (ts - lastTsRef.current) / 1000;
        const dy = teleprompterSpeed * dt + remainderRef.current;
        const whole = Math.floor(dy);
        remainderRef.current = dy - whole;
        if (whole > 0) {
          pane.scrollTop += whole;
          syncFocusToScroll();
        }
        if (pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2) {
          syncFocusToScroll();
          stopTeleprompter();
          return;
        }
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [teleprompterActive, teleprompterSpeed, isProjectorMode, stopTeleprompter, syncFocusToScroll]);

  const scrollToParagraph = useCallback((idx) => {
    const pane = scrollPaneRef.current;
    const el = document.getElementById(`proj-para-${idx}`);
    if (!pane || !el) return;
    if (idx === 0) {
      pane.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const paneRect = pane.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const desiredTopOffset = Math.max(68, (pane.clientHeight - elRect.height) * 0.32);
    const targetTop = pane.scrollTop + (elRect.top - paneRect.top) - desiredTopOffset;
    pane.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, []);

  const stepParagraph = useCallback(
    (delta) => {
      if (!paragraphs.length) return;
      const next = Math.min(Math.max(0, focusedIdxRef.current + delta), paragraphs.length - 1);
      focusedIdxRef.current = next;
      setFocusedParagraphIdx(next);
      requestAnimationFrame(() => scrollToParagraph(next));
    },
    [paragraphs.length, scrollToParagraph]
  );

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => scrollToParagraph(focusedIdxRef.current));
      }
      return next;
    });
  }, [scrollToParagraph]);

  // Atajos de teclado para el docente
  useEffect(() => {
    const onKeyDown = (e) => {
      const activeEl = document.activeElement;
      const tag = activeEl?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.key === "Escape") {
        if (isImageZoomOpen) setIsImageZoomOpen(false);
        if (isBlackoutOpen) setIsBlackoutOpen(false);
        if (isHelpOpen) setIsHelpOpen(false);
        return;
      }

      if (isBlackoutOpen || isHelpOpen) {
        if (e.key.toLowerCase() === "b" && isBlackoutOpen) {
          setIsBlackoutOpen(false);
        }
        return;
      }

      const key = e.key.toLowerCase();

      if (key === "p") {
        e.preventDefault();
        setIsProjectorMode((prev) => !prev);
        return;
      }

      if (!isProjectorMode) return;

      if (key === "z" && currentChapter?.image) {
        e.preventDefault();
        setIsImageZoomOpen((prev) => !prev);
      } else if (key === "f") {
        e.preventDefault();
        toggleFocusMode();
      } else if (key === "r") {
        e.preventDefault();
        setRulerVisible((prev) => !prev);
      } else if (key === "b") {
        e.preventDefault();
        stopTeleprompter();
        setIsBlackoutOpen((prev) => !prev);
      } else if (e.code === "Space") {
        e.preventDefault();
        if (tag === "BUTTON") activeEl.blur();
        setTeleprompterActive((prev) => !prev);
      } else if (e.key === "ArrowDown" && focusMode) {
        e.preventDefault();
        stepParagraph(1);
      } else if (e.key === "ArrowUp" && focusMode) {
        e.preventDefault();
        stepParagraph(-1);
      } else if (e.key === "ArrowRight" && currentChapterIdx < reading.chapters.length - 1) {
        e.preventDefault();
        setCurrentChapterIdx((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentChapterIdx > 0) {
        e.preventDefault();
        setCurrentChapterIdx((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isProjectorMode,
    isImageZoomOpen,
    isBlackoutOpen,
    isHelpOpen,
    focusMode,
    currentChapter,
    currentChapterIdx,
    reading.chapters.length,
    setIsProjectorMode,
    stepParagraph,
    stopTeleprompter,
    toggleFocusMode,
  ]);

  const handleNavigateChapter = (idx) => {
    setCurrentChapterIdx(idx);
    setIsIndexModalOpen(false);
    if (!isProjectorMode && viewMode === "continuous") {
      requestAnimationFrame(() => {
        const el = document.getElementById(`capitulo-${reading.chapters[idx].id}`);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  };

  // ============================================================================
  // VISTA 1: MODO PROYECTOR ("TIPO CUENTO": imagen izquierda quieta + texto derecha)
  // ============================================================================
  if (isProjectorMode) {
    const panelBg =
      colorTheme === "dark"
        ? "bg-[#101724] border-slate-800"
        : colorTheme === "sepia"
          ? "bg-[#efe5d1] border-[#dfd3be]"
          : "bg-[#f4f6f9] border-slate-200";

    const cardBg =
      colorTheme === "dark"
        ? "bg-[#141c2b] border-slate-700 text-slate-100"
        : colorTheme === "sepia"
          ? "bg-[#fcf8ef] border-[#dfd3be] text-[#251b10]"
          : "bg-white border-slate-200 text-slate-900";

    const mutedColor =
      colorTheme === "dark"
        ? "text-slate-300"
        : colorTheme === "sepia"
          ? "text-[#5f4b34]"
          : "text-slate-600";

    const accentText =
      colorTheme === "dark"
        ? "text-blue-400"
        : colorTheme === "sepia"
          ? "text-amber-800"
          : "text-blue-700";

    const focusHighlightClass =
      colorTheme === "dark"
        ? "bg-blue-500/15 border-l-4 border-blue-400 pl-5 py-3 pr-4 rounded-r-2xl"
        : colorTheme === "sepia"
          ? "bg-amber-700/10 border-l-4 border-amber-700 pl-5 py-3 pr-4 rounded-r-2xl"
          : "bg-blue-50 border-l-4 border-blue-600 pl-5 py-3 pr-4 rounded-r-2xl";

    const rulerClass =
      colorTheme === "dark"
        ? "bg-blue-400/15 border-blue-400/50"
        : colorTheme === "sepia"
          ? "bg-amber-700/10 border-amber-700/45"
          : "bg-blue-600/10 border-blue-600/45";

    const titleSizePx = Math.round(fontSizePx * 1.28);

    return (
      <div className="h-dvh w-full flex flex-col overflow-hidden">
        <ProjectorTopBar
          reading={reading}
          activeScreen="reading"
          currentChapterIdx={currentChapterIdx}
          onSelectChapter={setCurrentChapterIdx}
          onGoToQuiz={onGoToQuiz}
        />

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[43fr_57fr] overflow-hidden">
          {/* COLUMNA IZQUIERDA FIJA: Ilustración quieta para observar en clase */}
          <aside
            className={`flex flex-col justify-between p-4 sm:p-6 lg:p-8 lg:pb-16 border-b lg:border-b-0 lg:border-r overflow-hidden ${panelBg}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className={`text-xs font-bold uppercase tracking-wider truncate ${accentText}`}>
                {reading.title} · Capítulo {currentChapterIdx + 1} de {reading.chapters.length}
              </p>

              <div className="flex items-center gap-2 shrink-0">
                <DownloadStoryButton reading={reading} />
                {currentChapter?.image && (
                  <button
                    type="button"
                    onClick={() => setIsImageZoomOpen(true)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-xs transition-opacity hover:opacity-85 ${cardBg}`}
                    title="Ampliar ilustración (Z)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Ampliar escena</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center my-3 lg:my-4 min-h-0">
              {currentChapter?.image ? (
                <figure className="w-full flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setIsImageZoomOpen(true)}
                    className="w-full rounded-2xl overflow-hidden shadow-lg border border-black/10 dark:border-white/10 bg-black/5 cursor-zoom-in block"
                    title="Clic para ampliar ilustración"
                  >
                    <img
                      src={assetUrl(currentChapter.image.src)}
                      alt={currentChapter.image.alt}
                      className="w-full aspect-video object-contain block"
                      loading="eager"
                    />
                  </button>
                  <figcaption
                    className={`mt-3 text-sm sm:text-base text-center leading-snug max-w-xl text-pretty ${mutedColor}`}
                  >
                    {currentChapter.image.caption}
                  </figcaption>
                </figure>
              ) : (
                <div
                  className={`w-full aspect-video rounded-2xl border flex flex-col items-center justify-center p-6 text-center ${cardBg}`}
                >
                  <ImageIcon className="w-10 h-10 opacity-40 mb-2" />
                  <p className={`text-sm font-semibold ${mutedColor}`}>{currentChapter?.title}</p>
                </div>
              )}
            </div>

            {/* Navegación rápida de capítulos al pie de la lámina */}
            <div className="hidden lg:flex items-center justify-between gap-2 pt-3 border-t border-black/10 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setCurrentChapterIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentChapterIdx === 0}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold border disabled:opacity-30 ${cardBg}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Cap. anterior</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[55%] px-1">
                {reading.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setCurrentChapterIdx(idx)}
                    className={`shrink-0 w-7 h-7 rounded-lg font-bold transition-colors ${
                      idx === currentChapterIdx
                        ? "bg-blue-600 text-white"
                        : `${cardBg} opacity-80 hover:opacity-100`
                    }`}
                    title={ch.title}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {!isLastChapter ? (
                <button
                  type="button"
                  onClick={() => setCurrentChapterIdx((prev) => prev + 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <span>Evaluación</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </aside>

          {/* COLUMNA DERECHA INDEPENDIENTE: Lectura amplia / Teleprompter / Foco */}
          <section className="relative min-h-0 h-full overflow-hidden">
            {rulerVisible && (
              <div
                className={`pointer-events-none absolute left-0 right-0 z-20 border-y-2 transition-all ${rulerClass}`}
                style={{
                  top: `${rulerTopPct}%`,
                  height: "3.1em",
                  fontSize: `${fontSizePx}px`,
                }}
              >
                <div className="pointer-events-auto absolute right-3 -top-7 flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setRulerTopPct((p) => Math.max(14, p - 6))}
                    className={`p-1 rounded border shadow-xs ${cardBg}`}
                    title="Subir regla guía"
                    aria-label="Subir regla guía"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRulerTopPct((p) => Math.min(78, p + 6))}
                    className={`p-1 rounded border shadow-xs ${cardBg}`}
                    title="Bajar regla guía"
                    aria-label="Bajar regla guía"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {focusMode && (
              <div
                className={`absolute top-3 left-4 sm:left-6 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-sm text-xs font-bold ${cardBg}`}
              >
                <span className={mutedColor}>
                  Párrafo {focusedParagraphIdx + 1}/{paragraphs.length}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    stepParagraph(-1);
                  }}
                  disabled={focusedParagraphIdx === 0}
                  className="p-1 rounded border border-current/15 disabled:opacity-30"
                  title="Párrafo anterior (↑)"
                  aria-label="Párrafo anterior"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    stepParagraph(1);
                  }}
                  disabled={focusedParagraphIdx >= paragraphs.length - 1}
                  className="p-1 rounded border border-current/15 disabled:opacity-30"
                  title="Siguiente párrafo (↓ o Espacio)"
                  aria-label="Siguiente párrafo"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div
              ref={scrollPaneRef}
              className="h-full overflow-y-auto reading-scroll px-6 sm:px-10 xl:px-14 pt-14 sm:pt-16 pb-44"
            >
              <div className="max-w-[44ch] mx-auto">
                <h2
                  className={`font-bold tracking-tight leading-tight mb-8 text-balance ${fontFamilyClass}`}
                  style={{ fontSize: `${titleSizePx}px` }}
                >
                  {currentChapter.title}
                </h2>

                <div
                  className={`space-y-7 ${fontFamilyClass} ${
                    focusMode ? "projector-focus-active" : ""
                  }`}
                  style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.78 }}
                >
                  {paragraphs.map((paragraph, pIdx) => {
                    const isFocused = focusMode && pIdx === focusedParagraphIdx;
                    return (
                      <p
                        key={pIdx}
                        id={`proj-para-${pIdx}`}
                        onClick={() => {
                          if (!focusMode) return;
                          focusedIdxRef.current = pIdx;
                          setFocusedParagraphIdx(pIdx);
                          scrollToParagraph(pIdx);
                        }}
                        className={`projector-para transition-all duration-200 ${
                          focusMode ? "cursor-pointer" : ""
                        } ${isFocused ? `projector-para-focused ${focusHighlightClass}` : ""}`}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Cierre del capítulo */}
                <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentChapterIdx((prev) => Math.max(0, prev - 1))}
                    disabled={currentChapterIdx === 0}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold border disabled:opacity-30 ${cardBg}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Capítulo anterior</span>
                  </button>

                  {!isLastChapter ? (
                    <button
                      type="button"
                      onClick={() => setCurrentChapterIdx((prev) => prev + 1)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    >
                      <span>Siguiente capítulo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onGoToQuiz}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                    >
                      <span>Ir a Evaluación</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Barra flotante movible y minimizable (nunca bloquea el texto) */}
        <ProjectorDock
          showReadingAids
          teleprompterActive={teleprompterActive}
          onToggleTeleprompter={() => setTeleprompterActive((prev) => !prev)}
          teleprompterSpeed={teleprompterSpeed}
          onChangeTeleprompterSpeed={setTeleprompterSpeed}
          focusMode={focusMode}
          onToggleFocusMode={toggleFocusMode}
          autoFocusSync={autoFocusSync}
          onToggleAutoFocusSync={() => setAutoFocusSync((prev) => !prev)}
          onStepParagraph={stepParagraph}
          rulerVisible={rulerVisible}
          onToggleRuler={() => setRulerVisible((prev) => !prev)}
          onToggleBlackout={() => {
            stopTeleprompter();
            setIsBlackoutOpen((prev) => !prev);
          }}
          onToggleHelp={() => setIsHelpOpen((prev) => !prev)}
        />

        {/* Modal de escena ampliada */}
        {isImageZoomOpen && currentChapter?.image && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={() => setIsImageZoomOpen(false)}
          >
            <div
              className="w-full max-w-6xl flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between text-white/90 text-sm">
                <span className="font-bold">
                  {reading.title} · {currentChapter.title}
                </span>
                <button
                  type="button"
                  onClick={() => setIsImageZoomOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold"
                >
                  Cerrar (Esc)
                </button>
              </div>
              <img
                src={assetUrl(currentChapter.image.src)}
                alt={currentChapter.image.alt}
                className="max-h-[78dvh] w-auto max-w-full rounded-2xl shadow-2xl object-contain"
              />
              <p className="text-center text-white/85 text-base sm:text-lg max-w-3xl leading-relaxed">
                {currentChapter.image.caption}
              </p>
            </div>
          </div>
        )}

        {/* Pantalla en negro / Pausa para dialogar */}
        {isBlackoutOpen && (
          <div
            className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-6 text-center cursor-pointer"
            onClick={() => setIsBlackoutOpen(false)}
          >
            <div className="max-w-lg space-y-4">
              <div className="text-sm uppercase tracking-widest text-slate-400 font-semibold">
                Pausa en clase
              </div>
              <div className="text-2xl sm:text-3xl font-bold">
                Proyector en reposo para dialogar
              </div>
              <p className="text-slate-400 text-base">
                Haz clic en cualquier lugar o presiona{" "}
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  B
                </kbd>{" "}
                /{" "}
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  Esc
                </kbd>{" "}
                para volver al cuento.
              </p>
            </div>
          </div>
        )}

        {/* Modal de atajos de teclado */}
        {isHelpOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsHelpOpen(false)}
          >
            <div
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border space-y-4 ${cardBg}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Atajos para el docente</h3>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="px-2.5 py-1 rounded-lg text-sm font-semibold border border-current/20"
                >
                  Cerrar
                </button>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span>Activar / salir de Modo Proyector</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">P</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Play / Pausa Teleprompter</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">Espacio</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Activar Modo Foco por párrafo</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">F</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Párrafo anterior / siguiente</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">↑ / ↓</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Capítulo anterior / siguiente</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">← / →</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Ampliar ilustración</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">Z</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Regla guía de lectura</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">R</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Pausa en negro</span>
                  <kbd className="px-2 py-0.5 rounded border border-current/20 font-mono text-xs">B</kbd>
                </div>
              </div>
              <p className={`text-xs pt-2 border-t border-current/15 leading-relaxed ${mutedColor}`}>
                Tip: arrastra la barra de controles desde su asa izquierda a cualquier rincón de la
                pantalla para que nunca estorbe. Doble clic en el asa la centra abajo.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // VISTA 2: MODO NORMAL (Lectura estándar por capítulos o continua)
  // ============================================================================
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-24 sm:pb-12 transition-all">
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">
            {reading.genre}
            {reading.author ? ` · ${reading.author}` : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProjectorMode(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Modo Proyector</span>
            </button>
            <DownloadStoryButton reading={reading} />
          </div>
        </div>

        <h1 className="text-[1.75rem] sm:text-[2.35rem] font-semibold tracking-tight text-slate-900 dark:text-white font-reading text-balance leading-tight">
          {reading.title}
        </h1>

        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 text-pretty">
          {reading.synopsis}
        </p>

        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-3 ${
            viewMode === "continuous"
              ? "border-b border-slate-200/80 dark:border-slate-800 pb-4"
              : ""
          }`}
        >
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {reading.estimatedMinutes} min
            <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
            {reading.chapters.length} capítulos
          </p>
          <div className="flex items-center gap-3 sm:gap-4 text-sm">
            {currentChapterIdx > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentChapterIdx(0);
                  setViewMode("chapters");
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 min-h-11"
              >
                Desde el inicio
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode("chapters")}
              className={`transition-colors ${
                viewMode === "chapters"
                  ? "text-slate-900 dark:text-white font-semibold"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Capítulos
            </button>
            <button
              type="button"
              onClick={() => setViewMode("continuous")}
              className={`transition-colors ${
                viewMode === "continuous"
                  ? "text-slate-900 dark:text-white font-semibold"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Continua
            </button>
          </div>
        </div>
      </header>

      {/* POR CAPÍTULOS */}
      {viewMode === "chapters" && (
        <div className="space-y-8 animate-fade-in">
          <nav
            className="flex gap-1 overflow-x-auto overscroll-x-contain scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-200/80 dark:border-slate-800"
            aria-label="Capítulos"
          >
            {reading.chapters.map((ch, idx) => {
              const shortTitle = ch.title.replace(/^Capítulo\s+\d+:\s*/i, "");
              const isCurrent = idx === currentChapterIdx;
              return (
                <button
                  key={ch.id}
                  onClick={() => setCurrentChapterIdx(idx)}
                  className={`shrink-0 px-3 py-3 text-sm border-b-2 transition-colors min-h-11 ${
                    isCurrent
                      ? "border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold"
                      : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <span className="tabular-nums mr-1.5 text-xs text-slate-400">{idx + 1}</span>
                  <span className="hidden sm:inline">{shortTitle}</span>
                  <span className="sm:hidden">Cap. {idx + 1}</span>
                </button>
              );
            })}
          </nav>

          <article ref={chapterTopRef} className="pt-8 scroll-mt-28 sm:scroll-mt-32">
            <h2 className="text-xl sm:text-[1.85rem] font-semibold text-slate-900 dark:text-white mb-6 font-reading tracking-tight text-balance">
              {currentChapter.title}
            </h2>

            {currentChapter.image && (
              <figure className="my-6 sm:my-8 -mx-4 sm:mx-0">
                <img
                  src={assetUrl(currentChapter.image.src)}
                  alt={currentChapter.image.alt}
                  className="w-full h-auto mx-auto sm:rounded-xl"
                  loading="eager"
                />
                <figcaption className="mt-3 px-4 sm:px-0 text-sm text-center text-slate-400 dark:text-slate-500 text-pretty">
                  {currentChapter.image.caption}
                </figcaption>
              </figure>
            )}

            <div
              className={`space-y-6 reading-text ${fontFamilyClass}`}
              style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.78 }}
            >
              {currentChapter.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </article>

          <div className="flex items-center justify-between gap-3 pt-8 sm:pt-10 border-t border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setCurrentChapterIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentChapterIdx === 0}
              className="inline-flex items-center gap-1.5 min-h-11 px-3 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {!isLastChapter ? (
              <button
                onClick={() => setCurrentChapterIdx((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 min-h-11 px-3 text-sm text-slate-900 dark:text-white hover:opacity-70 transition-opacity"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onGoToQuiz}
                className="inline-flex items-center gap-1.5 min-h-11 px-3 text-sm text-slate-900 dark:text-white hover:opacity-70 transition-opacity"
              >
                <span>Evaluación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* LECTURA CONTINUA */}
      {viewMode === "continuous" && (
        <div className="space-y-12 animate-fade-in">
          {reading.chapters.map((chapter, idx) => (
            <article
              key={chapter.id}
              id={`capitulo-${chapter.id}`}
              className="scroll-mt-28 sm:scroll-mt-32"
            >
              <p className="text-[11px] tracking-[0.16em] uppercase text-slate-400 mb-2">
                Capítulo {idx + 1}
              </p>
              <h2 className="text-xl sm:text-[1.85rem] font-semibold text-slate-900 dark:text-white mb-6 font-reading tracking-tight text-balance">
                {chapter.title}
              </h2>

              {chapter.image && (
                <figure className="my-6 sm:my-8 -mx-4 sm:mx-0">
                  <img
                    src={assetUrl(chapter.image.src)}
                    alt={chapter.image.alt}
                    className="w-full h-auto mx-auto sm:rounded-xl"
                    loading="lazy"
                  />
                  <figcaption className="mt-3 px-4 sm:px-0 text-sm text-center text-slate-400 dark:text-slate-500 text-pretty">
                    {chapter.image.caption}
                  </figcaption>
                </figure>
              )}

              <div
                className={`space-y-6 reading-text ${fontFamilyClass}`}
                style={{ fontSize: `${fontSizePx}px`, lineHeight: 1.78 }}
              >
                {chapter.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}

          <div className="py-8 border-t border-slate-200/80 dark:border-slate-800">
            <button
              onClick={onGoToQuiz}
              className="inline-flex items-center gap-1.5 min-h-11 text-sm text-slate-900 dark:text-white hover:opacity-70 transition-opacity"
            >
              <span>Ir a la evaluación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL FLOTANTE DE ÍNDICE RÁPIDO */}
      {isIndexModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setIsIndexModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative max-h-[90dvh] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Índice</h3>
              </div>
              <button
                onClick={() => setIsIndexModalOpen(false)}
                className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Cerrar índice"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {reading.chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => handleNavigateChapter(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    currentChapterIdx === idx && viewMode === "chapters"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-bold ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-pretty">{ch.title}</span>
                  </div>
                  {ch.image && (
                    <span className="shrink-0 text-emerald-600 dark:text-emerald-400" title="Contiene ilustración">
                      <ImageIcon className="w-4 h-4" />
                    </span>
                  )}
                </button>
              ))}

              <button
                onClick={() => {
                  setIsIndexModalOpen(false);
                  onGoToQuiz();
                }}
                className="w-full text-left p-3.5 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold flex items-center justify-between mt-4"
              >
                <span className="flex items-center gap-2 text-sm text-pretty">
                  <span>Evaluación ({reading.quiz?.length || 0} preguntas)</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante accesible de Índice en Vista Normal */}
      <div className="fixed z-40 right-4 sm:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => setIsIndexModalOpen(true)}
          className="flex items-center gap-2 min-h-11 px-4 py-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md hover:border-slate-400 transition-colors"
          title="Abrir índice de capítulos"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Índice</span>
        </button>
      </div>
    </div>
  );
}

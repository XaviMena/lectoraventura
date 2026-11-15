import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Maximize2, Menu, Pin, PinOff, X } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function ProjectorTopBar({
  reading,
  activeScreen = "reading",
  currentChapterIdx = 0,
  onSelectChapter,
  onGoToQuiz,
  onBackToReading,
}) {
  const { colorTheme, setIsProjectorMode } = useSettings();
  const [isPinned, setIsPinned] = useState(false);
  const [isTempVisible, setIsTempVisible] = useState(false);
  const hideTimerRef = useRef(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHide = (delay = 2200) => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setIsTempVisible(false);
    }, delay);
  };

  useEffect(() => () => clearHideTimer(), []);

  const revealTemporarily = () => {
    setIsTempVisible(true);
    scheduleHide(4500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const surfaceClass =
    colorTheme === "dark"
      ? "bg-slate-900/95 text-slate-100 border-slate-800"
      : colorTheme === "sepia"
        ? "bg-[#fcf8ef]/95 text-[#251b10] border-[#dfd3be]"
        : "bg-white/95 text-slate-900 border-slate-200";

  const mutedText =
    colorTheme === "dark"
      ? "text-slate-400 hover:text-slate-100"
      : colorTheme === "sepia"
        ? "text-[#5f4b34] hover:text-[#251b10]"
        : "text-slate-500 hover:text-slate-900";

  const borderClass =
    colorTheme === "dark"
      ? "border-slate-700"
      : colorTheme === "sepia"
        ? "border-[#dfd3be]"
        : "border-slate-200";

  const isVisible = isPinned || isTempVisible;

  return (
    <>
      {!isPinned && (
        <div
          onMouseEnter={revealTemporarily}
          className="fixed top-0 left-0 right-0 h-5 z-40"
          aria-hidden="true"
        />
      )}

      {!isVisible && (
        <button
          type="button"
          onClick={revealTemporarily}
          className={`fixed top-3 right-4 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-md transition-opacity opacity-80 hover:opacity-100 ${surfaceClass}`}
          title="Mostrar menú de capítulos y biblioteca"
        >
          <Menu className="w-3.5 h-3.5" />
          <span>Menú / Capítulos</span>
        </button>
      )}

      <header
        onMouseEnter={clearHideTimer}
        onMouseLeave={() => {
          if (!isPinned) scheduleHide(1600);
        }}
        className={`${
          isPinned ? "relative shrink-0" : "fixed top-0 left-0 right-0 shadow-lg"
        } z-40 border-b px-4 sm:px-6 min-h-14 py-2 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md transition-all duration-200 ${surfaceClass} ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/biblioteca"
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold shrink-0 ${mutedText}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Biblioteca</span>
          </Link>
          <span className={`w-px h-4 ${colorTheme === "dark" ? "bg-slate-700" : "bg-slate-200"}`} />
          <span className="text-sm font-bold truncate max-w-[160px] sm:max-w-xs">
            {reading.title}
          </span>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none" aria-label="Navegación en proyector">
          {reading.chapters.map((ch, idx) => {
            const active = activeScreen === "reading" && currentChapterIdx === idx;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  if (activeScreen === "quiz") {
                    onBackToReading?.(idx);
                  } else {
                    onSelectChapter?.(idx);
                  }
                }}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : mutedText
                }`}
              >
                Cap. {idx + 1}
              </button>
            );
          })}
          {reading.quiz?.length > 0 && (
            <button
              type="button"
              onClick={onGoToQuiz}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors ${
                activeScreen === "quiz"
                  ? "bg-blue-600 text-white border-blue-600"
                  : `${borderClass} ${mutedText}`
              }`}
            >
              Evaluación ({reading.quiz.length})
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              const next = !isPinned;
              setIsPinned(next);
              if (!next) setIsTempVisible(false);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${borderClass} ${
              isPinned ? "bg-blue-600/15 text-blue-600 dark:text-blue-400" : mutedText
            }`}
            title={isPinned ? "Auto-ocultar barra superior" : "Fijar barra superior"}
          >
            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPinned ? "Fijada" : "Fijar"}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${borderClass} ${mutedText}`}
            title="Pantalla completa"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Pantalla</span>
          </button>

          <button
            type="button"
            onClick={() => setIsProjectorMode(false)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${borderClass}`}
            title="Salir de Modo Proyector (P)"
          >
            <X className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>
    </>
  );
}

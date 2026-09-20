import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, Bookmark, X, Image as ImageIcon } from 'lucide-react';
import DownloadStoryButton from './DownloadStoryButton';
import { assetUrl } from '../lib/assetUrl';
import { saveProgress } from '../lib/readingProgress';

export default function ReaderView({
  reading,
  onGoToQuiz,
  fontSize,
  isProjectorMode,
  initialChapterIndex = 0,
  initialViewMode = 'chapters',
}) {
  const lastChapter = Math.max(0, reading.chapters.length - 1);
  const [viewMode, setViewMode] = useState(initialViewMode === 'continuous' ? 'continuous' : 'chapters');
  const [currentChapterIdx, setCurrentChapterIdx] = useState(() =>
    Math.min(Math.max(0, initialChapterIndex), lastChapter)
  );
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);
  const chapterTopRef = useRef(null);

  useEffect(() => {
    saveProgress({
      readingId: reading.id,
      chapterIndex: currentChapterIdx,
      viewMode,
      screen: 'reading',
    });
  }, [reading.id, currentChapterIdx, viewMode]);

  useLayoutEffect(() => {
    if (viewMode !== "chapters") return;
    const node = chapterTopRef.current;
    if (node) {
      node.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentChapterIdx, viewMode]);

  const currentChapter = reading.chapters[currentChapterIdx];
  const isLastChapter = currentChapterIdx === reading.chapters.length - 1;

  // Mapeo dinámico de tamaños de fuente
  const fontClasses = {
    base: 'text-[17px] sm:text-lg md:text-xl leading-relaxed',
    lg: 'text-lg sm:text-xl md:text-2xl leading-relaxed',
    xl: 'text-xl sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose',
    '2xl': 'text-xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-loose',
    '3xl': 'text-2xl sm:text-4xl md:text-5xl leading-relaxed sm:leading-loose',
  };

  const activeFontClass = fontClasses[fontSize] || fontClasses.lg;

  const handleNavigateChapter = (idx) => {
    setCurrentChapterIdx(idx);
    setIsIndexModalOpen(false);
    if (viewMode === "continuous") {
      requestAnimationFrame(() => {
        const el = document.getElementById(`capitulo-${reading.chapters[idx].id}`);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-24 sm:pb-12 transition-all ${
      isProjectorMode ? 'max-w-4xl' : ''
    }`}>
      
      <header className="mb-8">
        <div className="flex items-start justify-between gap-3 mb-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">
            {reading.genre}
          </p>
          <DownloadStoryButton reading={reading} />
        </div>

        <h1 className="text-[1.75rem] sm:text-[2.35rem] font-semibold tracking-tight text-slate-900 dark:text-white font-reading text-balance leading-tight">
          {reading.title}
        </h1>

        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 text-pretty">
          {reading.synopsis}
        </p>

        <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 ${
          viewMode === 'continuous' ? 'border-b border-slate-200/80 dark:border-slate-800 pb-4' : ''
        }`}>
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
                  setViewMode('chapters');
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 min-h-11"
              >
                Desde el inicio
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode('chapters')}
              className={`transition-colors ${
                viewMode === 'chapters'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Capítulos
            </button>
            <button
              type="button"
              onClick={() => setViewMode('continuous')}
              className={`transition-colors ${
                viewMode === 'continuous'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Continua
            </button>
          </div>
        </div>
      </header>

      {/* VISTA 1: POR CAPÍTULOS (Ideal para Proyección en Aula) */}
      {viewMode === 'chapters' && (
        <div className="space-y-8 animate-fade-in">
          <nav className="flex gap-1 overflow-x-auto overscroll-x-contain scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-200/80 dark:border-slate-800" aria-label="Capítulos">
            {reading.chapters.map((ch, idx) => {
              const shortTitle = ch.title.replace(/^Capítulo\s+\d+:\s*/i, '');
              const isCurrent = idx === currentChapterIdx;
              return (
                <button
                  key={ch.id}
                  onClick={() => setCurrentChapterIdx(idx)}
                  className={`shrink-0 px-3 py-3 text-sm border-b-2 transition-colors min-h-11 ${
                    isCurrent
                      ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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

            {/* Ilustración si el capítulo cuenta con ella */}
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

            {/* Párrafos del texto */}
            <div className={`space-y-6 font-reading text-slate-800 dark:text-slate-100 ${activeFontClass} reading-text`}>
              {currentChapter.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Barra de navegación inferior entre capítulos */}
          <div className="flex items-center justify-between gap-3 pt-8 sm:pt-10 border-t border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => {
                setCurrentChapterIdx((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentChapterIdx === 0}
              className="inline-flex items-center gap-1.5 min-h-11 px-3 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {!isLastChapter ? (
              <button
                onClick={() => {
                  setCurrentChapterIdx((prev) => prev + 1);
                }}
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

      {/* VISTA 2: LECTURA CONTINUA */}
      {viewMode === 'continuous' && (
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

              <div className={`space-y-6 font-reading text-slate-800 dark:text-slate-100 ${activeFontClass} reading-text`}>
                {chapter.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
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

      {/* MODAL FLOTANTE DE ÍNDICE RÁPIDO (Ideal mientras se proyecta) */}
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
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Índice
                </h3>
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
                    currentChapterIdx === idx && viewMode === 'chapters'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-bold ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-pretty">
                      {ch.title}
                    </span>
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

      {/* Botón flotante accesible de Índice para el docente mientras navega */}
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

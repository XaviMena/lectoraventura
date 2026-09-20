import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, Bookmark, X, Image as ImageIcon } from 'lucide-react';
import DownloadStoryButton from './DownloadStoryButton';
import { assetUrl } from '../lib/assetUrl';

export default function ReaderView({
  reading,
  onGoToQuiz,
  fontSize,
  isProjectorMode
}) {
  const [viewMode, setViewMode] = useState('chapters'); // 'chapters' | 'continuous'
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);

  const currentChapter = reading.chapters[currentChapterIdx];
  const isLastChapter = currentChapterIdx === reading.chapters.length - 1;

  // Mapeo dinámico de tamaños de fuente
  const fontClasses = {
    base: 'text-lg md:text-xl leading-relaxed',
    lg: 'text-xl md:text-2xl leading-relaxed',
    xl: 'text-2xl md:text-3xl leading-loose',
    '2xl': 'text-3xl md:text-4xl leading-loose',
    '3xl': 'text-4xl md:text-5xl leading-loose',
  };

  const activeFontClass = fontClasses[fontSize] || fontClasses.lg;

  const handleNavigateChapter = (idx) => {
    setCurrentChapterIdx(idx);
    setIsIndexModalOpen(false);
    if (viewMode === 'continuous') {
      const el = document.getElementById(`capitulo-${reading.chapters[idx].id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 transition-all ${
      isProjectorMode ? 'max-w-4xl' : ''
    }`}>
      
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">
            {reading.genre}
          </p>
          <DownloadStoryButton reading={reading} />
        </div>

        <h1 className="text-3xl sm:text-[2.35rem] font-semibold tracking-tight text-slate-900 dark:text-white font-reading text-balance leading-tight">
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
          <div className="flex items-center gap-4 text-sm">
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
          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200/80 dark:border-slate-800" aria-label="Capítulos">
            {reading.chapters.map((ch, idx) => {
              const shortTitle = ch.title.replace(/^Capítulo\s+\d+:\s*/i, '');
              const isCurrent = idx === currentChapterIdx;
              return (
                <button
                  key={ch.id}
                  onClick={() => setCurrentChapterIdx(idx)}
                  className={`shrink-0 px-3 py-2.5 text-sm border-b-2 transition-colors ${
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

          <article className="pt-8">
            <h2 className="text-2xl sm:text-[1.85rem] font-semibold text-slate-900 dark:text-white mb-6 font-reading tracking-tight">
              {currentChapter.title}
            </h2>

            {/* Ilustración si el capítulo cuenta con ella */}
            {currentChapter.image && (
              <figure className="my-8">
                <img
                  src={assetUrl(currentChapter.image.src)}
                  alt={currentChapter.image.alt}
                  className="w-full h-auto object-cover max-h-[480px] mx-auto rounded-xl"
                  loading="eager"
                />
                <figcaption className="mt-3 text-sm text-center text-slate-400 dark:text-slate-500">
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
          <div className="flex items-center justify-between gap-4 pt-10 border-t border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => {
                setCurrentChapterIdx((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentChapterIdx === 0}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {!isLastChapter ? (
              <button
                onClick={() => {
                  setCurrentChapterIdx((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 text-sm text-slate-900 dark:text-white hover:opacity-70 transition-opacity"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onGoToQuiz}
                className="flex items-center gap-1.5 text-sm text-slate-900 dark:text-white hover:opacity-70 transition-opacity"
              >
                <span>Ir a la evaluación</span>
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
              className="scroll-mt-24"
            >
              <p className="text-[11px] tracking-[0.16em] uppercase text-slate-400 mb-2">
                Capítulo {idx + 1}
              </p>
              <h2 className="text-2xl sm:text-[1.85rem] font-semibold text-slate-900 dark:text-white mb-6 font-reading tracking-tight">
                {chapter.title}
              </h2>

              {chapter.image && (
                <figure className="my-8">
                  <img
                    src={assetUrl(chapter.image.src)}
                    alt={chapter.image.alt}
                    className="w-full h-auto object-cover max-h-[480px] mx-auto rounded-xl"
                    loading="lazy"
                  />
                  <figcaption className="mt-3 text-sm text-center text-slate-400 dark:text-slate-500">
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
              className="inline-flex items-center gap-1.5 text-sm text-slate-900 dark:text-white hover:opacity-70 transition-opacity"
            >
              <span>Ir a la evaluación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL FLOTANTE DE ÍNDICE RÁPIDO (Ideal mientras se proyecta) */}
      {isIndexModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Índice de la Lectura
                </h3>
              </div>
              <button
                onClick={() => setIsIndexModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                    <span className="text-sm truncate">
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
                <span className="flex items-center gap-2 text-sm">
                  <span>🎯</span>
                  <span>Evaluación de Comprensión ({reading.quiz?.length || 0} preguntas)</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante accesible de Índice para el docente mientras navega */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsIndexModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 text-xs border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md hover:border-slate-400 transition-colors"
          title="Abrir índice de capítulos"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Índice</span>
        </button>
      </div>

    </div>
  );
}

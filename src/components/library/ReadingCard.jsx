import React from "react";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { assetUrl } from "../../lib/assetUrl";
import { getReadingProgress } from "../../lib/readingProgress";

export default function ReadingCard({ reading, featured = false }) {
  const isAvailable = reading.status === "available";
  const chapterCount = reading.chapters?.length || 0;
  const quizCount = reading.quiz?.length || 0;
  const saved = isAvailable ? getReadingProgress(reading.id) : null;
  const inQuiz = saved?.screen === "quiz";
  const chapterIndex = Math.min(
    Math.max(0, Number(saved?.chapterIndex) || 0),
    Math.max(0, chapterCount - 1)
  );
  const hasProgress = Boolean(saved) && (inQuiz || chapterIndex > 0);
  const href = inQuiz ? `/lectura/${reading.id}/evaluacion` : `/lectura/${reading.id}`;

  const body = (
    <article
      className={`h-full overflow-hidden rounded-3xl border shadow-sm transition-all ${
        featured
          ? "border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      } ${isAvailable ? "hover:-translate-y-0.5 hover:shadow-md" : "opacity-95"}`}
    >
      <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {reading.cover ? (
          <img
            src={assetUrl(reading.cover)}
            alt={`Portada de ${reading.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-amber-50 dark:from-slate-800 dark:to-slate-900">
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-extrabold uppercase tracking-wide">
            <Sparkles className="w-3 h-3" />
            {reading.genre}
          </span>
          {!isAvailable && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wide">
              Próximamente
            </span>
          )}
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-reading leading-snug">
          {reading.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {reading.synopsis}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            ~{reading.estimatedMinutes} min
          </span>
          {isAvailable && (
            <>
              <span>{chapterCount} capítulos</span>
              <span>{quizCount} preguntas</span>
            </>
          )}
        </div>

        {isAvailable ? (
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 dark:text-blue-400">
            {inQuiz
              ? "Continuar evaluación"
              : hasProgress
                ? `Continuar · capítulo ${chapterIndex + 1}`
                : "Abrir lectura"}
            <ArrowRight className="w-4 h-4" />
          </span>
        ) : (
          <span className="mt-1 text-sm font-bold text-slate-400">Esta historia se incorporará pronto</span>
        )}
      </div>
    </article>
  );

  if (!isAvailable) {
    return <div className="h-full">{body}</div>;
  }

  return (
    <Link to={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-3xl">
      {body}
    </Link>
  );
}

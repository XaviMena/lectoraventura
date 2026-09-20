import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { assetUrl } from "../../lib/assetUrl";

export default function ContinueCard({ item }) {
  if (!item?.reading) return null;
  const { reading, chapterTitle, screen, href, chapterIndex } = item;
  const place =
    screen === "quiz"
      ? "En la evaluación"
      : `${chapterTitle} · ${chapterIndex + 1} de ${reading.chapters.length}`;

  return (
    <article className="overflow-hidden rounded-3xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 shadow-sm">
      <div className="grid sm:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="aspect-[16/9] sm:aspect-auto sm:min-h-[11rem] bg-slate-100 dark:bg-slate-900 overflow-hidden">
          {reading.cover ? (
            <img
              src={assetUrl(reading.cover)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[8rem] flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6 flex flex-col justify-center gap-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Seguir leyendo
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-reading leading-snug text-balance">
            {reading.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{place}</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1">
            <Link
              to={href}
              className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-2xl font-extrabold text-white bg-blue-600 hover:bg-blue-700"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/lectura/${reading.id}?desde=inicio`}
              className="inline-flex items-center justify-center min-h-12 px-5 rounded-2xl font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Empezar de nuevo
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

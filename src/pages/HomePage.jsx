import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, MonitorPlay } from "lucide-react";
import ReadingCard from "../components/library/ReadingCard";
import { getAvailableReadings } from "../data/readings";
import { readingJourney, site } from "../data/site";

export default function HomePage() {
  const featured = getAvailableReadings()[0];

  return (
    <div className="w-full">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400 mb-4">
              {site.subject}
            </p>
            <h1 className="text-[1.85rem] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-reading text-balance leading-[1.15]">
              Un sitio para animar a leer, capítulo a capítulo
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {site.tagline} Aquí el cuento se proyecta en el aula, se lee con calma y se comprende con preguntas de comprensión.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                to="/biblioteca"
                className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-2xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25"
              >
                Ir a la biblioteca
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/aula"
                className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-2xl font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Guía para el aula
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-5">
              Cómo está organizado el sitio
            </h2>
            <ol className="space-y-4">
              {readingJourney.map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Lectura destacada</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Empieza por aquí. Más cuentos se irán sumando a la biblioteca.
            </p>
          </div>
          <Link to="/biblioteca" className="hidden sm:inline-flex text-sm font-extrabold text-blue-600 hover:text-blue-700">
            Ver todas
          </Link>
        </div>
        {featured ? (
          <div className="max-w-xl">
            <ReadingCard reading={featured} featured />
          </div>
        ) : (
          <p className="text-slate-500">Aún no hay lecturas publicadas.</p>
        )}
      </section>

      <section className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid sm:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
            <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Para quienes leen</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Historias con capítulos cortos, ilustraciones y un cuestionario que explica cada respuesta. No se trata solo de terminar el texto: se trata de entenderlo.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
            <MonitorPlay className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Para el aula</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Modo proyector, tamaño de letra y temas de contraste para pizarra digital. Hay una guía con un recorrido de clase: antes, durante y después de leer.
            </p>
            <Link to="/aula" className="inline-flex items-center gap-1 mt-4 text-sm font-extrabold text-blue-600">
              Abrir guía del aula
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { MonitorPlay, Type, Sun, BookOpen, ArrowRight } from "lucide-react";
import { classroomFlow } from "../data/site";

export default function ClassroomPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <header className="mb-10">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
          Para el aula
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-reading">
          Cómo usar LectorAventura en clase
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          El sitio está pensado para proyectarse y para leer en grupo. Esta guía resume el recorrido de una sesión y los controles que ya tienes en la barra superior.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-12">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <MonitorPlay className="w-6 h-6 text-amber-500 mb-3" />
          <h2 className="font-extrabold text-slate-900 dark:text-white">Modo proyector</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Actívalo para subir el contraste y ampliar la letra. Combínalo con pantalla completa.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <Type className="w-6 h-6 text-blue-600 mb-3" />
          <h2 className="font-extrabold text-slate-900 dark:text-white">Tamaño de texto</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Ajusta la lectura según la distancia del grupo y el tamaño de la pizarra digital.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <Sun className="w-6 h-6 text-indigo-500 mb-3" />
          <h2 className="font-extrabold text-slate-900 dark:text-white">Temas de contraste</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Claro, sepia (tipo libro) u oscuro, según la luz del aula.
          </p>
        </div>
      </section>

      <section className="space-y-5 mb-12">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Recorrido sugerido de clase</h2>
        {classroomFlow.map((block) => (
          <article
            key={block.moment}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{block.moment}</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{block.minutes}</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-extrabold mb-1">
            <BookOpen className="w-5 h-5" />
            Empieza por la biblioteca
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Abre el cuento disponible, lee un capítulo y cierra con la evaluación.
          </p>
        </div>
        <Link
          to="/biblioteca"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-white bg-blue-600 hover:bg-blue-700"
        >
          Ir a lecturas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

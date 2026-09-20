import React, { useMemo, useState } from "react";
import ReadingCard from "../components/library/ReadingCard";
import { getCatalogReadings } from "../data/readings";

export default function LibraryPage() {
  const readings = getCatalogReadings();
  const genreOrder = ["Aventura", "Leyenda", "Mito", "Ciencia ficción"];
  const genres = useMemo(() => {
    const present = new Set(readings.map((reading) => reading.genre));
    return ["Todos", ...genreOrder.filter((name) => present.has(name))];
  }, [readings]);
  const [genre, setGenre] = useState("Todos");

  const visible = readings.filter((reading) => genre === "Todos" || reading.genre === genre);
  const availableCount = readings.filter((reading) => reading.status === "available").length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <header className="max-w-3xl mb-8">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
          Biblioteca
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-reading">
          Elige una lectura
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
          Cada título incluye capítulos para leer en el aula y una evaluación de comprensión. Hay {availableCount} lecturas listas; las demás están marcadas como próximas.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {genres.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setGenre(item)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              genre === item
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {visible.map((reading) => (
          <ReadingCard key={reading.id} reading={reading} />
        ))}
      </div>
    </div>
  );
}

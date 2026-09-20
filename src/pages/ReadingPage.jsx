import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReaderView from "../components/ReaderView";
import { getReadingById } from "../data/readings";
import { useSettings } from "../context/SettingsContext";

export default function ReadingPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const { fontSize, isProjectorMode } = useSettings();
  const reading = getReadingById(readingId);

  if (!reading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lectura no encontrada</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Ese cuento no está en la biblioteca.</p>
        <Link to="/biblioteca" className="inline-block mt-6 font-extrabold text-blue-600">
          Volver a la biblioteca
        </Link>
      </div>
    );
  }

  if (reading.status !== "available") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-2">Próximamente</p>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-reading">{reading.title}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">{reading.synopsis}</p>
        <Link to="/biblioteca" className="inline-block mt-6 font-extrabold text-blue-600">
          Ver lecturas disponibles
        </Link>
      </div>
    );
  }

  return (
    <ReaderView
      key={reading.id}
      reading={reading}
      fontSize={fontSize}
      isProjectorMode={isProjectorMode}
      onGoToQuiz={() => {
        navigate(`/lectura/${reading.id}/evaluacion`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  );
}

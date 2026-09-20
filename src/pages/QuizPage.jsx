import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuizView from "../components/QuizView";
import { getReadingById } from "../data/readings";
import { useSettings } from "../context/SettingsContext";
import { getReadingProgress } from "../lib/readingProgress";

export default function QuizPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const { fontSize, isProjectorMode } = useSettings();
  const reading = getReadingById(readingId);

  if (!reading || reading.status !== "available" || !reading.quiz?.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Evaluación no disponible</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Esta lectura todavía no tiene cuestionario o no está publicada.
        </p>
        <Link to="/biblioteca" className="inline-block mt-6 font-extrabold text-blue-600">
          Volver a la biblioteca
        </Link>
      </div>
    );
  }

  const saved = getReadingProgress(reading.id);
  const resumeQuiz = saved?.screen === "quiz";
  const lastQuestion = Math.max(0, reading.quiz.length - 1);
  const savedAnswers = resumeQuiz && Array.isArray(saved?.quizAnswers) ? saved.quizAnswers : [];
  const initialQuestionIndex = resumeQuiz
    ? Math.min(Math.max(savedAnswers.length, Number(saved?.quizIndex) || 0), lastQuestion)
    : 0;

  return (
    <QuizView
      key={reading.id}
      reading={reading}
      fontSize={fontSize}
      isProjectorMode={isProjectorMode}
      initialQuestionIndex={initialQuestionIndex}
      initialAnswers={savedAnswers}
      onBackToReading={() => {
        navigate(`/lectura/${reading.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  );
}

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Award, RotateCcw, BookOpen, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';

export default function QuizView({
  reading,
  onBackToReading,
  fontSize,
  isProjectorMode
}) {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]); // { qId, selectedId, isCorrect }
  const [isFinished, setIsFinished] = useState(false);

  const questions = reading.quiz;
  const currentQ = questions[currentQIdx];

  const handleSelectOption = (optionId) => {
    if (isAnswerSubmitted) return; // Ya respondió esta pregunta
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!selectedOpt?.isCorrect;

    setIsAnswerSubmitted(true);
    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        questionText: currentQ.question,
        selectedId: selectedOptionId,
        isCorrect,
        explanation: currentQ.explanation
      }
    ]);

    if (isCorrect) {
      // Pequeño estallido de confeti por acierto
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Fin del cuestionario
      setIsFinished(true);
      const totalCorrect = answersHistory.filter((a) => a.isCorrect).length;
      if (totalCorrect >= 4) {
        // Gran celebración de confeti
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIdx(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setAnswersHistory([]);
    setIsFinished(false);
  };

  const totalScore = answersHistory.filter((a) => a.isCorrect).length;
  const percentage = Math.round((totalScore / questions.length) * 100);

  // Escala de fuentes adaptada
  const fontSizes = {
    base: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
    '3xl': 'text-4xl'
  };
  const qFont = fontSizes[fontSize] || fontSizes.xl;

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 ${
      isProjectorMode ? 'max-w-4xl' : ''
    }`}>
      
      {!isFinished ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Barra de Progreso Superior */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <HelpCircle className="w-4 h-4" />
                Pregunta {currentQIdx + 1} de {questions.length}
              </span>
              <span>Aciertos: {answersHistory.filter(a => a.isCorrect).length}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQIdx) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Tarjeta de Pregunta */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md">
            
            {/* Categoría de la pregunta */}
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                {currentQ.type === 'literal' && 'Comprensión Literal'}
                {currentQ.type === 'vocabulario' && 'Vocabulario en Contexto'}
                {currentQ.type === 'inferencial' && 'Deducción e Inferencia'}
                {currentQ.type === 'analisis' && 'Análisis de Personajes'}
                {currentQ.type === 'reflexion' && 'Reflexión y Sentido Crítico'}
              </span>
            </div>

            {/* Enunciado de la Pregunta */}
            <h2 className={`${qFont} font-extrabold text-slate-900 dark:text-white leading-snug mb-8 font-reading text-pretty`}>
              {currentQ.question}
            </h2>

            {/* Opciones de Respuesta */}
            <div className="space-y-3.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 hover:border-blue-300 text-slate-800 dark:text-slate-100';

                if (isAnswerSubmitted) {
                  if (opt.isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${btnStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 text-sm ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="text-base sm:text-lg font-medium leading-snug pt-0.5">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Retroalimentación Explicativa Didáctica */}
            {isAnswerSubmitted && (
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-amber-900 dark:text-amber-200 mb-1">
                      {currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect
                        ? '¡Excelente deducción!'
                        : '¡Casi! Revisemos la clave del texto:'}
                    </h4>
                    <p className="text-sm sm:text-base text-amber-800 dark:text-amber-300/90 leading-relaxed font-reading">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Acción Inferior */}
            <div className="mt-8 flex justify-end">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  className="px-6 sm:px-8 py-3.5 rounded-2xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/25 transition-all"
                >
                  Comprobar Respuesta
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-7 sm:px-9 py-3.5 rounded-2xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/25 transition-all"
                >
                  <span>{currentQIdx < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* PANTALLA DE RESULTADOS FINALES */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-8 animate-fade-in">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              {percentage === 100 && '¡Misión Cumplida, Gran Detective!'}
              {percentage >= 80 && percentage < 100 && '¡Excelente Comprensión Lectora!'}
              {percentage >= 60 && percentage < 80 && '¡Buen Trabajo en Equipo!'}
              {percentage < 60 && '¡Buen Intento! La práctica hace al maestro'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-base">
              Has completado las preguntas sobre <strong>{reading.title}</strong>.
            </p>
          </div>

          {/* Tarjeta de Puntuación */}
          <div className="max-w-xs mx-auto p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
              {totalScore} / {questions.length}
            </div>
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {percentage}% de aciertos
            </div>
          </div>

          {/* Desglose de Respuestas */}
          <div className="text-left max-w-xl mx-auto space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Resumen de la investigación:
            </h3>
            {answersHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-sm"
              >
                {item.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {idx + 1}. {item.questionText}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Evaluación</span>
            </button>
            <button
              onClick={onBackToReading}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Volver a la Lectura</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

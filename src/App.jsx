import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import ReadingPage from "./pages/ReadingPage";
import QuizPage from "./pages/QuizPage";
import ClassroomPage from "./pages/ClassroomPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/biblioteca" element={<LibraryPage />} />
            <Route path="/lectura/:readingId" element={<ReadingPage />} />
            <Route path="/lectura/:readingId/evaluacion" element={<QuizPage />} />
            <Route path="/aula" element={<ClassroomPage />} />
            <Route path="/acerca" element={<AboutPage />} />
            <Route path="/lecturas" element={<Navigate to="/biblioteca" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

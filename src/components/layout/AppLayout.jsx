import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { useSettings } from "../../context/SettingsContext";

export default function AppLayout() {
  const { colorTheme, themeClass, isProjectorMode, setIsProjectorMode } = useSettings();
  const location = useLocation();
  const isReadingRoute = location.pathname.startsWith("/lectura/");
  const isImmersiveProjector = isProjectorMode && isReadingRoute;

  return (
    <div
      className={`min-h-dvh transition-colors duration-200 flex flex-col ${themeClass} ${
        isProjectorMode ? "projector-mode" : ""
      }`}
      data-theme={colorTheme}
    >
      <ScrollToTop />

      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Saltar al contenido
      </a>

      {!isImmersiveProjector && <Navbar />}

      {isProjectorMode && !isReadingRoute && (
        <div className="border-b border-slate-200 dark:border-slate-800 text-xs text-center py-1.5 px-4 text-slate-500 flex items-center justify-center gap-2">
          <span>Modo Proyector preparado (abre cualquier lectura para ver en pantalla dividida)</span>
          <button
            type="button"
            onClick={() => setIsProjectorMode(false)}
            className="text-slate-800 dark:text-slate-200 font-semibold hover:underline"
          >
            Salir
          </button>
        </div>
      )}

      <main id="contenido" className="flex-1 flex flex-col min-h-0">
        <Outlet />
      </main>

      {!isImmersiveProjector && <Footer />}
    </div>
  );
}


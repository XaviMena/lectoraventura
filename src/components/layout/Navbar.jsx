import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";
import ProjectorControls from "../ProjectorControls";
import { navItems, site } from "../../data/site";
import { useSettings } from "../../context/SettingsContext";

const linkClass = ({ isActive }) =>
  `text-sm transition-colors ${
    isActive
      ? "text-slate-900 dark:text-white"
      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
  }`;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const settings = useSettings();
  const isReadingRoute = location.pathname.startsWith("/lectura/");
  const readingBase = location.pathname.replace(/\/evaluacion$/, "");

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200/80 dark:border-slate-800 pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
        <NavLink to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0" onClick={() => setIsMenuOpen(false)}>
          <BookOpen className="w-5 h-5 text-slate-800 dark:text-slate-100 shrink-0" strokeWidth={1.75} />
          <div className="min-w-0 leading-tight">
            <p className="font-semibold text-[15px] tracking-tight text-slate-900 dark:text-white">
              {site.name}
            </p>
            <p className="text-[11px] tracking-[0.12em] uppercase text-slate-400 dark:text-slate-500 truncate max-w-[11rem] sm:max-w-none">
              {site.subject}
            </p>
          </div>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6" aria-label="Secciones del sitio">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ProjectorControls {...settings} />
          </div>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 -mr-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800 px-4 py-4 space-y-5 max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
          <nav className="flex flex-col" aria-label="Menú móvil">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `${linkClass({ isActive })} py-3 text-base border-b border-slate-100 dark:border-slate-800`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <ProjectorControls {...settings} />
        </div>
      )}

      {isReadingRoute && (
        <div className="border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 min-h-10 flex items-center gap-1 sm:gap-4 text-sm overflow-x-auto scrollbar-none">
            <NavLink to="/biblioteca" className="shrink-0 px-3 py-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              Biblioteca
            </NavLink>
            <NavLink
              to={readingBase}
              end
              className={({ isActive }) =>
                `shrink-0 px-3 py-2.5 ${
                  isActive && !location.pathname.endsWith("/evaluacion")
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`
              }
            >
              Lectura
            </NavLink>
            <NavLink
              to={`${readingBase}/evaluacion`}
              className={({ isActive }) =>
                `shrink-0 px-3 py-2.5 ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`
              }
            >
              Evaluación
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

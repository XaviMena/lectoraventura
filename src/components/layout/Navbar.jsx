import React, { useState } from "react";
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

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <NavLink to="/" className="flex items-center gap-2.5 min-w-0" onClick={() => setIsMenuOpen(false)}>
          <BookOpen className="w-5 h-5 text-slate-800 dark:text-slate-100 shrink-0" strokeWidth={1.75} />
          <div className="min-w-0 leading-tight">
            <p className="font-semibold text-[15px] tracking-tight text-slate-900 dark:text-white">
              {site.name}
            </p>
            <p className="text-[11px] tracking-[0.12em] uppercase text-slate-400 dark:text-slate-500 truncate">
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
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800 px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-3" aria-label="Menú móvil">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={linkClass}
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-4 text-sm">
            <NavLink to="/biblioteca" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              Biblioteca
            </NavLink>
            <NavLink
              to={readingBase}
              end
              className={({ isActive }) =>
                isActive && !location.pathname.endsWith("/evaluacion")
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }
            >
              Lectura
            </NavLink>
            <NavLink
              to={`${readingBase}/evaluacion`}
              className={({ isActive }) =>
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
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

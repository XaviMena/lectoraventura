import React from "react";
import { Link } from "react-router-dom";
import { site, navItems } from "../../data/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            <strong>{site.name}</strong> — {site.subject}
          </p>
          <p className="mt-1 max-w-md">
            {site.author}. {site.subject} para leer en el aula o en casa.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 font-semibold" aria-label="Pie de página">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-blue-600 dark:hover:text-blue-400">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

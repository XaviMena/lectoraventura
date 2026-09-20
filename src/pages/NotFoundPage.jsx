import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Página no encontrada</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Esa dirección no forma parte de LectorAventura.
      </p>
      <Link
        to="/"
        className="inline-flex mt-6 px-5 py-2.5 rounded-2xl font-extrabold text-white bg-blue-600"
      >
        Ir al inicio
      </Link>
    </div>
  );
}

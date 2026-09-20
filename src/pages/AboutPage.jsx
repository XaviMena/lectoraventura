import React from "react";
import { site } from "../data/site";

const questionTypes = [
  { name: "Literal", text: "Recuperar información que está dicha en el texto." },
  { name: "Vocabulario", text: "Entender una palabra o expresión por el contexto." },
  { name: "Inferencia", text: "Deducir lo que no está escrito de forma directa." },
  { name: "Análisis", text: "Relacionar personajes, acciones y causas." },
  { name: "Reflexión", text: "Interpretar el sentido de una metáfora o un mensaje." },
];

export default function AboutPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400 mb-3">
        {site.subject}
      </p>
      <h1 className="text-2xl sm:text-[2.35rem] font-semibold tracking-tight text-slate-900 dark:text-white font-reading leading-tight text-balance">
        Acerca de {site.name}
      </h1>
      <p className="mt-4 text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
        {site.name} es un recurso digital para la asignatura de {site.subject}.
        Propone lecturas por capítulos, ilustraciones y una evaluación de comprensión
        con retroalimentación, pensado para el trabajo en el aula o en casa.
      </p>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Propósito
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
          Favorecer el gusto por leer y fortalecer la comprensión. Cada cuento se
          puede proyectar, leer con calma y cerrar con preguntas que no se limitan
          a recordar datos: también piden inferir, analizar y reflexionar.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Cómo está organizada cada lectura
        </h2>
        <ul className="mt-4 space-y-2.5 text-slate-600 dark:text-slate-300 leading-relaxed">
          <li>Portada con género, tiempo estimado y sinopsis.</li>
          <li>Capítulos breves, con ilustración cuando aporta al relato.</li>
          <li>Lectura por capítulos o en continuo, con índice para retomar en clase.</li>
          <li>Evaluación de comprensión con explicación de cada respuesta.</li>
          <li>Descarga del cuento en PDF para imprimir o leer fuera de línea.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight mb-4">
          Tipos de comprensión
        </h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {questionTypes.map((item) => (
            <div key={item.name} className="py-3.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Créditos y responsabilidad
        </h2>
        <dl className="mt-5 space-y-5 text-slate-600 dark:text-slate-300">
          <div>
            <dt className="text-[11px] tracking-[0.16em] uppercase text-slate-400">
              Autor y responsable del proyecto
            </dt>
            <dd className="mt-1 text-slate-900 dark:text-white font-medium">{site.author}</dd>
            <dd className="mt-1 text-sm leading-relaxed">
              Concepción pedagógica, criterio editorial, selección y revisión de
              contenidos, y publicación del sitio. La responsabilidad académica y
              legal del recurso recae en el autor.
            </dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.16em] uppercase text-slate-400">
              Asistencia de inteligencia artificial
            </dt>
            <dd className="mt-1 text-sm leading-relaxed">
              Este sitio se desarrolló con apoyo de inteligencia artificial (Grok, xAI)
              como herramienta de programación, redacción e ilustración. La IA no es
              coautora: no dirige el proyecto ni asume la autoría. Los textos, el
              diseño y las imágenes generados con esa asistencia fueron revisados
              y adoptados por {site.author} para su uso educativo.
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          En Ecuador, la autoría de una obra corresponde a la persona que la crea,
          dirige y publica. La inteligencia artificial se declara aquí como medio
          técnico de apoyo, con transparencia hacia estudiantes, familias y docentes.
        </p>
      </section>
    </div>
  );
}

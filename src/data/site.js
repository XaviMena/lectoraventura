export const site = {
  name: "LectorAventura",
  nameAccent: "Aventura",
  subject: "Animación a la Lectura",
  author: "Xavier Mena Paredes",
  audience: "10-11 años",
  grades: "5.º y 6.º de EGB",
  tagline: "Leer juntos, comprender mejor y descubrir el gusto por las historias.",
  description:
    "Sitio de aula para animar a la lectura: cuentos por capítulos, ilustraciones y evaluaciones de comprensión con retroalimentación.",
};

export const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/aula", label: "Para el aula" },
  { to: "/acerca", label: "Acerca" },
];

export const readingJourney = [
  {
    step: "1",
    title: "Elige un cuento",
    text: "En la biblioteca encuentras lecturas pensadas para 10 y 11 años, con tiempo estimado y género.",
  },
  {
    step: "2",
    title: "Lee por capítulos",
    text: "Puedes proyectar un capítulo a la vez o leer el texto completo. El índice siempre está a mano.",
  },
  {
    step: "3",
    title: "Comprueba lo que entendiste",
    text: "Al final hay preguntas literales, de vocabulario, inferencia, análisis y reflexión, con explicación.",
  },
];

export const classroomFlow = [
  {
    moment: "Antes de leer",
    minutes: "5-8 min",
    items: [
      "Mostrar la portada, el género y la sinopsis.",
      "Activar saberes previos: ¿qué sabemos de relojes, leyendas o bibliotecas?",
      "Acordar un propósito de lectura (descubrir, imaginar, investigar).",
    ],
  },
  {
    moment: "Durante la lectura",
    minutes: "20-30 min",
    items: [
      "Usar el modo capítulo para proyectar un episodio a la vez.",
      "Pausar en las ilustraciones y en las frases en cursiva.",
      "Dejar que el grupo anticipe qué pasará en el siguiente capítulo.",
    ],
  },
  {
    moment: "Después de leer",
    minutes: "10-15 min",
    items: [
      "Pasar a la evaluación de comprensión.",
      "Comentar las explicaciones, no solo el puntaje.",
      "Cerrar con una pregunta abierta: ¿qué tesoro rescataríamos nosotros?",
    ],
  },
];

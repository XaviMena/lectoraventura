---
name: nueva-lectura
description: Guía editorial y técnica obligatoria para crear, adaptar e incorporar un nuevo cuento, leyenda, mito o relato de aventura/ciencia ficción en LectorAventura (`src/data/readings.js`), incluyendo voz ecuatoriana juvenil, fidelidad narrativa sin suavizar ni acomodar tramas, bosquejo previo, ilustraciones 16:9 (1 o 2 por capítulo), evaluación de 5 preguntas y validación técnica.
---

# Nueva lectura en LectorAventura

Usa este skill cada vez que se vaya a crear, adaptar o incorporar una nueva lectura (cuento, leyenda, mito, aventura o ciencia ficción) en **LectorAventura**.

---

## 1. Flujo obligatorio antes de escribir

1. **Esperar la historia definida por Xavier Mena Paredes:** él define de qué trata, qué versión se cuenta y qué elementos se quedan. No elegir versión por cuenta propia ni inventar giros, escenas o moralejas que él no haya pedido.
2. **Presentar bosquejo previo:** antes de redactar texto, preguntas o generar imágenes, entregar un bosquejo capítulo por capítulo (estructura base de **4 capítulos**, ampliable si la obra lo amerita y Xavier lo aprueba) indicando qué ocurre en cada capítulo y si llevará **1 o 2 ilustraciones**.
3. **Esperar visto bueno:** sin bosquejo aprobado no se redacta la lectura ni se generan imágenes.
4. **Cierre completo:** el capítulo final debe cerrar el conflicto por completo; no cortar relatos a la mitad.

---

## 2. Reglas de narrativa y estilo (Básica Superior — Ecuador)

- **Público y lengua:** estudiantes de **Básica Superior (8.º–10.º EGB) en Ecuador**. Español del Ecuador real, natural y directo, el que se entiende y se escucha en clase.
- **Frases cortas y ritmo vivo:** oraciones limpias y claras pensadas para leerse proyectadas en el aula. Capítulos ágiles (referencia: **5 a 11 párrafos por capítulo**, lectura total de ~10–15 minutos).
- **Prohibido léxico rebuscado o peninsular:** nada de palabras artificiosas, arcaísmos gratuitos ni español de España (*anteojos, ayuntamiento, rosetón, trinquete, tinta sepia, vosotros, coger* en sentidos ajenos, etc.).
- **Términos de oficio o época por contexto:** si aparece una palabra menos cotidiana propia del relato (por ejemplo *corbeta*, *atrio*, *capataz*), debe entenderse sola dentro de la escena, nunca insertando una definición de diccionario.
- **Narraciones reales, no acomodadas:**
  - Respetar la crudeza y verdad del relato original (leyenda tradicional, mito, novela o cuento).
  - Si la historia trae **violencia, muerte, miedo, castigo, pérdida o un final duro**, se cuenta tal cual. **No suavizar, no censurar ni recortar** hechos clave.
  - **Prohibido inventar moralejas "de cartilla" o finales felices acomodados** que traicionen el tono real de la obra.
- **Contraejemplo prohibido:** *El misterio del reloj de la torre* es el ejemplo de texto aburrido, recargado y difícil; no imitar nunca ese estilo.
- **Autoría estricta:** `author` lleva el nombre real del autor o la tradición (`"Julio Verne"`, `"Tradición popular"`, `"Tradición oral andina"`, etc.). `"Xavier Mena Paredes"` va en `author` **únicamente** cuando él lo indique de forma expresa (el pie de página y Acerca de ya lo nombran como responsable del sitio).

---

## 3. Ilustraciones (`public/images/`)

- **Formato:** **16:9** apaisado, guardado en `public/images/` con prefijo consistente por lectura (ej. `public/images/mi_lectura_escena1.jpg`).
- **Coherencia visual:** generar primero las escenas/personajes canónicos y mantener consistencia visual entre capítulos.
- **Portada:** la propiedad `cover` de la lectura normalmente corresponde a la primera escena del capítulo 1.
- **Cantidad por capítulo (1 o 2 escenas):**
  - **1 fotografía por capítulo** (capítulos estándar):
    ```js
    image: {
      src: "/images/ejemplo_cap1.jpg",
      alt: "Descripción clara de la escena",
      caption: "Figura 1: Pie de imagen breve."
    }
    ```
  - **2 fotografías por capítulo** (cuando el capítulo cambia de escenario o acción a mitad del relato):
    ```js
    images: [
      {
        src: "/images/ejemplo_cap2_a.jpg",
        alt: "Descripción de la primera escena",
        caption: "Figura 2: Primera parte del capítulo."
      },
      {
        src: "/images/ejemplo_cap2_b.jpg",
        alt: "Descripción de la segunda escena",
        caption: "Figura 3: Cambio de escena al avanzar el relato.",
        fromParagraph: 5 // 1-indexed; opcional (si se omite, cambia a la mitad)
      }
    ]
    ```
  - El lector (`src/components/ReaderView.jsx`), el helper `src/lib/chapterImages.js` y el PDF (`src/lib/storyPdf.js`) soportan automáticamente tanto `image` como `images` (en Modo Proyector hace transición `fade` automática al bajar, en lectura normal se intercala antes del párrafo correspondiente y en PDF se imprime junto al texto).

---

## 4. Requerimientos técnicos en `src/data/readings.js`

Añadir el objeto al arreglo `readings` en `src/data/readings.js` respetando exactamente estos campos:

- `id`: slug único en `kebab-case` (sin tildes ni espacios).
- `title`: título de la lectura.
- `subtitle`: género breve o lugar/contexto (ej. `"Leyenda de Quito · San Diego"`).
- `estimatedMinutes`: número entero aproximado de minutos de lectura.
- `recommendedAge`: `"Básica superior"`.
- `author`: autor real o tradición (nunca autoadjudicar).
- `genre`: **solo uno de estos cuatro valores exactos**:
  - `"Aventura"`
  - `"Leyenda"`
  - `"Mito"`
  - `"Ciencia ficción"`
- `status`: `"available"`.
- `isNew`: `true` para estrenos recientes (opcional).
- `cover`: ruta desde raíz pública (ej. `"/images/ejemplo_cap1.jpg"`).
- `tags`: 3 a 4 palabras clave cortas.
- `skills`: `["Literal", "Vocabulario", "Inferencia", "Análisis", "Reflexión"]`.
- `synopsis`: resumen breve y atractivo (2–3 líneas reales, sin spoilers innecesarios ni sermones).
- `chapters`: arreglo de capítulos, cada uno con `id` numérico consecutivo (`1`, `2`, ...), `title` (`"Capítulo 1: ..."`), `image` o `images`, y `content` (arreglo de párrafos en texto plano).
- `quiz`: exactamente **5 preguntas**, una por cada tipo exacto que reconoce `src/components/QuizView.jsx`:
  1. `type: "literal"` — Comprensión Literal
  2. `type: "vocabulario"` — Vocabulario en Contexto
  3. `type: "inferencial"` — Deducción e Inferencia (**usar `"inferencial"`, no `"inferencia"`**, para que `QuizView.jsx` muestre el distintivo correcto)
  4. `type: "analisis"` — Análisis de Personajes
  5. `type: "reflexion"` — Reflexión y Sentido Crítico

  Cada pregunta debe incluir:
  - `id`: `"q1"` a `"q5"`
  - `question`: enunciado claro en español ecuatoriano
  - `type`: uno de los 5 valores exactos anteriores
  - `options`: 4 opciones (`id: "a" | "b" | "c" | "d"`, `text`, `isCorrect: true | false`, exactamente una correcta)
  - `explanation`: explicación breve y directa anclada en lo que pasa en el relato.

- **PDF:** `src/lib/storyPdf.js` genera el PDF para cualquier lectura nueva automáticamente; **no crear scripts individuales por título**.

---

## 5. Verificación y publicación

1. Verificar que todas las rutas `src` existan dentro de `public/images/`.
2. Verificar `genre`, `status`, `author` y los 5 `type` del `quiz` (`literal`, `vocabulario`, `inferencial`, `analisis`, `reflexion`).
3. Ejecutar `npm run build` y confirmar cero errores.
4. Subir a `main` para prueba local (`git pull origin main && npm run dev`).
5. Publicar en producción (`gh-pages` con `GITHUB_PAGES=true npm run build`, `404.html` y `.nojekyll`) **únicamente** cuando Xavier confirme.

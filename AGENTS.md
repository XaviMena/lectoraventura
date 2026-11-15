# LectorAventura — cuentos

Xavier Mena Paredes define cada historia: de qué trata, qué versión se cuenta y qué se queda. No inventar trama, moraleja ni escenas que él no haya pedido.

Si el cuento o la historia traen violencia o muerte, se cuentan. No se cortan ni se suavizan: quitarlos daña el relato.

## Prosa

- Básica superior. Español del Ecuador, el que se entiende en clase.
- Frases cortas. Palabras de todos los días.
- Sin léxico rebuscado ni de España (anteojos, ayuntamiento, rosetón, trinquete, tinta sepia).
- Un término de oficio se entiende por la escena, no con una definición de diccionario.
- *El misterio del reloj de la torre* es el ejemplo de un texto aburrido y difícil. No se imita.

## Antes de escribir

1. Esperar la historia que él indique. No elegir la versión por cuenta propia.
2. Presentar un bosquejo previo (base de cuatro capítulos, ampliable si la obra lo pide y él lo aprueba) y esperar su visto bueno. Sin bosquejo aprobado no hay texto, preguntas ni imágenes.
3. El último capítulo es el final. El conflicto queda cerrado. No se corta el cuento a la mitad.
4. El autor no se pone solo. Si la obra es de otra persona, `author` lleva ese nombre. «Xavier Mena Paredes» entra en `author` solo cuando él lo diga de forma expresa. El pie de página y Acerca de lo nombran como responsable del sitio, no como autor de cada relato.

## Cómo incorporar una lectura

Seguir la guía completa del skill local [`.agents/skills/nueva-lectura/SKILL.md`](.agents/skills/nueva-lectura/SKILL.md) (y el skill `nueva-lectura`):

1. Generar 1 o 2 ilustraciones 16:9 por capítulo según su extensión (cada una única y representativa). La primera del capítulo 1 es la portada (`cover`). Personajes canónicos primero; el resto con `image_edit`.
2. Guardar en `public/images/`.
3. Añadir el objeto en `src/data/readings.js` (usando `image` para 1 escena o `images` con `fromParagraph` para 2 escenas).
4. `genre` solo: **Aventura**, **Leyenda**, **Mito** o **Ciencia ficción**. El lugar va en `subtitle`.
5. `status`: `available`.
6. Capítulos ágiles (referencia 5–11 párrafos por capítulo) + cinco preguntas (`literal`, `vocabulario`, `inferencial`, `analisis`, `reflexion`).
7. PDF: el generador de `src/lib/storyPdf.js` sirve para todas; no hacer un script por título.

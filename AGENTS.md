# LectorAventura — reglas de cuentos

Al iniciar **cualquier lectura nueva** (leyenda, aventura o mito), aplicar esto sin preguntar y sin suavizar.

## Público

Básica superior (adolescentes). Registro preciso, no infantil. Nada de explicar la leyenda como si el lector no pudiera oír “diablo”, “alma” o “tripas”.

## Lenguaje — sin guardrails

- Un solo hilo narrativo. No “unos dicen / otros dicen / hay quien afirma”.
- Usar las palabras medulares de la tradición: **diablo, diablillos, alma, tripas, caja ronca, encapuchados**, etc. No sustituirlas por eufemismos.
- No disculparse en el texto (“no es un villano de cine”, “no hace falta describir el acto”, “no es un simple susto”).
- No corregir al lector (“no era una niña”, “no es un cuento para distraerse”).
- Contar el pacto, la profanación o el horror como los cuenta el pueblo. Una versión, un desenlace.

## Gráficos — sin guardrails infantiles

- Estilo **novela gráfica / leyenda urbana para adolescentes**: proporciones realistas, luz cinematográfica, atmósfera.
- No cuento infantil: nada de caras redondas, diablillos “tiernos”, colores pastel de libro de 8 años.
- Personajes adolescentes o adultos según el relato. Anclar al lugar real (Quito, San Roque, San Diego, San Francisco).
- El miedo se ve: procesión, umbral, cementerio, tambor. Sin gore explícito de despiece; sí la escena que la leyenda exige.

## Cómo incorporar una lectura

1. Investigar la tradición y elegir **una** versión.
2. Generar 4 ilustraciones 16:9 (portada = cap. 1). Personaje canónico primero; el resto con `image_edit`.
3. Guardar en `public/images/`.
4. Añadir el objeto en `src/data/readings.js`.
5. `genre` solo: **Aventura**, **Leyenda**, **Mito** o **Ciencia ficción**. El lugar va en `subtitle`.
6. `author`: Xavier Mena Paredes. `status`: `available`.
7. Cuatro capítulos + cinco preguntas (literal, vocabulario, inferencia, análisis, reflexión).
8. PDF: el generador de `src/lib/storyPdf.js` sirve para todas; no hacer un script por título.

# 14vo Encuentro de Jóvenes Investigadores e Investigadoras

Pon aquí las fotos originales (JPG, PNG, HEIC o WEBP, del tamaño que sean).

Si quieres, agrega un archivo `notas.txt` con una línea por foto:

    nombre-del-archivo.jpg | fecha (AAAA-MM-DD) | descripción para la galería

Si no hay fecha, se toma de los metadatos de la foto.

Cuando estén listas, pídele a Claude que las agregue a la galería. Claude:
1. Las convierte a WEBP (versión grande de 1600 px y miniatura de 480x360).
2. Las copia a `public/images/galeria/congresos/<año>/`.
3. Las agrega a `src/data/galeria.js` en la sección "congresos".

Esta carpeta no se sube a GitHub ni se publica: solo sirve para dejar los originales.

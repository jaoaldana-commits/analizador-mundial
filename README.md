# Analizador Especulativo — Mundial 2026

Sitio estático informativo con predicciones estadísticas del Mundial 2026 (modelo Poisson sobre ratings tipo Elo). Listo para desplegar en Vercel y monetizar con Google AdSense.

## Estructura

```
index.html          → Portada con los 12 grupos y explicación del modelo
predictor.html      → Predictor interactivo (cualquier selección vs cualquier selección)
eliminatorias.html  → Cuadro completo proyectado: 16avos a la final (FIFA 73–104)
grupos/a.html…l.html→ Análisis editorial + tabla y marcadores proyectados por grupo
privacidad.html     → Política de privacidad y cookies (requisito de AdSense)
css/style.css       → Estilos
js/resultados.js    → ⚡ RESULTADOS REALES: el único archivo que editas durante el torneo
js/model.js         → Datos de las 48 selecciones + motor Poisson/Elo + cuadro FIFA
robots.txt          → SEO
sitemap.xml         → SEO
```

## Desplegar en Vercel (5 minutos)

1. Crea un repo en GitHub (ej. `boxcode-sv/analizador-mundial`) y sube esta carpeta.
2. En Vercel: **Add New → Project → importa el repo**. Framework: **Other** (es estático, sin build). Deploy.
3. Conecta tu dominio propio en **Settings → Domains** (necesario para AdSense; el subdominio .vercel.app no sirve para monetizar).

## Antes de publicar: reemplazos obligatorios

Busca y reemplaza en todos los archivos:

- `https://TU-DOMINIO.com` → tu dominio real (está en las etiquetas canonical, sitemap.xml y robots.txt).
- `contacto@TU-DOMINIO.com` → tu correo real (en privacidad.html).

## Activar Google AdSense

1. Crea/usa tu cuenta en [adsense.google.com](https://adsense.google.com) y registra tu dominio.
2. AdSense te dará un **script global** (`ca-pub-XXXXXXXXXXXX`). Pégalo en el `<head>` de cada página, donde está el comentario:
   `<!-- AdSense: pega aquí el script global de tu cuenta -->`
3. Crea bloques de anuncios (display responsivo recomendado) y pega cada `<ins class="adsbygoogle">…</ins>` dentro de los `<div class="ad-slot">` marcados con el comentario correspondiente. Hay 2 espacios por página en posiciones de buen rendimiento (tras el primer bloque de contenido y al final).
4. Verifica el sitio y espera la aprobación (días a ~2 semanas). Mientras tanto los espacios muestran un placeholder discreto.

### Consejos para la aprobación y políticas

- No agregues lenguaje de apuestas ("pick", "apuesta segura", cuotas de casas) ni enlaces a sitios de gambling.
- Mantén visible el disclaimer del footer (ya incluido).
- No uses logos, trofeo ni la marca "FIFA" en el branding del sitio o dominio.
- Agregar contenido nuevo regularmente (notas por jornada, análisis de octavos) acelera la aprobación y mejora el SEO.

## SEO incluido

- Title y meta description únicos por página
- Canonical y Open Graph
- Contenido editorial original por grupo
- sitemap.xml + robots.txt (envía el sitemap en Google Search Console)

## Actualizar con resultados reales (el corazón del sitio)

El archivo `js/resultados.js` trae los **72 partidos de fase de grupos pre-cargados**. Al terminar cada partido, solo escribe los goles:

```js
// Antes del partido:
{g:"A", j:1, A:"México", B:"Sudáfrica", ga:null, gb:null},
// Después del partido (ej. México ganó 2-1):
{g:"A", j:1, A:"México", B:"Sudáfrica", ga:2, gb:1},
```

Con eso el sitio automáticamente:

1. **Muestra el resultado real** en la tabla y calendario del grupo (marcado "✓ jugado" en verde).
2. **Recalibra el rating Elo** de ambas selecciones según el resultado y el margen de goles (K=40, ponderado por diferencia). Si un grande tropieza, sus probabilidades futuras bajan; si una cenicienta sorprende, suben.
3. **Recalcula todas las probabilidades** de los partidos pendientes, las tablas proyectadas y el cuadro completo de eliminatorias con los ratings actualizados.

Para la fase eliminatoria, agrega los resultados en `RESULTADOS_KO` con el número de partido FIFA (73–104):

```js
{id:79, A:"México", B:"Suecia", ga:1, gb:1, winner:"México"}, // winner solo si hubo empate (penales)
```

### Flujo recomendado (2 minutos por partido, incluso desde el celular)

1. Abre `js/resultados.js` en GitHub (web o app móvil) → botón de editar (lápiz).
2. Escribe los goles del partido que terminó → **Commit changes**.
3. Vercel detecta el commit y redespliega solo en ~30 segundos. Listo: el sitio entero ya refleja la realidad.

El encabezado del sitio muestra cuántos resultados reales están cargados ("📡 N resultados reales cargados · ratings recalibrados"), señal para tus visitantes de que el sitio está vivo — y excelente razón para que vuelvan después de cada jornada.

## Ajustar el modelo

Los ratings base de cada selección están en `js/model.js` (campo `r` en `TEAMS`). Estos son el punto de partida; el ajuste fino lo hace solo el sistema Elo conforme cargas resultados. El bono de localía (+60) y el factor K del Elo (`K_ELO`) también son editables ahí.

---
Proyecto recreativo e informativo. No afiliado a la FIFA. No es consejo de apuestas.

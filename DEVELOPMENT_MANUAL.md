# Manual de desarrollo — Colón 1492

Referencia técnica del proceso de desarrollo, arquitectura interna y filosofía del proyecto. Pensado para quien quiera entender el código, contribuir, ó replicar la metodología.

---

## 1. Filosofía del proyecto

Tres restricciones absolutas, mantenidas en cada commit:

### 1.1 Un único fichero HTML
`Colon2026.html` es la entrega final: ~600 KB, sin bundler, sin npm, sin assets locales. Three.js, Leaflet, Tailwind, OrbitControls, las tipografías — todo por CDN público. La razón: portabilidad absoluta. Doble clic en cualquier escritorio y arranca. Un único punto de inspección, copia, distribución.

Esta restricción excluye:
- Bundlers (Webpack, Vite, esbuild).
- Sistemas de módulos (`import` ES de ficheros locales — sí se permite desde CDN como `https://unpkg.com/...`).
- `package.json` con dependencias.
- Imágenes, audios, fuentes en local.

Lo que sí se permite:
- Scripts auxiliares de calidad en `tools/` (Node puro, sin dependencias) que actúan **sobre** el HTML sin formar parte del producto final.
- Auditoría separada en `LensAudit.html` (sigue siendo HTML único).
- Documentación en Markdown.

### 1.2 Cero emojis
Estética del XV consistente. Ni en el juego ni en la auditoría aparecen caracteres en los rangos Unicode `1F300-1FAFF`, `2600-27BF`, `1F000-1F02F`, `1F900-1F9FF`. La iconografía se construye con:
- **Sprites SVG** definidos al inicio del HTML como `<symbol id="i-...">` y referenciados con `<use href="#i-..."/>`.
- **Monogramas serif** (una letra por oficio: A Almirante, P Piloto, B Boatswain/contramaestre…) como cuños de lacre.
- **Numerales romanos** (I, II, III, IV…) para los sellos del Diario.

El script `tools/check.mjs` valida la ausencia de emojis en cada preflight.

### 1.3 Rigor histórico máximo
Cada nombre, fecha, coordenada, viento, decisión, cita lleva su fuente abierta. Tres reglas para nuevos datos:

1. **Origen documentado.** Sin fuente no entra (ó se marca explícitamente como atribución razonada).
2. **Calendario juliano** hasta 1582, no gregoriano.
3. **Toponimia del XV/XVI** en la interfaz histórica (*Juana* no Cuba, *Borinquen* no Puerto Rico).

Los contrafactuales son razonados, no fantasía: si una decisión histórica tiene alternativas, cada alternativa debe tener una consecuencia plausible documentada por las fuentes secundarias.

---

## 2. Estructura del HTML

Orden top-down del `<script>` principal dentro de `Colon2026.html`:

```
1. <style>           CSS inline (Tailwind + reglas custom + ~30 KB)
2. <svg>             Sprite de iconos (cargado oculto, ~5 KB)
3. <header>          Cabecera fija con controles de tiempo
4. #voyage-timeline  Línea de tiempo de los cuatro viajes
5. #app-container    Layout principal (map-container + canvas-container)
6. Modales           Astrolabio, cuadrante, sondaleza, corredera,
                     información, ayuda, decisión, guardado, trayectoria,
                     cierre de viaje
7. <script>          Todo el JavaScript:

   ── 7.1 Constantes históricas ──
       SHIPS              datos de las naves (eslora, manga, velas, área)
       CREW_DATABASE      80 tripulantes documentados
       CREW_VOICES        microcitas habladas
       CREW_CONTRADICTIONS contradicciones internas (lente 82)
       CREW_AGES          edades para síntesis de voz
       HISTORICAL_LOGBOOK 400+ entradas del Diario
       DECISION_POINTS    13 puntos de decisión contrafactual
       MILESTONES         18 sellos
       COLON_RANKS        8 rangos del Almirante
       OCEAN_ENCOUNTERS   12 avistamientos azarosos
       NATIVE_ENCOUNTERS  8 contactos documentados con pueblos nativos
       STORM_HAZARDS      7 categorías climatológicas (incluye niebla)
       MID_OCEAN_BEATS    10 viñetas para valles narrativos
       VOYAGE_CLOSINGS    citas de cierre por viaje
       PERSONAL_GOALS     8 metas opcionales del jugador
       DAILY_VIGNETTES    frases de la marinería al alba
       PERIOD_TOPONYMS    nombres del XV/XVI

   ── 7.2 Funciones puras ──
       haversineNM(), initialBearing(), beaufortScale()
       calculate1492MagneticDeclination(), calculate2026MagneticDeclination()
       sunPosition(), moonPosition(), polarisPosition()
       bodyAltitudeAzimuth(), windAt()
       julianDayUT(), gufm1Coefficients()

   ── 7.3 Procedural ──
       getTex(), buildShip(k, quality)
       gerstnerVertexShader / gerstnerFragmentShader

   ── 7.4 Clases auxiliares ──
       AudioEngine        Web Audio, drone reactivo, campana, voces
       Speak              wrapper de Web Speech adaptado á edad/oficio

   ── 7.5 SimulationEngine ──
       constructor()      inicializa todo
       update(dt)         tick principal
       _applyHelm()       maniobra
       _maybeOceanEncounter() _maybeNativeEncounter() _maybeStormHazard()
       _maybeMidOceanBeat() _maybeVoyageClosing()
       takeAstrolabeReading() takeQuadrantReading() dropSondaleza() runCorredera()
       throwBarrel()
       showDecision() applyDecision()
       renderPlayerStats() exportPlayerStats() renderGoalsList()
       buildVoyageTimeline() updateVoyageTimeline()
       _serializeState() _applyState()
       setCrew() setShip()
       ... etc.

8. DOMContentLoaded → window.App = new SimulationEngine();
```

---

## 3. Subsistemas

### 3.1 Renderizado 3D — Three.js + shader Gerstner

- **Escena**: `THREE.Scene` con niebla exponencial opcional, fondo HDR procedural.
- **Cámara**: `PerspectiveCamera` con `OrbitControls`.
- **Renderer**: `WebGLRenderer` con tone mapping ACES Filmic.
- **Oleaje**: un plano alto-resolución (256 × 256 vértices á `ultra`) con `ShaderMaterial` que aplica olas Gerstner / trocoidales:
  ```glsl
  // Suma de N olas Gerstner
  for (int i = 0; i < N_WAVES; i++) {
    vec2 d = directions[i];
    float k = 2.0 / lambdas[i];
    float f = k * (dot(d, pos.xz) - speeds[i] * uTime);
    pos.x += d.x * amplitudes[i] * cos(f);
    pos.y += amplitudes[i] * sin(f);
    pos.z += d.y * amplitudes[i] * cos(f);
  }
  ```
- **Naves**: meshes procedurales construidos en `buildShip(key, quality)`. Cada nave tiene su grupo Three con casco, mástiles, jarcia, cofas, ancla, banderas, cruz de Calatrava, cebadera, ventanas en castillos.
- **Pitch/roll/heave de la nave** se calculan á partir de la altura y pendiente del Gerstner en la posición del barco — no son animaciones independientes.

### 3.2 Cartografía dual — Leaflet

- **Mapa moderno** (`L.tileLayer` con OSM ó Carto) en `#map-modern`.
- **Mapa histórico** (sin etiquetas modernas, filtro CSS sepia) en `#map-historical` por encima con `opacity:0.7`.
- **Sincronización**: el modern emite eventos `move`/`zoom` que el histórico replica con `animate:false`.
- **Eras**: cinco overlays (Portulano filtrado, Cosa 1500, Cantino 1502, Caverio 1505, moderno limpio).
- **Capas**: ruta histórica como `L.polyline`, hitos como `L.marker` con `L.divIcon`, isógonas y bandas de viento como `L.geoJSON`.

### 3.3 Geomagnetismo

`gufm1` (Jackson, Jonkers, Walker 2000) reducido. Las funciones `calculate1492MagneticDeclination(lat, lon)` y `calculate2026MagneticDeclination(lat, lon)` usan una expansión esférico-armónica precalculada de los coeficientes de gufm1 evaluada en las dos épocas relevantes. Para fechas intermedias se interpola linealmente.

Documentación de la fuente: <https://www.es.ic.ac.uk/research/research_groups/geomagnetism>

### 3.4 Efemérides astronómicas — Meeus abreviado

Implementadas á partir de Meeus, *Astronomical Algorithms* (1991), capítulos 25 (Sol), 47 (Luna), 21 (precesión). Las funciones devuelven `{ra, dec, lambda}` en grados. Una segunda capa `bodyAltitudeAzimuth(pos, lat, lon, date)` convierte á `{alt, az, H}` horizontales.

La precisión es ±2 minutos en mediodía solar — suficiente para gameplay, insuficiente para navegación real.

### 3.5 Audio sintetizado — Web Audio

Toda la generación de audio es runtime, sin ficheros. `class AudioEngine`:

```
master
  ├─ wind   (noise → bandpass 250-900 Hz → gain)
  ├─ sea    (pink noise → lowpass 380-620 Hz → gain ← LFO 0.18 Hz)
  ├─ drone  (tónica + quinta + octava sine → delay 0.31s feedback 0.42 → wet)
  │   └─ subgrave (entra á F8+)
  └─ events (bell, lookout cry, voces speech synth)
```

El método `setBeaufort(b)` modula gain y frecuencia del drone según una tabla discreta. Sin contexto de audio, el motor degrada silenciosamente.

### 3.6 Síntesis de voz — Web Speech

`Speak.speakCrew(crewMember, text)`:
- Selecciona la mejor voz española del SO.
- Ajusta `pitch` según `CREW_AGES[id]` (grumetes 1.25, ancianos 0.85).
- Ajusta `rate` según oficio (escribanos lento, vigías rápido).
- Si no hay voz disponible, falla silenciosamente.

### 3.7 Persistencia — localStorage

Función `_serializeState()` devuelve un objeto JSON-able versionado. `_applyState(state)` lo aplica con backwards-compat suave (`...this.playerStats, ...s.playerStats`).

Los slots se guardan bajo `colon-save-<nombre>`. Set adicionales (`_voyagesClosed`, `_nativeEncountersTriggered`, `_barrelThrownVoyages`) se serializan como arrays.

---

## 4. Auditoría — metodología de Jesse Schell

El proyecto se evalúa contra las **100 lentes** de *The Art of Game Design: A Book of Lenses* (Jesse Schell, 3ª ed.). El fichero `LensAudit.html` es una SPA independiente que:

1. Define `const LENSES = [...]` con 100 entradas: `{n, es, en, cat, desc, game, score, improv}`.
2. Renderiza cada lente como tarjeta con su puntuación 0-100.
3. Computa estadísticas: media, número de lentes ≥ 80, número de lentes ≤ 40.

### Lentes capadas por diseño
Cinco lentes no se elevan por encima de cierto valor porque hacerlo violaría las restricciones:

| Lente | Cap | Razón |
|-------|----:|-------|
| #36 Competición | 15 | Single-player por diseño |
| #37 Cooperación | 10 | Single-player por diseño |
| #38 Competición vs Cooperación | 50 | Single-player |
| #84 Amistad | 10 | Single-player |
| #86 Comunidad | 20 | Open-source sin foro propio |
| #88 Amor | 88 | Amor á la historia, no entre jugadores |
| #94 El Cliente | 80 | No-comercial |
| #95 Pitch | 75 | No-comercial |
| #96 Beneficio | 30 | No-comercial |

Su puntuación actual refleja lo razonable bajo las restricciones del proyecto. Inflarlas más sería deshonesto.

### Iteración del audit
Cada vez que se añade ó modifica una mecánica relevante, se actualiza la entrada correspondiente en `LENSES`:
1. Reescribir `game:` con la nueva descripción real.
2. Reescribir `improv:` con lo siguiente á mejorar.
3. Subir `score:` sólo en función de la mejora genuina.
4. Snapshot con `node tools/lens-diff.mjs snapshot`.

El histórico se conserva en `tools/snapshots/audit-YYYY-MM-DD.json`.

---

## 5. Tools — pipeline de calidad

Todos los scripts en `tools/` son Node 18+ puros, sin dependencias.

### 5.1 `preflight.mjs`
Verificación previa al commit. Comprueba:

1. **Emojis**: regex sobre rangos Unicode emoji en `Colon2026.html` y `LensAudit.html`. Cualquier emoji = ROJO.
2. **Parseo JS**: `new Function(scriptContent)` por cada bloque `<script>`. Falla si hay sintaxis inválida.
3. **Sprite SVG**: extrae `<use href="#i-...">` y `<symbol id="i-...">`. Si hay referencias huérfanas → FAIL. Iconos no usados → INFO.
4. **MILESTONES**: valida unicidad de IDs.
5. **COLON_RANKS**: comprueba que `min` es estrictamente creciente.
6. **LensAudit**: cuenta 100 lentes.
7. **Regresión del audit**: compara media actual con la del último snapshot. `delta < -0.01` = FAIL.
8. **Tamaño**: aviso si crece > 5 % desde el último snapshot.

```sh
node tools/preflight.mjs
```

Exit code 0 = todo verde. 1 = al menos un fallo.

### 5.2 `check.mjs`
Subconjunto rápido de `preflight`: sólo emojis, parseo, sprite. Útil como pre-commit hook.

### 5.3 `lens-diff.mjs`
Snapshot / diff del array `LENSES`:

```sh
node tools/lens-diff.mjs snapshot   # guarda estado actual en tools/snapshots/
node tools/lens-diff.mjs list       # lista snapshots
node tools/lens-diff.mjs diff       # compara los dos más recientes
node tools/lens-diff.mjs diff X Y   # compara dos snapshots por nombre
```

### 5.4 `audit-export.mjs`
Exporta el array `LENSES` á CSV y JSON consumibles externamente.

### 5.5 `wordcount.mjs`
Composición del fichero por sección (sprite, CSS, JS dividido en datos vs. código, comentarios, HTML estructural). Útil para diagnosticar dónde está creciendo el binario.

### 5.6 `release-notes.mjs`
Genera `CHANGELOG.md` automáticamente á partir de los snapshots del audit:

```sh
node tools/release-notes.mjs                # último vs anterior
node tools/release-notes.mjs --stdout       # imprime sin escribir
node tools/release-notes.mjs antes despues  # compara dos por nombre
```

### 5.7 `clean-sprite.mjs`
Elimina `<symbol>` SVG huérfanos del sprite tras refactors.

---

## 6. Workflow de desarrollo

### 6.1 Iteración típica

```
1. Identificar lente á mejorar en LensAudit.html (score < 85, no capada).
2. Diseñar la mecánica/contenido que la mejoraría.
3. Implementar en Colon2026.html siguiendo la estructura existente.
4. Actualizar la entrada en LENSES con la descripción real y nueva puntuación.
5. node tools/preflight.mjs → verde.
6. node tools/lens-diff.mjs snapshot.
7. Commit.
```

### 6.2 Añadir nuevo punto de decisión

```js
// En DECISION_POINTS, en orden cronológico:
{ date:"YYYY-MM-DD", title:"Descripción corta — N viaje",
  context:"Contexto histórico de la decisión",
  options:[
    { label:"Opción A", historical:true,
      outcome:"Consecuencia real",
      effects:{ morale:0, hull:0 } },
    { label:"Opción B (contrafactual razonado)",
      outcome:"Consecuencia plausible documentada",
      effects:{ morale:-10, hull:-0.1 } },
    { label:"Opción C", outcome:"...", effects:{...} }
  ] }
```

### 6.3 Añadir tormenta climatológica

```js
// En STORM_HAZARDS:
{ id:"slug-id", name:"Nombre", severity:1-4, baseProb:0.0-0.1,
  months:[1,2,3,...],
  latMin, latMax, lonMin, lonMax,
  durationHours:6-48,
  windAdd:[min,max], hullImpactPct:[min,max],
  moraleImpact:-20 á 0, speedFactor:0.1-0.7,
  // Flags opcionales:
  suppressEncounters:true,    // suprime _maybeOceanEncounter
  coastCollisionRisk:true,    // daño extra cerca de costa
  text:"Descripción evocadora",
  source:"Fuente histórica" }
```

### 6.4 Añadir encuentro con nativos

```js
// En NATIVE_ENCOUNTERS:
{ id:"slug-id", earliestDate:"YYYY-MM-DD",
  lat, lon, radiusNM:120-200,
  voice:"id-de-tripulante-narrador",
  title:"Título del encuentro",
  text:"«Cita literal del Diario/Las Casas/Hernando»",
  source:"Fuente exacta con folio",
  moraleEffect:-20 á +12 }
```

El sistema se dispara solo en `_maybeNativeEncounter()` cuando se cumplan fecha + proximidad.

### 6.5 Añadir meta personal

```js
// En PERSONAL_GOALS:
{ id:"slug",
  title:"Título mostrado al jugador",
  desc:"Descripción de qué exige cumplirla",
  source:"Fuente histórica que la motiva",
  progress:(app)=>{
    // Función pura que recibe el SimulationEngine y devuelve 0..1
    // Ejemplo: Math.min(1, app.playerStats.stormsLived/5)
  } }
```

### 6.6 Convenciones de código

- **JSDoc no obligatorio**, pero comentarios al inicio de cada bloque grande explicando *qué* y *por qué* (no *cómo* — eso lo dice el código).
- **Sin TypeScript** — vanilla JavaScript ES2020+.
- **Funciones puras** para matemática (no clases, no estado).
- **Clases sólo** para el SimulationEngine y AudioEngine — todo el estado vive dentro de SimulationEngine.
- **Inglés** para nombres de funciones / variables; **castellano** para texto visible al jugador, comentarios narrativos y constantes históricas.
- **Calendario juliano** para fechas anteriores á 1582.
- **Sin TODO inline** — flag al usuario antes que dejar un placeholder.

---

## 7. Cómo contribuir

1. **Issue primero** describiendo:
   - La mecánica/dato que falta ó está mal.
   - La fuente histórica que la justifica (con folio ó capítulo exacto).
   - Lente(s) de Schell que tocaría.

2. **PR** con:
   - Cambios en `Colon2026.html` (mecánica/dato).
   - Actualización de `LensAudit.html` si la mejora aumenta alguna lente.
   - `node tools/preflight.mjs` en verde.
   - Descripción del PR citando la fuente.

3. **Sin emojis** en el código, ni en mensajes de commit, ni en el PR (la documentación markdown puede tenerlos si imprescindibles).

### Tipo de cambios bienvenidos
- **Correcciones históricas** con fuente.
- **Nuevas decisiones contrafactuales** documentadas.
- **Nuevos encuentros con nativos** documentados.
- **Mejoras de accesibilidad** (a11y) sin romper la estética.
- **Optimización de tokens** del HTML.

### Cambios que serán rechazados
- Romper el «un solo HTML».
- Introducir bundler ó `package.json`.
- Añadir emojis.
- Citar Wikipedia como fuente primaria (sí como puente á una fuente real).
- Decisiones contrafactuales sin justificación documental.
- Mecánicas que sólo persiguen lentes de Schell sin valor real para el jugador.

---

## 8. Decisiones de diseño documentadas

### Por qué single-HTML
- Portabilidad: doble clic en cualquier escritorio.
- Inspeccionabilidad: un solo fichero auditar.
- Sin build step: el código que ves es el que corre.
- Sin tooling lock-in: nada de obsolescencia de framework.

Coste: tamaño del HTML (~600 KB) — manejable.

### Por qué cero emojis
- Coherencia estética del XV.
- Compatibilidad cross-browser (algunos emojis se rasterizan diferente).
- Renderizado tipográfico consistente.
- Diferenciación frente á juegos del XXI.

### Por qué Jesse Schell
- Marco probado, ampliamente conocido.
- Cobre las cinco categorías esenciales (jugador, jugabilidad, experiencia, tecnología, historia).
- 100 lentes con preguntas concretas auditable lente á lente.
- Permite progresar de forma incremental y verificable.

### Por qué calendario juliano
- Las fuentes están escritas en él. Convertir á gregoriano introduciría error y descoordinación con los textos citados.

### Por qué open-elevation para sondaleza
- Sin CORS hostiles, gratuito, sin clave.
- SRTM (elevación radar) es la mejor batimetría libre disponible.
- Limitación: no es batimetría histórica; los fondos del Caribe han cambiado poco en 500 años, así que la aproximación es plausible.

---

## 9. Métricas actuales

| Métrica | Valor (mayo 2026) |
|---------|------------------:|
| Tamaño `Colon2026.html` | ~600 KB |
| Líneas de JS | ~9 700 |
| Tripulantes documentados | 80+ |
| Eventos del Diario | 400+ |
| Decisiones contrafactuales | 13 |
| Tormentas climatológicas | 7 categorías |
| Encuentros con nativos | 8 |
| Sellos del Diario | 18 |
| Metas personales | 8 |
| Picos narrativos | 10 |
| Audit medio | ~85 % |
| Audit lentes ≥ 80 % | 90 / 100 |
| Emojis | 0 |

---

## 10. Histórico de iteraciones

El fichero `CHANGELOG.md` se actualiza automáticamente con `tools/release-notes.mjs`. Cada entrada muestra:

- Snapshot anterior vs. posterior.
- Cambio en la media.
- Cambio en lentes ≥ 80 y lentes ≤ 40.
- Lista de lentes que suben y bajan con su delta.

Los snapshots individuales viven en `tools/snapshots/audit-YYYY-MM-DDTHH-MM-SS.json` y pueden compararse dos á dos.

---

## 11. Recursos externos consultados

| Referencia | Uso |
|------------|-----|
| Jackson, Jonkers, Walker (2000) — *Four centuries of geomagnetic secular variation from historical records* | Modelo gufm1 |
| Meeus (1991) — *Astronomical Algorithms* | Sol, Luna, Polar |
| Gould (1984) — *Nueva lista documentada de los tripulantes de Colón en 1492* | Roster del I viaje |
| Martínez-Hidalgo (1966) — reconstrucciones de naves | Las tres naves |
| Morison (1942) — *Admiral of the Ocean Sea* | Contexto |
| Schell (2008/2014/2019) — *The Art of Game Design: A Book of Lenses* | Metodología de audit |
| Three.js docs | Renderizado |
| Leaflet docs | Cartografía |

---

## 12. Despedida del desarrollador

Si has llegado hasta aquí, gracias por leer. El simulador es deliberadamente pequeño, denso, abierto. No se compila, no se empaqueta, no se actualiza solo. Vive en un único fichero que puedes inspeccionar línea á línea. Esa es la garantía: lo que ves es lo que corre.

Si encuentras un error histórico, abre una issue con la fuente. Si encuentras un bug de código, abre una issue con los pasos. Si quieres añadir una decisión nueva, una tormenta, un encuentro, un sello — bienvenido. Lo único que se pide es que cada dato lleve su fuente, que el preflight quede en verde, y que ninguna mejora cuesta la estética del XV.

*Hecho con el rigor que las fuentes merecen.*

# Colón 1492 — Simulador histórico de los cuatro viajes

> Reconstrucción rigurosa del descubrimiento del Atlántico occidental por Cristóbal Colón (3 de agosto de 1492 — 7 de noviembre de 1504), en un único fichero HTML5 sin instalación.

`Colon2026.html` es una *single-page application* autocontenida: Three.js, Leaflet, Tailwind, shaders Gerstner, Web Audio, Web Speech, todo cargado por CDN. Doce años de navegación, cuatro naves, ochenta tripulantes documentados, trece decisiones del Almirante, seis tormentas climatológicas reales, ocho encuentros con poblaciones nativas — cada dato con su fuente abierta.

---

## Instalación y ejecución

### Requisitos
- **Navegador moderno** con soporte WebGL 2 (Chrome 90+, Edge 90+, Firefox 90+, Safari 15+).
- **Conexión á Internet** para la primera carga (los CDN de Three.js, Leaflet y las tipografías). Tras la carga inicial los assets quedan cacheados.
- **Resolución recomendada** ≥ 1280 × 800. El layout asume escritorio.
- **Audio activable** tras el primer gesto del usuario (requerimiento del navegador para `AudioContext`).

### Instalación
No la hay. El proyecto es deliberadamente un único fichero HTML.

```sh
git clone https://github.com/<tu-usuario>/colon-1492.git
cd colon-1492
```

### Ejecución
Abrir `Colon2026.html` con cualquier navegador moderno. Tres opciones:

```sh
# 1. Doble clic
# (basta con abrir el fichero desde el explorador)

# 2. Servir localmente para evitar restricciones de origen
python -m http.server 8080
# luego http://localhost:8080/Colon2026.html

# 3. Con Node
npx http-server -p 8080
```

> El servidor local sólo es estrictamente necesario si tu navegador bloquea la API de `open-elevation` por CORS al abrir desde `file://`. La sondaleza usa esa API pública; sin ella, el resto del simulador funciona.

---

## Manuales

| Manual | Para quién | Contenido |
|--------|------------|-----------|
| **[USER_MANUAL.md](USER_MANUAL.md)** | Jugador | Manual del Piloto escrito por el Almirante Colón en primera persona: cómo gobernar las naves, leer la carta, tomar la altura, sortear el motín, vivir los cuatro viajes. |
| **[TECHNICAL_MANUAL.md](TECHNICAL_MANUAL.md)** | Jugador avanzado | Todos los elementos técnicos: atajos de teclado, modos de dificultad, telemetría exportable, save/load, configuración detallada, APIs externas, rendimiento. |
| **[DEVELOPMENT_MANUAL.md](DEVELOPMENT_MANUAL.md)** | Desarrollador | Arquitectura, metodología (auditoría de las 100 lentes de Schell), subsistemas (Three.js, shaders, audio, mapas, geomagnetismo, efemérides), pipeline de calidad y cómo contribuir. |
| [CLAUDE.md](CLAUDE.md) | Guía para asistentes IA | Convenciones y restricciones del repositorio. |
| [CHANGELOG.md](CHANGELOG.md) | Histórico | Iteraciones del audit (generado por `tools/release-notes.mjs`). |

---

## Características principales

- **Cuatro viajes históricos** (1492-1504) con fechas julianas, ruta documentada y trece puntos de decisión contrafactual.
- **Cartografía dual**: cinco eras (portulano XV, Mapamundi de Juan de la Cosa 1500, Cantino 1502, Caverio 1505, moderna) con topónimos del XV/XVI.
- **Tres naves modeladas en 3D** con shader Gerstner (olas trocoidales), velas configurables, jarcia, cofas, ancla.
- **Matriz de coordenadas** simultánea: estima de Colón (con subestimación del 15 %), magnética 1492, magnética 1504, WGS-84.
- **Cuatro mini-juegos navales reales**: astrolabio, cuadrante, sondaleza (con API SRTM), corredera de 28 segundos.
- **Sistema climatológico**: seis temporales reales (chubasco, tormenta del Atlántico, huracán antillano, calma chicha, galerna, borrasca tropical, niebla espesa) con probabilidad por mes y latitud.
- **Voces de la tripulación**: 80 personajes documentados con voz sintetizada adaptada á edad y oficio (Web Speech API).
- **Drone armónico reactivo al Beaufort**: pad sintetizado que cambia con la fuerza del viento.
- **Telemetría exportable**: panel «Trayectoria del Almirante» con seguimiento de habilidad, fidelidad histórica, metas personales.
- **Pantalla emotiva de cierre por viaje** con cita literal del Almirante.
- **18 sellos del Diario** desbloqueables con cita histórica.
- **Auditoría completa**: `LensAudit.html` evalúa el simulador con las 100 lentes de Jesse Schell (*The Art of Game Design*).

---

## Estructura del repositorio

```
.
├── Colon2026.html       # El simulador (~600 KB, SPA completo)
├── LensAudit.html       # Auditoría de las 100 lentes de Schell
├── USER_MANUAL.md       # Manual del Piloto (voz del Almirante)
├── TECHNICAL_MANUAL.md  # Manual técnico para jugadores
├── DEVELOPMENT_MANUAL.md# Manual de desarrollo
├── README.md            # Este fichero
├── CHANGELOG.md         # Iteraciones del audit
├── CLAUDE.md            # Instrucciones para asistentes IA
├── reference/           # Fuentes históricas (Navarrete PDF, etc.)
├── specs/               # Spec original del producto
└── tools/               # Scripts de calidad (Node, sin npm)
    ├── preflight.mjs    # Verificación previa al commit
    ├── check.mjs        # Validación de sprite, JS, sin emojis
    ├── lens-diff.mjs    # Snapshot/diff del audit
    ├── audit-export.mjs # Exporta el audit á CSV/JSON
    ├── wordcount.mjs    # Composición del fichero
    ├── release-notes.mjs# CHANGELOG automático
    └── clean-sprite.mjs # Limpia iconos huérfanos
```

---

## Calidad y verificación

```sh
# Verificación completa (emojis, parseo JS, sprite SVG, audit, tamaño)
node tools/preflight.mjs

# Snapshot del estado actual del audit
node tools/lens-diff.mjs snapshot

# Diferencia con el snapshot anterior
node tools/lens-diff.mjs diff

# Composición del fichero por sección
node tools/wordcount.mjs
```

Todos los scripts son Node 18+ puros sin dependencias (no hay `package.json`, no hay `npm install`).

---

## Restricciones de diseño

Tres restricciones absolutas, no negociables:

1. **Un único fichero HTML.** Sin bundlers, sin npm, sin ficheros locales aparte del HTML. Todo va por CDN.
2. **Cero emojis** en el juego (`Colon2026.html`) y en la auditoría (`LensAudit.html`). Iconografía por sprites SVG y monogramas serif tipo cuño de lacre.
3. **Rigor histórico máximo.** Cada nombre, fecha, coordenada, viento, cita lleva su fuente abierta. Los contrafactuales son razonados, no fantasía.

---

## Fuentes históricas principales

| Fuente | Uso |
|--------|-----|
| *Diario de a bordo* (transcripción de Las Casas, BNE Mss/Vitr/6/7; ed. Manuel Alvar 1976; versión de Ernesto Arias) | Eje narrativo, decisiones, citas literales |
| Las Casas, *Historia de las Indias* | II, III, IV viaje, encuentros con nativos |
| Hernando Colón, *Vida del Almirante* | IV viaje, contexto familiar |
| Lettera Rarissima (julio 1503) | Cierre del IV viaje |
| Colección Navarrete (1825-1837) | Documentos diplomáticos |
| Pleitos Colombinos (Archivo General de Indias) | Tripulación, biografías |
| Gould 1984 — *Nueva lista documentada de los tripulantes de Colón en 1492* | Roster del I viaje |
| Martínez-Hidalgo 1966 | Reconstrucciones de las naves |
| Jackson et al. 2000 — modelo gufm1 | Geomagnetismo histórico |
| Meeus, *Astronomical Algorithms* | Efemérides del Sol, Luna, Polar |

---

## Licencia

Software didáctico de código abierto. Las fuentes históricas citadas pertenecen al dominio público en sus ediciones originales; las transcripciones modernas tienen sus propias licencias detalladas en cada referencia.

## Créditos

Diseñado en 2026 sobre la metodología de Jesse Schell (*The Art of Game Design: A Book of Lenses*), auditado lente á lente en `LensAudit.html`. Iterado con asistencia de IA bajo las restricciones documentales descritas.

Para reportar errores históricos, abrid una *issue* citando la fuente que refute lo expuesto. Toda corrección bienvenida.

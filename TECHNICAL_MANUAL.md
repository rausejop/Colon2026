# Manual técnico — Colón 1492

Referencia técnica para jugadores avanzados. Cubre requisitos del sistema, controles completos, configuración detallada, dependencias externas, formato de los datos exportables y diagnóstico de problemas.

---

## 1. Requisitos del sistema

### Navegador
| Característica | Mínimo | Recomendado |
|----------------|--------|-------------|
| WebGL          | 1.0    | 2.0         |
| Web Audio API  | sí     | sí          |
| Web Speech API | opcional | sí (voces de la tripulación) |
| `localStorage` | 5 MB libres | 10 MB libres |
| Pointer Events | sí     | sí (drag de astrolabio/cuadrante) |
| ES2020         | sí     | sí (`?.`, `??`, top-level await) |

| Navegador | Versión mínima |
|-----------|---------------:|
| Chrome / Edge | 90  |
| Firefox       | 90  |
| Safari        | 15  |

### Hardware
- **CPU**: dual core 2 GHz suficiente; quad core recomendado para `oceanQuality: ultra`.
- **GPU**: integrada (Intel UHD/Iris) suficiente á `medium`; dedicada recomendada para `ultra`.
- **RAM**: 4 GB libres para Three.js + tiles cacheados.
- **Resolución**: ≥ 1280 × 800. Layout asume escritorio; móviles pueden usar la versión Cabotaje pero el HUD denso no está pensado para pantallas pequeñas.

---

## 2. Ejecución

### Apertura directa
```sh
# Doble clic sobre Colon2026.html en tu explorador de ficheros.
```
Funciona desde `file://`. La sondaleza puede fallar por CORS (open-elevation rechaza algunos orígenes `file://`).

### Servidor local (recomendado)
```sh
# Python 3
python -m http.server 8080
# luego abre http://localhost:8080/Colon2026.html

# Node
npx http-server -p 8080

# PHP
php -S localhost:8080
```

### Sin Internet
La primera carga necesita los CDN (Three.js, Leaflet, Tailwind, tipografías). Tras esa carga, el navegador cachea casi todo. Sin red:
- Los tiles del mapa no se actualizan (se ven los ya descargados).
- La sondaleza no funciona (open-elevation requiere red).
- El resto sigue operativo: simulación, instrumentos, decisiones, audio, voces.

---

## 3. Atajos de teclado — referencia completa

### Control del tiempo
| Tecla | Acción |
|------:|--------|
| `Espacio` | Pausa / reanudar simulación |
| `+` / `=` / `NumPad+` | Acelerar al siguiente paso de velocidad |
| `-` / `NumPad-` | Decelerar al paso anterior |
| `1` | 1 : 1 (tiempo real) |
| `2` | 1 min/s |
| `3` | 1 h/s |
| `4` | 1 día/s |
| `5` | 1 sem/s |
| `6` | 2 mes/s |
| `7` | 1 año/s |
| `H` | Sincronizar al estado histórico (reposiciona toda la flota) |

### Maniobra
| Tecla | Acción |
|------:|--------|
| `←` / `→` | Caña á babor / estribor |
| `↑` / `↓` | Izar / arriar todo el aparejo gradualmente |

### Vistas
| Tecla | Acción |
|------:|--------|
| `M` | Mapa á pantalla completa (toggle) |
| `N` | Naves á pantalla completa (toggle) |
| `D` | Diario lateral (toggle) |
| `S` | Sonido on / off |
| `ESC` | Cerrar modal ó restaurar vista partida |

### Instrumentos (sin pausar la simulación)
| Tecla | Acción |
|------:|--------|
| `A` | Abrir astrolabio |
| `Q` | Abrir cuadrante |
| `L` | Echar la sondaleza (consulta API de elevación) |
| `C` | Abrir corredera |
| `T` | Abrir Trayectoria del Almirante (telemetría) |

### Gamepad
| Botón | Acción |
|-------|--------|
| Stick izquierdo X | Timón proporcional |
| LT (botón 6) | Arriar velas |
| RT (botón 7) | Izar velas |
| A (botón 0) | Pausa / reanudar |
| X (botón 2) | Decelerar |
| Y (botón 3) | Acelerar |
| Start (botón 9) | Sync histórico |

---

## 4. Modos de dificultad

Tres modos en el modal de Configuración. Cada uno modula cuatro subsistemas:

| Subsistema | Cabotaje | Almirante | Capitán General |
|------------|---------:|----------:|----------------:|
| Fragilidad del casco | ×0.4 | ×1.0 | ×2.6 |
| Probabilidad de tormenta | ×0.35 | ×1.0 | ×1.6 |
| Consumo de víveres | ×0.75 | ×1.0 | ×1.35 |
| Caída de moral con escasez | ×0.35 | ×1.0 | ×2.0 |
| Mecha de motín | ×0.4 (lenta) | ×1.0 | ×1.6 (rápida) |
| Control del jugador | observador (autopilot total) | manual completo | manual completo, casco frágil |

---

## 5. Configuración detallada (modal Engranaje)

### Calidad del océano
| Modo | Vértices | Detalle |
|------|---------:|---------|
| `low`    | 64 × 64   | Shader sin armónicos secundarios |
| `medium` | 128 × 128 | Dos armónicos Gerstner |
| `high`   | 192 × 192 | Cuatro armónicos |
| `ultra`  | 256 × 256 | Cuatro armónicos + tone mapping ACES |

### Calidad de las naves
| Modo | Detalles |
|------|----------|
| `simple` | Cascos básicos, velas planas, sin jarcia |
| `epico`  | Texturas procedurales de madera/lona, normal maps, jarcia obenques + flechastes, cofas, anclas, cebadera, banderas, cruz de Calatrava |

### Capas y elementos visuales
- `fleet`: muestra la flota (Pinta y Niña además de la activa)
- `windArrow`: flecha de viento sobre la nave activa
- `fog`: niebla atmosférica de fondo
- `isogonic`: líneas isógonas de declinación magnética 1492
- `windbelts`: bandas de alisios sobre el mapa
- `toponyms`: muestra topónimos del XV/XVI
- `historicalNamesOnly`: oculta nombres modernos en la cartografía
- `diaryMode`: `original` (castellano antiguo) / `modern` (modernizado) / `both` (ambos)
- `toast`: avisos emergentes
- `sound`: motor de audio (viento, oleaje, drone, campanas, voces)
- `crewVoices`: voces sintetizadas de la tripulación

---

## 6. Persistencia y datos del navegador

Todo en `localStorage`. Claves utilizadas:

| Clave | Contenido |
|-------|-----------|
| `colon-state` | Estado del juego actual (no se usa para slots, sólo respaldo) |
| `colon-save-<slot>` | Slot nombrado por el usuario |
| `colon-seals-unlocked` | Lista de IDs de sellos desbloqueados |
| `colon-tutorial-done` | Marca de tutorial completado |
| `colon-capitulation` | Texto libre de la Capitulación personal |
| `colon-personal-goals` | Lista de IDs de metas personales comprometidas |
| `colon-config` | Preferencias de configuración |

### Limpieza
- Vaciar datos del sitio → borra todo lo anterior.
- En consola del navegador: `localStorage.clear()` borra sólo el simulador.

---

## 7. Telemetría exportable

El botón «Exportar telemetría (.json)» en el modal Trayectoria descarga un fichero JSON con la estructura:

```json
{
  "exportedAt": "2026-05-17T17:00:00.000Z",
  "simDate":    "1492-10-12T05:00:00.000Z",
  "voyage":     1,
  "difficulty": "almirante",
  "hullIntegrity": 0.85,
  "morale": 72,
  "stats": {
    "helmSeconds": 4321,
    "manualLeagues": 0,
    "astrolabeReadings": 14,
    "quadrantReadings": 6,
    "sondalezaReadings": 3,
    "correderaReadings": 8,
    "altitudeErrorSum": 18.7,
    "altitudeErrorCount": 20,
    "oceanEncountersSeen": 12,
    "stormsLived": 2,
    "mutiniesAverted": 1,
    "decisionsHistorical": 7,
    "decisionsAlternative": 1,
    "barrelsThrown": 0
  },
  "personalGoals": [
    { "id": "piloto-magistral", "title": "Piloto magistral del Almirante", "progress": 0.66 }
  ]
}
```

`stats.altitudeErrorSum / stats.altitudeErrorCount` = error medio de altura. Pilotos del XV bajaban de 1° en condiciones óptimas.

### Bitácora exportable
El botón «Exportar mi bitácora (.md)» del Manual del Piloto descarga un fichero Markdown con: Capitulación personal, decisiones tomadas, hitos cruzados, estadísticas de viaje.

---

## 8. Save / Load

### Slots nombrados
- Botón «Guardar partida» (icono disco) → introducir nombre del slot → guarda.
- Botón «Cargar partida» (icono carpeta) → lista de slots → seleccionar.
- Capacidad máxima: depende del navegador (~5-10 MB por origen).

### Contenido del slot
```js
{
  version: 1,
  savedAt: "ISO-timestamp",
  simDate: "...",
  simSpeed: number,
  shipKey: "santa-maria" | ...,
  crewId: "colon" | ...,
  morale: number,
  hullIntegrity: number,
  decisionsTriggered: [...],
  nativeEncountersTriggered: [...],
  barrelThrownVoyages: [...],
  voyagesClosed: [...],
  diary: [...],
  shipStates: {...},
  playerStats: {...},
  config: {...},
  mapEra: "portulan" | ...,
  layoutMode: "split" | "map" | "canvas"
}
```

---

## 9. APIs externas (CDN y servicios)

### CDN cargados al arrancar
| Recurso | Origen | Uso |
|---------|--------|-----|
| Three.js | cdnjs.cloudflare.com | Renderizado 3D |
| Leaflet  | unpkg.com            | Cartografía dual |
| Tailwind CSS | cdn.tailwindcss.com | Utility classes |
| Fuentes | Google Fonts (Cinzel, IM Fell English, UnifrakturCook) | Tipografía |
| OrbitControls | jsdelivr | Cámara orbital |

### Servicios runtime
| Servicio | URL | Cuándo |
|----------|-----|--------|
| open-elevation.com | `https://api.open-elevation.com/api/v1/lookup` | Sondaleza (elevación SRTM) |
| OpenStreetMap tiles | `https://{s}.tile.openstreetmap.org/...` | Mapa moderno |
| Carto basemaps | `https://{s}.basemaps.cartocdn.com/...` | Mapa histórico |

### Comportamiento offline
- CDN sin red en primera carga: el simulador no arranca. Tras la primera carga, navegador cachea.
- Tiles sin red: muestra los ya cacheados; las zonas no visitadas quedan en blanco.
- Sondaleza sin red: muestra «No pudo medirse». El simulador sigue.

---

## 10. Audio

### Sintetización 100 % runtime
No hay ficheros de audio. Todo se genera con Web Audio:

- **Viento**: ruido blanco → filtro paso-banda 250-900 Hz → gain proporcional á velocidad del viento.
- **Oleaje**: ruido rosa → filtro paso-bajo 380-620 Hz → modulación lenta por LFO 0.18 Hz.
- **Drone armónico**: tres osciladores sine (tónica La2 110 Hz + quinta + octava) con detuneo de ±4 cents → delay 0.31 s con feedback 0.42 → modulación por LFO 0.05 Hz. Reacciona al Beaufort:
  - F0-2: 110 Hz, gain 0.04
  - F3-5: 110 Hz, gain 0.06
  - F6-7: 100 Hz, gain 0.075 + sub-grave
  - F8+: 92 Hz, gain 0.095 + sub-grave 46 Hz
- **Campana del barco**: cuatro parciales armónicos (524, 1048, 1572, 2050 Hz) con envolvente exponencial. Suena 1-8 veces cada media hora según ampolleta de la guardia.
- **Grito del vigía**: oscilador sawtooth + biquad bandpass formante (FM-formante).

### Voces (Web Speech)
La síntesis de voces de la tripulación usa `speechSynthesis.speak()` con voces del SO. Pitch y rate ajustados según edad del personaje (grumetes agudos, maestres graves). Si tu navegador no expone voces en español, no hablan — el resto sigue.

---

## 11. Rendimiento

### Targets
- 60 FPS á 1080p con `oceanQuality: ultra` en hardware moderno.
- 30 FPS á 1080p con `medium` en hardware modesto.

### Si va lento
1. Bajar `oceanQuality` á `medium` ó `low`.
2. Bajar `shipQuality` á `simple`.
3. Desactivar `fog`.
4. Desactivar `crewVoices` (libera el motor de voz).
5. Bajar la velocidad de simulación á 1 min/s ó 1 h/s (no afecta FPS pero baja la carga de updates).

### Frame budget
- Three.js render: ~6 ms á `ultra`.
- Update tick (física + decisiones + audio): ~1-2 ms.
- Leaflet redraw: variable según zoom (≤ 4 ms).
- Restante: navegador y compositor.

---

## 12. Climatología y modelos físicos

### Geomagnetismo
Modelo `gufm1` reducido (Jackson, Jonkers, Walker 2000) para declinación magnética. Pre-calcula valores á 1492 y 1504; interpola linealmente para fechas intermedias.

### Astronomía
Algoritmos abreviados de Jean Meeus, *Astronomical Algorithms* (1991):
- `sunPosition(date)` — RA, dec, lambda, ecuación del tiempo.
- `moonPosition(date)` — aprox simplificada, precisión ~0.5°.
- `polarisPosition(date)` — precesión incluida; en 1492 la Polar estaba á ~3.5° del polo verdadero (corrección de las Guardas).
- `bodyAltitudeAzimuth(pos, lat, lon, date)` — coordenadas horizontales.

### Viento y corrientes
Climatología por mes y latitud/longitud. Alisios del NE para travesías de ida (lat 10-30 N); variables del W para vueltas por las Azores (lat 30-50 N). Corriente del Golfo modelada en su mes y posición.

### Tormentas
Probabilidad por mes y caja lat/lon documentada históricamente (ver USER_MANUAL.md §9). Modelo Markov simple: una sola tormenta activa á la vez; duración y daño en rangos aleatorizados.

---

## 13. Diagnóstico de problemas

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| Pantalla negra á la derecha | WebGL bloqueado | Habilitar aceleración HW del navegador |
| Sondaleza siempre falla | CORS de open-elevation | Servir desde HTTP localhost |
| Las voces no hablan | No hay voces en español instaladas | Instalar paquete de idioma del SO; alternativamente desactivar `crewVoices` |
| Audio mudo | El navegador exige gesto del usuario | Click en cualquier lado de la página primero |
| FPS bajo | Calidad alta sobre GPU integrada | Bajar `oceanQuality` y `shipQuality` |
| Tiles del mapa no cargan | Bloqueo CORS / sin red | Servir desde localhost ó esperar caché |
| Save corrupto | localStorage llena ó corrompida | `localStorage.clear()` desde la consola |
| Botón Trayectoria no abre | JS error previo | F12 → consola → reportar al issue |

---

## 14. Verificación de integridad

```sh
# Comprueba que el fichero no tiene emojis, JS válido, sprite SVG coherente
node tools/check.mjs

# Preflight completo (lo anterior + audit + regresiones de tamaño)
node tools/preflight.mjs
```

Si `preflight` devuelve verde, el simulador está en estado consistente.

---

## 15. Limitaciones conocidas

- El simulador asume **un solo jugador**. No hay multiplayer ni red.
- Los modelos 3D son aproximaciones procedurales — no representaciones arqueológicas á escala.
- La declinación magnética usa el modelo gufm1 reducido — para investigación real consultar el modelo completo.
- Las efemérides Meeus simplificadas tienen ±2 minutos de error en mediodía solar — irrelevante para gameplay, no usar para navegación real.
- La sondaleza usa elevación terrestre actual (SRTM), no batimetría histórica reconstruida — los fondos del Caribe son aproximaciones plausibles.

---

## 16. Para más detalle

- Convenciones del proyecto: [CLAUDE.md](CLAUDE.md).
- Manual de usuario en voz del Almirante: [USER_MANUAL.md](USER_MANUAL.md).
- Arquitectura interna y proceso de desarrollo: [DEVELOPMENT_MANUAL.md](DEVELOPMENT_MANUAL.md).
- Auditoría completa (100 lentes de Schell): abrir `LensAudit.html` en navegador.

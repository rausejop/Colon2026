# ⚓ Colón 1492 — Manual del Piloto

> *Escrito de mi mano, Cristóbal Colón, Almirante de la Mar Océana, Visorrey y Gobernador de las Indias, para enseñanza del que tomare el gobernalle de esta nao de vidrio y luz que llaman ordenador.*

---

## Prólogo a Vuestra Merced

Plega a Nuestro Señor que halléis en este librillo lo que menester habéis para gobernar la flota como yo la goberné, desde el puerto de Palos en el año del Señor de mill y cuatrocientos y noventa y dos hasta las costas de Veragua. He aquí cuatro viajes míos en un solo cristal — el primero, el de la descubierta; el segundo, de la armada de diecisiete velas; el tercero, de la Tierra Firme y Paria; el cuarto, el alto viaje. Todos los días, todas las leguas, todas las almas que conmigo fueron, están allí escritos con su fuente, que no escribo cosa de la cual no haya razón en libro abierto.

Para entrar en el simulador no necesitáis más que abrir el fichero **`Colon2026.html`** en cualquier navegador moderno — Chrome, Edge, Firefox, todos sirven. No hay menester de instalar cosa ninguna; todo va dentro del mismo cristal.

---

## 1. División de la pantalla

El simulador se parte en dos mitades, como la carta y el mar:

- **A mano siniestra (izquierda)** — la **carta de marear**. Mapa doble: una capa moderna por debajo, y por encima la carta del XV o XVI según vuestro gusto (Portulano, Cosa 1500, Cantino 1502, Caverio 1505) o la moderna sin pergamino.
- **A mano diestra (derecha)** — la **mar y las tres naves**: la nao Santa María, la carabela Pinta y la Niña, en su formación verdadera, sobre olas que se mueven por shaders Gerstner (que así llaman los modernos a las ondas trocoidales).
- **Por encima de todo** — la **cabecera** con la fecha juliana simulada, la hora a bordo, los controles del tiempo y los botones de ayuda, configuración y salvado de partida.
- **Sobre la escena 3D**, transparente como vidriera, va el **HUD** (telemetría, vida a bordo, puesto, anotación del día) y los instrumentos del Piloto (compás, astrolabio, cuadrante, ampolleta).

---

## 2. El gobierno del Tiempo

En la barra superior tenéis siete velocidades de simulación. Pulsadlas con el ratón o con las teclas **1** a **7**:

| Tecla | Velocidad | Para qué sirve |
|------:|----------:|----------------|
| `1` | **1 : 1** | Tiempo real — un segundo de mar por cada segundo de cristal. Para sentir la maniobra. |
| `2` | **1 min/s** | Para una guardia entera en pocos minutos. |
| `3` | **1 h/s** | Para una jornada de mar. |
| `4` | **1 día/s** | Para cruzar el Océano en una mañana. |
| `5` | **1 semana/s** | Para abarcar el viaje primero (33 días) en medio minuto. |
| `6` | **2 meses/s** | Para los cuatro viajes en una sentada. |
| `7` | **1 año/s** | Para asomarse al conjunto. |

- **Espacio** — pausa y reanuda. Recordad: en pausa, el mar sigue ondulando, pero la fecha no avanza.
- **+ / −** o **⏪ ⏩** — paso adelante o atrás en la tabla de velocidades.
- **⚓ Sync histórico** (botón verde de la cabecera, o tecla **H**) — recoge la flota y la pone donde el Diario dice que estaba en la fecha simulada. Resetea las velas y cancela el modo manual. Es vuestro botón de penitencia para cuando os habéis perdido.

---

## 3. La carta de marear (mitad izquierda)

### 3.1 Eras cartográficas
Cinco botones en la esquina superior izquierda del mapa. Cada uno carga una carta verdadera de su tiempo, con su licencia abierta:

- **1492 · Portulano** — estilo del XV con filtro de pergamino y rosa de vientos.
- **1500 · Cosa** — *Mapamundi de Juan de la Cosa*, mi maestre y dueño de la Santa María; primer mapa conocido con la tierra del Nuevo Mundo.
- **1502 · Cantino** — *Planisferio de Cantino*, copia portuguesa que vino a manos del duque de Ferrara.
- **1505 · Caverio** — carta de Nicolò Caverio.
- **Moderno** — cartografía actual, por si os perdéis.

### 3.2 Capas (esquina superior derecha)
- **Ruta histórica** — la línea de mis cuatro viajes.
- **Hitos del Diario** — alfileres en los días señalados (avistamiento del 12 de octubre, naufragio de Nochebuena, Paria, Belén...).
- **Vientos alisios** — bandas de los alisios del NE (de ida) y los del oeste (de vuelta, por las Azores).
- **Isógonas 1492** — líneas de igual declinación magnética para el año de la descubierta.
- **Sólo topónimos del XV/XVI** — para no ver «Cuba» sino *Juana*, ni «Haití» sino *La Española*, ni «Puerto Rico» sino *Borinquen*, ni «San Salvador» sino *Guanahaní*, como los puse yo.

### 3.3 Matriz de coordenadas (al pie del mapa)
Cuatro lecturas a la vez, que son la sustancia del oficio:

1. **Estima** — el *dead reckoning* mío, con la merma del 15% que yo decía públicamente a la marinería para no espantarla.
2. **Magnética 1492** — coordenadas en aguja, con la declinación de aquel año (modelo *gufm1* reducido).
3. **Magnética 1504** — declinación al fin del cuarto viaje (la aguja noruesteaba ya bastante).
4. **GPS / WGS-84** — la verdad de hoy, que no teníamos.

---

## 4. La mar y las naves (mitad derecha)

### 4.1 Las tres naves
Las tres naves del primer viaje navegan juntas en formación. La que tenéis seleccionada en el panel **PUESTO A BORDO** es la activa; las otras dos van por autopilot histórico salvo que vos las hagáis manuales. Las velas se modelan una a una:

- **Trinquete** (foque cuadrado a proa)
- **Mayor** (la grande)
- **Gavia** (sobre la mayor)
- **Mezana** (latina, a popa)
- **Cebadera** (bajo el bauprés)

Cada una se ajusta de 0 a 100% con su deslizador. El motor calcula la propulsión por el ángulo aparente del viento: **bajo 67° de ceñida no hay propulsión ninguna** — el aparejo redondo del XV no sabe ceñir como las latinas; el rendimiento máximo está entre 110° y 150° (largo y popa).

> **Aviso del Almirante:** si tocáis las velas o el timón de la nave activa, ésta se separa de la formación y queda en modo *manual*. Para volver a juntarlas, pulsad ⚓ Sync histórico (tecla **H**).

### 4.2 Maniobra con el timón (teclado)
| Tecla | Efecto |
|------:|--------|
| `←` / `→` | Caña a babor / estribor |
| `↑` / `↓` | Acortar / largar trapo (todas las velas a una) |
| `H` | Volver al rumbo histórico y devolver el control al autopilot |

### 4.3 Vista 3D y pantalla completa
- **⛶ Mapa a pantalla completa** o **⛶ Naves a pantalla completa** — cada panel puede ocupar todo el viewport. **ESC** restaura la vista partida.
- Teclas **M** (Mapa) y **N** (Naves) — atajos para los mismos botones.
- El ratón sobre la escena 3D rota la cámara (orbit controls); la rueda hace zoom.

---

## 5. El Puesto a bordo

Panel arriba a la derecha. Elegid:

- **Nave** — Santa María, Pinta o Niña (la activa).
- **Tripulante** — el rol cambia el HUD según el oficio del hombre. Pongamos por caso:
  - **Almirante (yo)** — cartas y estima.
  - **Piloto** (Pedro Alonso Niño, Cristóbal García Sarmiento, Sancho Ruiz) — astrolabio, cuadrante, ampolleta.
  - **Maestre** (Juan de la Cosa, Juan Niño) — bodega, carga.
  - **Contramaestre** (Chachu) — jarcia, velas.
  - **Carpintero** (Maestre Juan) — integridad del casco.
  - **Tonelero** (Lope) — pipas de agua y vino.
  - **Cirujano** (Maestre Alonso) — salud de la marinería.
  - **Vigía** (Rodrigo de Triana) — el grito de tierra.
  - **Despensero** (García Hernández) — ración del día.

Cada nombre lleva su biografía y su fuente — Gould (1984) para los del 1492, Pleitos Colombinos del Archivo General de Indias para los del segundo, tercero y cuarto viaje.

---

## 6. Telemetría y vida a bordo

A la izquierda del HUD veis dos paneles:

### 6.1 Telemetría
- **Viento** — velocidad en nudos y rumbo cardinal (de dónde sopla).
- **Beaufort** — fuerza F0 a F12.
- **Velocidad en agua / sobre tierra (STW / SOG)** — la primera por la corredera, la segunda corregida por corriente.
- **Rumbo** — verdadero, en grados y rumbo cardinal.
- **Timón** — grados a babor o estribor.
- **Abatimiento (leeway)** — grados a sotavento.
- **Deriva (drift)** — corriente oceánica climatológica.
- **Tensión de la jarcia / Integridad del casco / Moral de la marinería** — barritas en color. Cuando el casco baja de 40%, la nao hace agua; cuando la moral baja de 30%, hay riesgo de motín.

### 6.2 Vida a bordo
- **Hora canónica** — Maitines, Laudes, Prima, Tercia, Sexta, Nona, Vísperas, Completas. Cada una traerá su rezo.
- **Guardia y ampolleta** — guardia 1 a 6 (cada una de cuatro horas), ampolleta 1 a 8 dentro de cada guardia. La campana suena tantas veces como ampolletas van.
- **Salve Regina** — cantada al ocaso por los grumetes, según costumbre.
- **Menú del día** — carne salada los días de carne; pescado, queso o garbanzos los viernes y vigilias.
- **Ración** — **libra y media de bizcocho, medio azumbre de vino, seis onzas de carne salada, dos cuartillos de agua**. Provisiones embarcadas para unos 90 días.

---

## 7. Las decisiones del Almirante

En las fechas señaladas del Diario, la simulación se detiene y os presenta **tres opciones**:

- La marcada con **⚓** es la **histórica** — lo que yo hice.
- Las otras dos son **contrafactuales razonados**, con consecuencias documentadas que afectan a moral, casco y trayectoria, pero no rompen la línea principal del relato.

Días de decisión que encontraréis:

- **6 de agosto de 1492** — Avería del timón de la Pinta. ¿Sospecháis de Quintero, calláis, o dejáis a la Pinta a su suerte?
- **25 de septiembre de 1492** — Pinzón grita «¡albricias, tierra!» — pero al día siguiente es nube. ¿Bajáis a explorar al sudoeste o seguís al oeste?
- **10 de octubre de 1492** — Motín de la marinería. Tres días les pedí. ¿Tres, uno, o regresar?
- **24-25 de diciembre de 1492** — El mozo al timón, la nao en banco. ¿Encalláis (Fuerte de la Navidad), salváis, o seguís?
- **Febrero 1493** — Tormenta camino de Lisboa. ¿Echáis al mar la barrica con copia del Diario o probáis la carabela?
- **Julio 1502** — Huracán en Santo Domingo. Bobadilla no escucha — y los suyos perecen.

> Antes de cerrar el modal de decisión, podéis ajustar la velocidad de simulación para lo que venga después.

---

## 8. Instrumentos del Piloto

Al pie de la escena 3D (visibles según el rol):

- **Compás** — rosa de los vientos con la **declinación de 1492 ya aplicada** sobre el rumbo verdadero. Lo que veis es lo que veía yo en mi bitácora.
- **Astrolabio náutico** — altura del Sol a mediodía (de día) o de la **estrella Polar** (de noche), con la **corrección de las Guardas** según la regla de la Polar (a la cabeza, brazo izquierdo, hombro siniestro...) que se usaba en el XV antes de la regla del Norte de Faleiro.
- **Cuadrante** — la otra vía de medir altura, con la plomada.
- **Ampolleta** — la media hora se vuelca con su campana, como en cubierta. Si bajáis la velocidad a 1:1, la oís sonar.
- **Flecha de viento** en la escena 3D — sobre la nave activa, apuntando hacia donde sopla.

---

## 9. Salvar y cargar partida

- **💾 Guardar** — guarda la fecha simulada, posición, rumbo, velas, moral, casco, y qué decisiones habéis tomado.
- **📂 Cargar** — restaura el estado.
- El navegador lo guarda en su `localStorage`; cada cristal (cada equipo, cada navegador) tiene su propio salvado.

---

## 10. Configuración (⚙)

- **Calidad del océano** — `low`, `medium`, `high`, `ultra`. En `ultra` el mar son 256×256 vértices con shader Gerstner de cuatro armónicos; en `low` baja a 64×64.
- **Calidad de las naves** — afecta a número de polígonos del casco, segmentos del mástil, jarcia, texturas procedurales y normal maps. En `low` no hay jarcia ni anclas; en `ultra` hay obenques, flechastes, cofas y ventanas en los castillos.
- **Toggles** — formación de flota visible, flecha de viento, niebla, isógonas, vientos alisios, topónimos sólo XV/XVI, modo de diario (original, modernizado o ambos), avisos toast, sonido, velocidad por defecto.

---

## 11. Atajos de teclado — resumen

| Tecla | Efecto |
|------:|--------|
| `Espacio` | Pausa / reanuda |
| `+` / `−` | Acelerar / decelerar |
| `1`–`7` | Velocidad directa |
| `←` / `→` | Timón a babor / estribor (modo manual) |
| `↑` / `↓` | Acortar / largar trapo (modo manual) |
| `H` | Sync histórico — vuelve la flota a la posición real, resetea velas, cancela manual |
| `S` | Sonido on / off |
| `M` / `N` | Pantalla completa de Mapa / Naves |
| `D` | Abre / cierra el Diario lateral |
| `ESC` | Cierra modal o restaura la vista partida |

---

## 12. Sobre las fuentes

No hay en este simulador nombre, fecha, coordenada ni viento que no lleve su fuente abierta. Las principales son:

- **Diario de a bordo** — transcripción de Fray Bartolomé de las Casas (c. 1530), Biblioteca Nacional de España, Mss/Vitr/6/7. Edición de Manuel Alvar (Cabildo Insular de Gran Canaria, 1976) y versión de Ernesto Arias (Biblioteca Virtual Miguel de Cervantes).
- **Historia de las Indias** — Las Casas.
- **Vida del Almirante** — Hernando Colón, hijo mío, paje del cuarto viaje.
- **Lettera Rarissima** — mi carta desde Jamaica de 7 de julio de 1503.
- **Colección Navarrete** — Martín Fernández de Navarrete, *Colección de los viajes y descubrimientos*, Madrid 1825-1837 (en el fichero `reference/BRes140146.pdf`).
- **Pleitos Colombinos** — Archivo General de Indias.
- **Gould (1984)** — Alice Bache Gould, *Nueva lista documentada de los tripulantes de Colón en 1492*.
- **Martínez-Hidalgo (1966)** — para las reconstrucciones modernas de las naves.
- **gufm1 (Jackson et al. 2000)** — para el magnetismo terrestre histórico.
- **Meeus** — para las efemérides astronómicas.

Las fechas son del **calendario juliano** (estilo antiguo) hasta 1582, como aparecen en las fuentes — no del gregoriano, que aún no existía cuando partimos de Palos.

---

## Despedida

Plega a Nuestro Señor que con este simulador veáis lo que yo vi: la mar pacífica, el viento alisio que no afloja, el bullicio de las aves a las setenta leguas, la luz que se asomó en la noche del 11 de octubre, el grito de Rodrigo de Triana al amanecer del 12, y la tierra de Guanahaní que llamé **San Salvador** por dar gracias a Nuestro Señor que tal merced nos había hecho.

Y si en algo erraré, perdonadme, que yo no soy hombre de letras sino de la mar.

*Hecho en este cristal el año del Señor de 2026, día 16 de mayo, declinación magnética moderna ya muy distinta de la de mi tiempo.*

**Christophorus Columbus**
*El Almirante*

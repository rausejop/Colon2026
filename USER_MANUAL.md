# Manual del Piloto — Colón 1492

> *Escrito de mi mano, Cristóbal Colón, Almirante de la Mar Océana, Visorrey y Gobernador de las Indias, para enseñanza del que tomare el gobernalle de esta nao de vidrio y luz que llaman ordenador.*

---

## Prólogo á Vuestra Merced

Plega á Nuestro Señor que halléis en este librillo lo que menester habéis para gobernar la flota como yo la goberné, desde el puerto de Palos en el año del Señor de mill y cuatrocientos y noventa y dos hasta las costas de Veragua. He aquí cuatro viajes míos en un solo cristal — el primero, el de la descubierta; el segundo, de la armada de diecisiete velas; el tercero, de la Tierra Firme y Paria; el cuarto, el alto viaje. Todos los días, todas las leguas, todas las almas que conmigo fueron, están allí escritos con su fuente, que no escribo cosa de la cual no haya razón en libro abierto.

Para entrar en el simulador no necesitáis más que abrir el fichero **`Colon2026.html`** en cualquier navegador moderno — Chrome, Edge, Firefox, todos sirven. No hay menester de instalar cosa ninguna; todo va dentro del mismo cristal.

---

## 1. División de la pantalla

El simulador se parte en dos mitades, como la carta y el mar:

- **A mano siniestra (izquierda)** — la **carta de marear**. Mapa doble: una capa moderna por debajo, y por encima la carta del XV ó XVI según vuestro gusto (Portulano, Cosa 1500, Cantino 1502, Caverio 1505) ó la moderna sin pergamino.
- **A mano diestra (derecha)** — la **mar y las tres naves**: la nao Santa María, la carabela Pinta y la Niña, en su formación verdadera, sobre olas que se mueven por shaders Gerstner (que así llaman los modernos á las ondas trocoidales).
- **Por encima de todo** — la **cabecera** con la fecha juliana simulada, la hora á bordo, los controles del tiempo y los botones de ayuda, configuración y salvado de partida.
- **Bajo la cabecera** — la **línea de tiempo de los cuatro viajes**, con segmentos coloreados (I verde, II dorado, III sepia, IV granate) y un marcador pulsante en la fecha simulada actual.
- **Sobre la escena 3D**, transparente como vidriera, va el **HUD** (telemetría, vida á bordo, puesto, anotación del día) y los instrumentos del Piloto (compás, astrolabio, cuadrante, sondaleza, ampolleta).
- **En la esquina inferior izquierda**, una **pista contextual** discreta os sugiere qué hacer en cada momento (tomar la altura al mediodía, echar la sondaleza si la tierra se acerca, arriar velas si arrecia el temporal).

---

## 2. El gobierno del Tiempo

En la barra superior tenéis siete velocidades de simulación. Pulsadlas con el ratón ó con las teclas **1** á **7**:

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
- **+ / −** ó los botones de la cabecera — paso adelante ó atrás en la tabla de velocidades.
- **Sync histórico** (botón verde de la cabecera, ó tecla **H**) — recoge la flota y la pone donde el Diario dice que estaba en la fecha simulada. Resetea las velas y cancela el modo manual. Es vuestro botón de penitencia para cuando os habéis perdido.

---

## 3. La carta de marear (mitad izquierda)

### 3.1 Eras cartográficas
Cinco botones en la esquina superior izquierda del mapa. Cada uno carga una carta verdadera de su tiempo, con su licencia abierta:

- **1492 · Portulano** — estilo del XV con filtro de pergamino y rosa de vientos.
- **1500 · Cosa** — *Mapamundi de Juan de la Cosa*, mi maestre y dueño de la Santa María; primer mapa conocido con la tierra del Nuevo Mundo.
- **1502 · Cantino** — *Planisferio de Cantino*, copia portuguesa que vino á manos del duque de Ferrara.
- **1505 · Caverio** — carta de Nicolò Caverio.
- **Moderno** — cartografía actual, por si os perdéis.

### 3.2 Capas (esquina superior derecha)
- **Ruta histórica** — la línea de mis cuatro viajes.
- **Hitos del Diario** — alfileres en los días señalados (avistamiento del 12 de octubre, naufragio de Nochebuena, Paria, Belén...).
- **Vientos alisios** — bandas de los alisios del NE (de ida) y los del oeste (de vuelta, por las Azores).
- **Isógonas 1492** — líneas de igual declinación magnética para el año de la descubierta.
- **Sólo topónimos del XV/XVI** — para no ver «Cuba» sino *Juana*, ni «Haití» sino *La Española*, ni «Puerto Rico» sino *Borinquen*, ni «San Salvador» sino *Guanahaní*, como los puse yo.

### 3.3 Matriz de coordenadas (al pie del mapa)
Cuatro lecturas á la vez, que son la sustancia del oficio:

1. **Estima** — el *dead reckoning* mío, con la merma del 15 % que yo decía públicamente á la marinería para no espantarla.
2. **Magnética 1492** — coordenadas en aguja, con la declinación de aquel año (modelo *gufm1* reducido).
3. **Magnética 1504** — declinación al fin del cuarto viaje (la aguja noruesteaba ya bastante).
4. **GPS / WGS-84** — la verdad de hoy, que no teníamos.

---

## 4. La mar y las naves (mitad derecha)

### 4.1 Las tres naves
Las tres naves del primer viaje navegan juntas en formación. La que tenéis seleccionada en el panel **PUESTO Á BORDO** es la activa; las otras dos van por autopilot histórico salvo que vos las hagáis manuales. Las velas se modelan una á una:

- **Trinquete** (foque cuadrado á proa)
- **Mayor** (la grande)
- **Gavia** (sobre la mayor)
- **Mezana** (latina, á popa)
- **Cebadera** (bajo el bauprés)

Cada una se ajusta de 0 á 100 % con su deslizador. El motor calcula la propulsión por el ángulo aparente del viento: **bajo 67° de ceñida no hay propulsión ninguna** — el aparejo redondo del XV no sabe ceñir como las latinas; el rendimiento máximo está entre 110° y 150° (largo y popa).

> **Aviso del Almirante:** si tocáis las velas ó el timón de la nave activa, ésta se separa de la formación y queda en modo *manual*. Para volver á juntarlas, pulsad Sync histórico (tecla **H**).

### 4.2 Maniobra con el timón (teclado)
| Tecla | Efecto |
|------:|--------|
| `←` / `→` | Caña á babor / estribor |
| `↑` / `↓` | Acortar / largar trapo (todas las velas á una) |
| `H` | Volver al rumbo histórico y devolver el control al autopilot |

### 4.3 Vista 3D y pantalla completa
- Conmutadores **Mapa** y **Naves** en la cabecera — cada panel puede ocupar todo el viewport. Si pulsáis ambos, vista partida. **ESC** restaura la vista partida.
- Teclas **M** (Mapa) y **N** (Naves) — atajos para los mismos botones.
- El ratón sobre la escena 3D rota la cámara (orbit controls); la rueda hace zoom.

---

## 5. El Puesto á bordo

Panel arriba á la derecha. Elegid:

- **Nave** — Santa María, Pinta ó Niña (la activa).
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

> **Novedad:** al cambiar de rol veréis una **microcita de la contradicción interna** de cada personaje, atada á su biografía documentada. Yo, devoto y codicioso á la vez; Martín Alonso Pinzón, indispensable aliado y rival; Triana, que gritó tierra y perdió la pensión; Caonabo, enemigo terrible que murió de pena en cadenas. Los hombres no son de una pieza.

---

## 6. Telemetría y vida á bordo

A la izquierda del HUD veis dos paneles:

### 6.1 Telemetría
- **Viento** — velocidad en nudos y rumbo cardinal (de dónde sopla).
- **Beaufort** — fuerza F0 á F12.
- **Velocidad en agua / sobre tierra (STW / SOG)** — la primera por la corredera, la segunda corregida por corriente.
- **Rumbo** — verdadero, en grados y rumbo cardinal.
- **Timón** — grados á babor ó estribor.
- **Abatimiento (leeway)** — grados á sotavento.
- **Deriva (drift)** — corriente oceánica climatológica.
- **Tensión de la jarcia / Integridad del casco / Moral de la marinería** — barritas en color. Cuando el casco baja de 40 %, la nao hace agua; cuando la moral baja de 30 %, hay riesgo de motín.

### 6.2 Vida á bordo
- **Hora canónica** — Maitines, Laudes, Prima, Tercia, Sexta, Nona, Vísperas, Completas. Cada una traerá su rezo.
- **Guardia y ampolleta** — guardia 1 á 6 (cada una de cuatro horas), ampolleta 1 á 8 dentro de cada guardia. La campana suena tantas veces como ampolletas van.
- **Salve Regina** — cantada al ocaso por los grumetes, según costumbre.
- **Menú del día** — carne salada los días de carne; pescado, queso ó garbanzos los viernes y vigilias.
- **Ración** — **libra y media de bizcocho, medio azumbre de vino, seis onzas de carne salada, dos cuartillos de agua**. Provisiones embarcadas para unos 90 días.

### 6.3 Plazos cuantificados
Al pie del panel «Próximo hito» veréis cuatro cuentas atrás:

- **Agua dulce** — días que quedan al ritmo de consumo.
- **Hito próximo** — días al siguiente hito histórico según vuestra velocidad real.
- **Casco crítico** — días hasta que el casco cruce el 40 % al ritmo actual de degradación (sólo cuenta si hay temporal).
- **Riesgo de motín** — días hasta motín si la moral de la marinería se mantiene baja. Calibrado al motín del 10 de octubre de 1492.

---

## 7. Las decisiones del Almirante

En las fechas señaladas del Diario, la simulación se detiene y os presenta **tres opciones**:

- La marcada con el ancla es la **histórica** — lo que yo hice.
- Las otras dos son **contrafactuales razonadas**, con consecuencias documentadas que afectan á moral, casco y trayectoria, pero no rompen la línea principal del relato.

Trece días de decisión que encontraréis, repartidos por los cuatro viajes:

| Fecha | Decisión |
|-------|----------|
| 6-VIII-1492 | Avería del timón de la Pinta |
| 13-IX-1492 | La aguja noruestea |
| 25-IX-1492 | Falsa albricia de Pinzón |
| 7-X-1492 | Aves al sudoeste — virar al OSO |
| 10-X-1492 | Motín de la marinería |
| 25-XII-1492 | El timón al grumete (Nochebuena) |
| 14-II-1493 | Tormenta deshecha al regreso |
| 28-XI-1493 | Hallazgo de La Navidad destruida |
| 12-VI-1494 | Juramento de Cuba como tierra firme |
| 4-VIII-1498 | Avistamiento de Tierra Firme en Paria |
| 23-VIII-1500 | Bobadilla con cadenas |
| 29-VI-1502 | Aviso del huracán de Santo Domingo |
| 25-VI-1503 | Encalladura en Santa Gloria (Jamaica) |

Cada opción muestra etiquetas de **moral**, **casco**, **riesgo** y **recompensa** previstos. Antes de cerrar el modal podéis ajustar la velocidad de simulación para lo que venga después.

---

## 8. Instrumentos del Piloto

Al pie de la escena 3D veis los cuatro instrumentos navales reales:

| Instrumento | Atajo | Para qué sirve |
|-------------|:-----:|----------------|
| **Astrolabio náutico** | `A` | Altura del Sol al mediodía (de día) ó de la **Polar** (de noche), con corrección de las Guardas según la regla del XV |
| **Cuadrante** | `Q` | Otra vía de medir altura, con la plomada — más robusto que el astrolabio en mar gruesa |
| **Sondaleza** | `L` | Plomada al fondo: brazas y tipo de suelo. Usa elevación SRTM real |
| **Corredera** | `C` | Cuenta los nudos que pasan en 28 segundos para medir velocidad |

> **Atajos sin pausar la sim:** pulsad `A`, `Q`, `L` ó `C` y abriréis el instrumento al vuelo sin detener el tiempo. Pequeñas teclas flotantes sobre cada instrumento del HUD os recuerdan los atajos.

También en el HUD:
- **Compás** — rosa de los vientos con la **declinación de 1492 ya aplicada** sobre el rumbo verdadero.
- **Ampolleta** — la media hora se vuelca con su campana, como en cubierta. Si bajáis la velocidad á 1:1, la oís sonar.
- **Flecha de viento** en la escena 3D — sobre la nave activa, apuntando hacia donde sopla.

---

## 9. Temporales y peligros climatológicos

La mar oceánica no es siempre apacible. La simulación dispara tormentas reales según la climatología histórica del Atlántico Norte y del Caribe:

| Peligro | Cuándo | Efecto |
|---------|--------|--------|
| **Chubasco** | Todo el año, cualquier latitud | Daño leve, viento fresco |
| **Tormenta deshecha del Atlántico** | Noviembre á marzo, N del Atlántico | Olas de tres y cuatro brazas, casco -3 á -9 % |
| **Huracán de las Indias** | Junio á noviembre, Caribe | Casco -8 á -18 %, moral -20 |
| **Calma chicha** | Mayo á septiembre, gyre subtropical | Sin viento, agua merma en las pipas |
| **Galerna** | Otoño y primavera, Cantábrico y Cádiz | Casco -2 á -5 %, viento del NO |
| **Borrasca tropical** | Mayo á noviembre, Caribe | Casco -1.5 á -4 %, rachas cruzadas |
| **Niebla espesa** | Marzo á septiembre, Banco de Terranova | No daña directamente, pero suprime avistamientos y agrava el riesgo de encalladura |

> **Verbo de emergencia — «echar la barrica al mar»:** durante temporal severo (severidad ≥ 3), si la nao corre peligro de perderse, podréis echar al mar una barrica con copia del Diario, como yo hice el 14 de febrero de 1493 frente á las Azores. Aparece un botón rojo pulsante á la izquierda. Una vez por viaje. +5 á la moral; cita literal en el Diario.

---

## 10. Encuentros con poblaciones nativas

Cuando aproximéis las costas correspondientes en las fechas reales, la simulación disparará los encuentros documentados:

- **12-X-1492 · Guanahaní** — Primer contacto con los taínos. Cuentas de vidrio, bonetes colorados.
- **2-XI-1492 · Cuba interior** — Embajada al Gran Khan con Luis de Torres. Primer encuentro con el tabaco.
- **22-XII-1492 · Bohío** — Recepción del cacique Guacanagarí, único aliado constante.
- **13-I-1493 · Samaná** — Primer combate con los ciguayos.
- **29-IV-1494 · Maguana** — Caonabo prendido por Hojeda con engaño.
- **5-VIII-1498 · Paria** — Tierra Firme y las perlas de Cubagua.
- **14-VIII-1502 · Guanaja** — Primer contacto maya: canoa larga como galera, papel, espadas de pedernal.
- **6-IV-1503 · Belén** — Quibián de Veragua, conflicto y prisión.

Cada uno con cita literal del Diario, Las Casas ó Hernando Colón, voz del cronista (yo, Luis de Torres ó mi hijo Hernando) y efecto en la moral.

---

## 11. Trayectoria del Almirante (telemetría personal)

Pulsad la tecla **T** ó el botón «Trayectoria» en el HUD derecho. Veréis vuestra partida en cifras:

- Tiempo al timón manual.
- Tomas con astrolabio, cuadrante, sondas, corredera.
- Error medio de altura — y una distinción (novicio → aprendiz → piloto fiable → piloto magistral).
- Avistamientos oceánicos, temporales sobrevividos, motines superados.
- Decisiones tomadas: cuántas históricas, cuántas contrafactuales, vuestra senda.

### Metas personales
Catálogo de ocho objetivos opcionales que podéis comprometeros á perseguir. Cada uno con su fuente histórica y barra de avance automática. Hasta tres metas á la vez:

- Piloto magistral del Almirante (20 alturas con error medio < 1°).
- Sobrevivir cinco temporales.
- Echar la barrica al mar como yo en 1493.
- Sosegar el motín del 10 de octubre.
- Senda histórica fiel (10 decisiones como yo las tomé).
- Llegar á Palos con la flota intacta (casco ≥ 80 % al 15-III-1493).
- Cartografiar Paria antes del 31-VIII-1498.
- Completar los cuatro viajes (7-XI-1504).

La telemetría es exportable á JSON para que comparéis vuestra travesía con otras.

---

## 12. Pantalla de cierre por viaje

Cuando crucéis la fecha de regreso de cada viaje (15-III-1493 · 11-VI-1496 · 25-XI-1500 · 7-XI-1504), aparecerá una **pantalla emotiva de cierre** con cita literal mía, resumen de vuestra Trayectoria de ese viaje, metas cumplidas, vuestra Capitulación personal si la declarasteis al embarcar, y un botón para continuar al siguiente viaje. El cierre del cuarto viaje recibe el título «Fin de la Empresa» y la cita es de la *Lettera Rarissima* desde Jamaica.

---

## 13. Modos de dificultad

Tres modos en el modal de Configuración:

- **Cabotaje** — observador. Autopilot total, sin teclado. Ideal para contemplar. Casco á ×0.4 de fragilidad, tormentas á ×0.35, víveres á ×0.75, motines suaves.
- **Almirante** — el rigor histórico estándar. Manual completo.
- **Capitán General** — para quien busca el peligro real. Casco á ×2.6 de fragilidad, tormentas á ×1.6 de probabilidad, víveres á ×1.35 de consumo, motines á ×1.6.

---

## 14. Salvar y cargar partida

- **Guardar** — guarda la fecha simulada, posición, rumbo, velas, moral, casco, qué decisiones habéis tomado, qué encuentros se han disparado, qué viajes habéis cerrado, qué metas habéis comprometido.
- **Cargar** — restaura todo el estado.
- El navegador lo guarda en su `localStorage`; cada cristal (cada equipo, cada navegador) tiene su propio salvado.

---

## 15. Configuración

- **Calidad del océano** — `low`, `medium`, `high`, `ultra`. En `ultra` el mar son 256 × 256 vértices con shader Gerstner de cuatro armónicos; en `low` baja á 64 × 64.
- **Calidad de las naves** — afecta á polígonos del casco, segmentos del mástil, jarcia, texturas procedurales y normal maps.
- **Toggles** — formación de flota visible, flecha de viento, niebla, isógonas, vientos alisios, topónimos sólo XV/XVI, modo de diario (original, modernizado ó ambos), avisos toast, sonido, velocidad por defecto, voces de la tripulación, dificultad, modo Capitán Errante (libre, sólo tras el sello «Vuelta del I viaje»).

---

## 16. Música y voces

- **Drone armónico sutil** — pad sintetizado con tres voces (tónica La2 + quinta + octava) y pseudo-reverberación. La tónica baja á 92 Hz y entra un sub-grave cuando arrecia el Beaufort. Sin ficheros externos, todo sintetizado.
- **Viento y oleaje** — ruido filtrado paso-banda y paso-bajo modulado por LFO.
- **Campana del barco** — suena tantas veces como ampolletas van, cada media hora.
- **Voces sintetizadas** — Web Speech adaptada á edad y oficio de cada tripulante. Hablan los grumetes con voz joven, los maestres con voz grave, los hidalgos con cuidada cadencia.
- **Salve cantada** — al ocaso de cada jornada.

---

## 17. Atajos de teclado — resumen

| Tecla | Efecto |
|------:|--------|
| `Espacio` | Pausa / reanuda |
| `+` / `−` | Acelerar / decelerar |
| `1`–`7` | Velocidad directa |
| `←` / `→` | Timón á babor / estribor (modo manual) |
| `↑` / `↓` | Acortar / largar trapo (modo manual) |
| `H` | Sync histórico — vuelve la flota á la posición real, resetea velas, cancela manual |
| `S` | Sonido on / off |
| `M` / `N` | Pantalla completa de Mapa / Naves |
| `D` | Abre / cierra el Diario lateral |
| `A` | Astrolabio (sin pausar) |
| `Q` | Cuadrante (sin pausar) |
| `L` | Sondaleza |
| `C` | Corredera |
| `T` | Trayectoria del Almirante |
| `ESC` | Cierra modal ó restaura la vista partida |

---

## 18. Sobre las fuentes

No hay en este simulador nombre, fecha, coordenada ni viento que no lleve su fuente abierta. Las principales son:

- **Diario de á bordo** — transcripción de Fray Bartolomé de las Casas (c. 1530), Biblioteca Nacional de España, Mss/Vitr/6/7. Edición de Manuel Alvar (Cabildo Insular de Gran Canaria, 1976) y versión de Ernesto Arias (Biblioteca Virtual Miguel de Cervantes).
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

Plega á Nuestro Señor que con este simulador veáis lo que yo vi: la mar pacífica, el viento alisio que no afloja, el bullicio de las aves á las setenta leguas, la luz que se asomó en la noche del 11 de octubre, el grito de Rodrigo de Triana al amanecer del 12, y la tierra de Guanahaní que llamé **San Salvador** por dar gracias á Nuestro Señor que tal merced nos había hecho.

Y si en algo erraré, perdonadme, que yo no soy hombre de letras sino de la mar.

*Hecho en este cristal el año del Señor de 2026, declinación magnética moderna ya muy distinta de la de mi tiempo.*

**Christophorus Columbus**
*El Almirante de la Mar Océana*

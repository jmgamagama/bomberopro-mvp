# Tema 9 — informe de calidad (fuentes oficiales)

**Epígrafe (BOP Badajoz n.º 135, 17/07/2026):** Hidraulica: concepto de fluido, densidad, caudal, presion estatica y presion dinamica. Hidrostatica. Hidrodinamica. Ecuacion de continuidad. Ecuacion de Bernoulli. Ecuacion de descarga. Instalaciones hidraulicas de extincion con agua. Perdidas de carga. Caracteristicas de las bombas centrifugas. Curva caracteristica de una bomba. Punto de funcionamiento de una instalacion. Acoplamiento de bombas. Instalaciones y sus caracteristicas.

## Fuentes

- IDAE, Guía técnica «Selección de equipos de transporte de fluidos» (junio 2012), documento reconocido del RITE publicado en la web del MITECO — IDAE-GUIA-BOMBAS, guía técnica oficial (IDAE/MITECO), edición de junio de 2012: https://www.miteco.gob.es/content/dam/miteco/es/energia/files-1/Eficiencia/RITE/documentosreconocidosrite/Gu%C3%ADas%20t%C3%A9cnicas/Guia_Bombas_Ventiladores.pdf
- INSST, NTP 362: Fugas en recipientes y conducciones: emisión en fase líquida (serie NTP 331 a 365, 1995) — INSST-NTP362, nota técnica de prevención (INSST), versión web del INSST, serie 1995: https://www.insst.es/documentacion/colecciones-tecnicas/ntp-notas-tecnicas-de-prevencion/10-serie-ntp-numeros-331-a-365-ano-1995/ntp-362-fugas-en-recipientes-y-conducciones-emision-en-fase-liquida
- Real Decreto 2032/2009, de 30 de diciembre, por el que se establecen las unidades legales de medida — BOE-A-2010-927, texto consolidado del BOE, texto consolidado (últ. actualización 29/04/2020): https://www.boe.es/buscar/act.php?id=BOE-A-2010-927
- Real Decreto 709/2015, de 24 de julio, requisitos esenciales de seguridad para la comercialización de los equipos a presión — BOE-A-2015-9527, texto consolidado del BOE, texto consolidado (últ. actualización 10/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-2015-9527
- Real Decreto 513/2017, de 22 de mayo, Reglamento de instalaciones de protección contra incendios (RIPCI) — BOE-A-2017-6606, texto consolidado del BOE, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606
- Código Técnico de la Edificación, Documento Básico HS Salubridad, sección HS 4 Suministro de agua — CTE-DB-HS4, documento básico del CTE (codigotecnico.org), DB HS consolidado (14 de junio de 2022): https://www.codigotecnico.org/pdf/Documentos/HS/DBHS.pdf
- Reglamento (UE) n.º 547/2012 de la Comisión, de 25 de junio de 2012, requisitos de diseño ecológico para las bombas hidráulicas — UE-REG-547-2012, reglamento de la UE (EUR-Lex), versión consolidada de 09/01/2017 (EUR-Lex): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:02012R0547-20170109

Copias locales de trabajo en /workspace/fuentes_oficiales/tema09/ (no se suben al repositorio).

Nota sobre la guía del IDAE: su aviso legal permite la reproducción para la práctica profesional; la reproducción con fines editoriales requiere autorización escrita del IDAE. Las fichas no reproducen texto extenso ni figuras: son preguntas breves con cita de página. Conviene confirmarlo antes de una publicación comercial.

Dominio añadido a OFFICIAL_DOMAINS: `miteco.gob.es` (Ministerio para la Transición Ecológica, Gobierno de España; aloja la guía del IDAE como documento reconocido del RITE).

No se han usado: libro CEP, material interno del CPEI, academias, /workspace/privado, normas UNE, tablas de fabricante ni fuentes educativas (OpenStax, UPV), que no están en la lista de dominios oficiales.

## Resultado

- Fichas redactadas: 101; recortadas por redundancia: 16; retiradas en revisión: 1; **cargadas: 84**.
- Revisión manual de todas las fichas (segunda pasada): 84 revisadas; errores: 0 (0.0 %). **Estado: cargado** (revisión del mazo: pendiente).

## Cobertura del epígrafe

- Concepto de fluido, densidad (unidades SI, agua a 20 °C): cubierto (RD 709/2015, RD 2032/2009, IDAE)
- Caudal: cubierto (NTP 362: Qv=v·A, Qm=ρ·v·A)
- Presión estática y presión dinámica: cubierto (IDAE parte II; RD 709/2015 presión manométrica)
- Hidrostática: parcial: variación de presión con la altura (ρ·g·h, ejemplo IDAE) y altura en m c.a.; principios de Pascal y Arquímedes sin fuente oficial localizada
- Hidrodinámica / ecuación de Bernoulli: cubierto (NTP 362, IDAE: flujo ideal y real)
- Ecuación de continuidad: PARCIAL: solo Q=v·A; ninguna fuente oficial localizada enuncia A1·v1=A2·v2, no se crea ficha
- Ecuación de descarga: cubierto (NTP 362: Torricelli, Cd=Cv·Cc, valores típicos, alcance del chorro)
- Pérdidas de carga: cubierto (IDAE: Darcy, Blasius, Colebrook, accesorios; NTP 362: laminar/turbulento; CTE HS 4)
- Características de las bombas centrífugas: cubierto (IDAE; Reglamento UE 547/2012)
- Cavitación y NPSH: cubierto (IDAE)
- Curva característica / punto de funcionamiento: cubierto (IDAE)
- Acoplamiento de bombas: cubierto (IDAE serie/paralelo; CTE HS 4 grupos de presión)
- Instalaciones hidráulicas de extinción con agua: parcial (RIPCI: abastecimiento, hidrantes, BIE); detalle en los mazos de los temas 10 y 33; sin fuente oficial libre sobre bombas de autobomba ni tendidos de mangueras
- Instalaciones y sus características: parcial (CTE HS 4: presiones, velocidades, grupos de presión)

## Comprobación automática

- Cada ficha lleva frases literales de evidencia que deben aparecer (texto normalizado) en la página o documento citado (script de trabajo /workspace/fase_t9/build_t9.py).
- Datos numéricos recalculados de forma independiente en src/data/tema9Recall.test.ts (unidades, ρ·g·h, presión de vapor en m c.a., leyes de semejanza, +15 % caudal → +50 % potencia, etc.).
- Todas las URL comprobadas con curl (HTTP 200).

## Revisión manual

| # | Id | Pregunta | Veredicto | Nota |
|---:|---|---|---|---|
| 1 | CPEI-T09-OF-96E138CB | Según el RD 709/2015 de equipos a presión, ¿qué se entiende por «fluidos»? | OK |  |
| 2 | CPEI-T09-OF-0E62FDF1 | Según el RD 709/2015 de equipos a presión, ¿respecto a qué se mide la «presión» y cómo se expresa el vacío? | OK |  |
| 3 | CPEI-T09-OF-6E9C710E | Según el RD 2032/2009, ¿cuál es la unidad SI de la densidad (masa en volumen)? | OK |  |
| 4 | CPEI-T09-OF-7FF3307F | Según el RD 2032/2009, ¿cuál es la unidad SI de presión y a qué equivale en otras unidades SI? | OK |  |
| 5 | CPEI-T09-OF-B70EA739 | Según el RD 2032/2009, ¿qué unidad SI corresponde a la viscosidad dinámica? | OK |  |
| 6 | CPEI-T09-OF-30C5C610 | Según el RD 2032/2009, ¿a cuánto equivale 1 bar en unidades SI? | OK |  |
| 7 | CPEI-T09-OF-48B860EC | Según el RD 2032/2009, ¿a cuánto equivale la atmósfera normal en bar y en pascales? | OK |  |
| 8 | CPEI-T09-OF-3909180C | Según el RD 2032/2009, ¿a cuánto equivale un litro y qué símbolo se recomienda para evitar confusiones? | OK |  |
| 9 | CPEI-T09-OF-B76CA198 | Según la guía técnica de bombas del IDAE, ¿qué densidad y qué viscosidad dinámica se toman para el agua a 20 °C? | OK |  |
| 10 | CPEI-T09-OF-E8EFF948 | Según la guía técnica de bombas del IDAE, ¿en qué tres modos se presenta la energía mecánica del flujo en un punto? | OK |  |
| 11 | CPEI-T09-OF-BDF2E465 | Según la guía técnica de bombas del IDAE, ¿cómo se expresa en metros de columna de agua la «altura» de un punto del flujo? | OK |  |
| 12 | CPEI-T09-OF-546D4545 | Según el ejemplo 2.2 de la guía técnica de bombas del IDAE, ¿qué diferencia de presión corresponde a 10 m de columna de agua? | OK | 98.100 = 202.600 − 104.500 Pa = 1.000·9,81·10; comprobado en test |
| 13 | CPEI-T09-OF-3D462C54 | Según la guía técnica del IDAE, ¿cómo se calcula la presión dinámica de un fluido que circula a velocidad v? | OK | Parte II de la guía (ventiladores), relación general válida para cualquier fluido |
| 14 | CPEI-T09-OF-E4B6B464 | Según la guía técnica del IDAE, ¿qué es la presión total de un flujo en un conducto? | OK |  |
| 15 | CPEI-T09-OF-BDE1EE3C | Según la guía técnica del IDAE, en flujo ideal, ¿qué le ocurre a la presión estática cuando aumenta la velocidad del fluido? | OK | se usa solo la conclusión general; el ejemplo numérico de la guía tiene una incoherencia de diámetros |
| 16 | CPEI-T09-OF-303FA8EC | Según la NTP 362 del INSST, ¿cómo se define el caudal volumétrico? | OK |  |
| 17 | CPEI-T09-OF-598D0A9D | Según la NTP 362 del INSST, ¿cómo se define el caudal másico? | OK |  |
| 18 | CPEI-T09-OF-54865783 | Según la NTP 362 del INSST, ¿qué expresión tiene la ecuación de Bernoulli y para qué tipo de flujo es válida? | OK |  |
| 19 | CPEI-T09-OF-23AA9AFC | Según la guía técnica de bombas del IDAE, ¿en qué consiste la hipótesis de flujo ideal? | OK |  |
| 20 | CPEI-T09-OF-5963394C | Según la guía técnica de bombas del IDAE, en flujo ideal por un tubo, ¿qué le pasa a la energía mecánica del fluido entre dos puntos? | OK |  |
| 21 | CPEI-T09-OF-BB7EEB96 | Según la guía técnica de bombas del IDAE, ¿cómo se aplica la ecuación de Bernoulli al flujo real de una instalación? | OK |  |
| 22 | CPEI-T09-OF-0F2FD506 | Según la NTP 362 del INSST, en un recipiente abierto a la atmósfera, ¿qué velocidad teórica de salida tiene un líquido por un orificio situado a una altura h bajo el nivel libre? | OK | v=(2gh)^½ con ph=pa a partir de la expresión general de la NTP |
| 23 | CPEI-T09-OF-D493D3E9 | Según la NTP 362 del INSST, ¿qué expresión da el caudal másico que sale por un orificio de un recipiente a presión atmosférica? | OK |  |
| 24 | CPEI-T09-OF-377EBBDC | Según la NTP 362 del INSST, ¿qué es el coeficiente de descarga Cd de un orificio? | OK |  |
| 25 | CPEI-T09-OF-76FBE0B0 | Según la NTP 362 del INSST, ¿qué coeficiente de descarga aproximado tiene un orificio de borde afilado y cuál una boquilla de borde redondeado? | OK |  |
| 26 | CPEI-T09-OF-0B46FCC3 | Según la NTP 362 del INSST, ¿qué coeficiente de descarga aproximado tiene un tramo muy corto de tubería o una boquilla externa conectados a un recipiente? | OK |  |
| 27 | CPEI-T09-OF-B4A1C5E5 | Según la NTP 362 del INSST, ¿qué distancia horizontal x alcanza un chorro que sale horizontalmente con velocidad v desde una altura y sobre el suelo? | OK |  |
| 28 | CPEI-T09-OF-DC6F3830 | Según la guía técnica de bombas del IDAE, ¿con qué expresión se calculan las pérdidas de carga en tuberías (pérdidas primarias)? | OK |  |
| 29 | CPEI-T09-OF-6B77B7C6 | Según la guía técnica de bombas del IDAE, ¿qué ecuación puede emplearse para el factor de fricción en tuberías lisas? | OK | la ecuación está en las págs. 12-13 impresas; en el texto extraído de la pág. 12 aparece maquetada |
| 30 | CPEI-T09-OF-FD184979 | Según la guía técnica de bombas del IDAE, ¿qué ecuación se emplea habitualmente para el factor de fricción en tuberías rugosas? | OK |  |
| 31 | CPEI-T09-OF-33B3CFC6 | Según la guía técnica de bombas del IDAE, ¿cómo se calcula el número de Reynolds del flujo en un tubo? | OK | Re=ρvD/μ coincide con el número de Reynolds del RD 2032/2009 (Re=ρvl/η) |
| 32 | CPEI-T09-OF-0725F93D | Según la NTP 362 del INSST, ¿para qué valores del número de Reynolds el flujo en tubería es generalmente laminar y para cuáles turbulento? | OK |  |
| 33 | CPEI-T09-OF-3869B3CE | Según la NTP 362 del INSST, ¿cuánto vale el factor de fricción en régimen laminar? | OK |  |
| 34 | CPEI-T09-OF-F2E0ACDA | Según la guía técnica de bombas del IDAE, ¿cómo se calculan las pérdidas de carga en accesorios como codos, tes o reducciones? | OK |  |
| 35 | CPEI-T09-OF-42B59AF3 | Según la guía técnica de bombas del IDAE, ¿qué significa expresar las pérdidas de un accesorio como «longitud equivalente»? | OK |  |
| 36 | CPEI-T09-OF-0890DF9A | Según la guía técnica de bombas del IDAE, en un circuito cerrado, ¿a qué se destina la energía que suministra la bomba? | OK |  |
| 37 | CPEI-T09-OF-75A2DDEF | Según la guía técnica de bombas del IDAE, ¿cómo varía la pérdida de carga de una instalación con el caudal? | OK | HL ∝ Q²: con 2Q, 4HL (comprobado en test) |
| 38 | CPEI-T09-OF-90325772 | Según el CTE DB HS 4, ¿cómo pueden estimarse las pérdidas de carga localizadas de un tramo? | OK |  |
| 39 | CPEI-T09-OF-41460F53 | Según la guía técnica de bombas del IDAE, ¿qué dos partes principales tienen las bombas rotodinámicas o turbomáquinas? | OK |  |
| 40 | CPEI-T09-OF-B0BD161B | Según la guía técnica de bombas del IDAE, ¿qué es la voluta de una bomba centrífuga y cuál es su misión? | OK |  |
| 41 | CPEI-T09-OF-A83C1878 | Según la guía técnica de bombas del IDAE, ¿qué tipos de bombas se citan con aplicación en equipos contra incendios? | OK |  |
| 42 | CPEI-T09-OF-B1A1B860 | Según la guía técnica de bombas del IDAE, ¿cómo se define la altura manométrica Hm que suministra una bomba? | OK |  |
| 43 | CPEI-T09-OF-E07CE23D | Según la guía técnica de bombas del IDAE, ¿qué potencia útil recibe el fluido impulsado por una bomba? | OK |  |
| 44 | CPEI-T09-OF-1F1511D5 | Según la guía técnica de bombas del IDAE, ¿de qué tres rendimientos es producto el rendimiento total de una bomba? | OK |  |
| 45 | CPEI-T09-OF-023CCFB9 | Según la guía técnica de bombas del IDAE, ¿qué rendimiento tiene una bomba centrífuga que trabaja a caudal nulo? | OK |  |
| 46 | CPEI-T09-OF-AAA67B45 | Según el Reglamento (UE) 547/2012, ¿qué es el punto de máximo rendimiento (BEP) de una bomba? | OK |  |
| 47 | CPEI-T09-OF-F56CDA32 | ¿Se aplica el Reglamento (UE) 547/2012 de diseño ecológico a las bombas destinadas únicamente a la lucha contra incendios? | OK |  |
| 48 | CPEI-T09-OF-85B835F0 | Según la guía técnica de bombas del IDAE, ¿qué es la cavitación? | OK |  |
| 49 | CPEI-T09-OF-26003FD5 | Según la guía técnica de bombas del IDAE, ¿qué problemas produce la cavitación en una bomba? | OK |  |
| 50 | CPEI-T09-OF-72891238 | Según la guía técnica de bombas del IDAE, ¿en qué zona de la bomba se presenta la cavitación y de qué depende? | OK |  |
| 51 | CPEI-T09-OF-76DD3666 | Según la guía técnica de bombas del IDAE, ¿qué condición de presión evita la cavitación dentro de la bomba? | OK |  |
| 52 | CPEI-T09-OF-2A9527A7 | Según la tabla 3.1 de la guía técnica de bombas del IDAE, ¿qué presión de vapor tiene el agua a 20 °C? | OK | 2.344,2 Pa / (1.000·9,81) = 0,239 m c.a. (comprobado en test) |
| 53 | CPEI-T09-OF-22662AE4 | Según la guía técnica de bombas del IDAE, ¿cómo se define la altura neta positiva de aspiración (NPSH)? | OK |  |
| 54 | CPEI-T09-OF-978A7EB5 | Según la guía técnica de bombas del IDAE, ¿qué condición entre NPSH disponible y NPSH requerido evita la cavitación? | OK |  |
| 55 | CPEI-T09-OF-EAD133E1 | Según la guía técnica de bombas del IDAE, ¿cómo varía el NPSH requerido de una bomba con el caudal y quién lo facilita? | OK |  |
| 56 | CPEI-T09-OF-F6E7F596 | Según la guía técnica de bombas del IDAE, ¿de qué depende el NPSH disponible? | OK |  |
| 57 | CPEI-T09-OF-BB087623 | Según la guía técnica de bombas del IDAE, ¿qué muestran las curvas características de una bomba centrífuga y cómo se obtienen? | OK |  |
| 58 | CPEI-T09-OF-31998641 | Según la guía técnica de bombas del IDAE, ¿qué cuatro curvas características suele tener una bomba y en qué condiciones se ensayan? | OK |  |
| 59 | CPEI-T09-OF-559221D2 | Según la guía técnica de bombas del IDAE, ¿cómo se determina el punto de funcionamiento de una instalación de bombeo? | OK |  |
| 60 | CPEI-T09-OF-A899A5EA | Según la guía técnica de bombas del IDAE, ¿cuál es el rango admisible de caudal de una bomba respecto a su caudal nominal? | OK |  |
| 61 | CPEI-T09-OF-2EF15657 | Según la guía técnica de bombas del IDAE, ¿cuál es el rango óptimo de caudal de una bomba respecto a su caudal nominal? | OK | la figura 5.4 de la guía rotula por errata «0,5Q*B»; el texto da 85 %-105 % |
| 62 | CPEI-T09-OF-84801374 | Según la guía técnica de bombas del IDAE, ¿qué problema principal aparece si una bomba trabaja con muy poca resistencia hidráulica y caudal muy alto (más de 1,5 veces el nominal)? | OK |  |
| 63 | CPEI-T09-OF-1114F79B | Según la guía técnica de bombas del IDAE, ¿por qué es preferible seleccionar la bomba para un caudal algo inferior al nominal? | OK |  |
| 64 | CPEI-T09-OF-73336BCB | Según la guía técnica de bombas del IDAE, si por una instalación circula un 15 % más de caudal, ¿cuánto aumenta la potencia consumida por la bomba? | OK | 1,15³ = 1,52 ≈ +50 % (comprobado en test) |
| 65 | CPEI-T09-OF-CD08AC5B | Según la guía técnica de bombas del IDAE, si se reduce a la mitad la velocidad de giro de una bomba, ¿qué ocurre con el caudal, la altura y la potencia? | OK | (1/2), (1/2)², (1/2)³ (comprobado en test) |
| 66 | CPEI-T09-OF-748FB16E | Según la guía técnica de bombas del IDAE, ¿cuándo se emplea principalmente el acoplamiento de bombas en serie? | OK |  |
| 67 | CPEI-T09-OF-F43FF55D | Según la guía técnica de bombas del IDAE, ¿cómo se obtiene la curva característica de dos bombas acopladas en serie? | OK |  |
| 68 | CPEI-T09-OF-FA0F7876 | Según la guía técnica de bombas del IDAE, ¿cuándo se acoplan bombas en paralelo? | OK |  |
| 69 | CPEI-T09-OF-74DB3340 | Según la guía técnica de bombas del IDAE, ¿cómo se obtiene la curva característica de dos bombas acopladas en paralelo? | OK |  |
| 70 | CPEI-T09-OF-3C1C8831 | Según la guía técnica de bombas del IDAE, al unir en paralelo dos bombas idénticas, ¿cuál es el punto nominal del conjunto? | OK |  |
| 71 | CPEI-T09-OF-96375034 | Según el CTE DB HS 4, ¿qué elementos tiene un grupo de presión convencional? | OK |  |
| 72 | CPEI-T09-OF-25E9FCD4 | Según el CTE DB HS 4, ¿cómo funciona un grupo de presión de accionamiento regulable o de caudal variable? | OK |  |
| 73 | CPEI-T09-OF-22150C8C | Según la guía técnica de bombas del IDAE, ¿cómo actúa la regulación por estrangulamiento con una válvula en serie y es eficiente? | OK |  |
| 74 | CPEI-T09-OF-CAD9AB49 | Según la guía técnica de bombas del IDAE, ¿por qué no se debe estrangular la tubería de aspiración de una bomba? | OK |  |
| 75 | CPEI-T09-OF-6D9E1818 | Según la guía técnica de bombas del IDAE, ¿qué inconveniente tiene la regulación con válvula en by-pass? | OK |  |
| 76 | CPEI-T09-OF-A6682280 | Según la guía técnica de bombas del IDAE, ¿qué ventajas y límites tiene regular una bomba variando su velocidad de giro? | OK |  |
| 77 | CPEI-T09-OF-20C37F4A | Según el RIPCI, ¿de qué está formado un sistema de abastecimiento de agua contra incendios y qué debe asegurar? | OK |  |
| 78 | CPEI-T09-OF-A520E5DF | Según el RIPCI, ¿para qué se exige una presión mínima de 500 kPa en la boca de salida de los hidrantes no destinados solo al llenado de camiones? | OK | solapa con el mazo del tema 10; enfoque hidráulico (pérdida de carga) |
| 79 | CPEI-T09-OF-87E4530F | Según el RIPCI, ¿en qué unidades de presión y de caudal se expresa el coeficiente de flujo Kv de los hidrantes? | OK |  |
| 80 | CPEI-T09-OF-25A494F2 | Según el RIPCI, ¿qué presión máxima puede haber a la entrada de una BIE de manguera semirrígida o plana y por qué se limita? | OK | solapa parcialmente con temas 10/33; se mantiene por ser dato de presión de instalación |
| 81 | CPEI-T09-OF-B378FA6E | Según el RIPCI, ¿qué presión dinámica mínima debe proporcionar la red en el orificio de salida de una BIE de alta presión? | OK | solapa parcialmente con temas 10/33 |
| 82 | CPEI-T09-OF-B1BF79D7 | Según el CTE DB HS 4, ¿qué presión mínima debe haber en los puntos de consumo? | OK |  |
| 83 | CPEI-T09-OF-52A4DCD7 | Según el CTE DB HS 4, ¿qué presión no debe superarse en ningún punto de consumo? | OK |  |
| 84 | CPEI-T09-OF-D374F81F | Según el CTE DB HS 4, ¿entre qué velocidades de cálculo se dimensionan las tuberías de suministro de agua? | OK |  |

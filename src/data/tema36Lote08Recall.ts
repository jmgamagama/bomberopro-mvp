/** Tema 36 lote 08 recall cards — local subset (55). Self-contained: do not load all 528 tema 36 cards nor the other lotes (lote 01, lote 02, lote 03, lote 04, lote 05, lote 06, lote 07). */

export type Tema36Lote08RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA36_LOTE08_RECALL_META = {
  tema: 36,
  lote: "lote08",
  title: "Tema 36 · Lote 08 — Límites administrativos: Puebla del Maestre → Zarza-Capilla",
  count: 55,
  source: "tema36_fichas.json + tema36_lotes.json",
} as const;

export const TEMA36_LOTE08_RECALL_CARDS: Tema36Lote08RecallCard[] = [
  {
    "id": "CPEI-T36-S03-MUN-06105-LIM",
    "orden": 4500,
    "concepto": "¿Con qué municipios o territorios limita Puebla del Maestre?",
    "respuesta": "Dentro de la provincia de Badajoz: Casas de Reina, Fuente del Arco, Monesterio, Montemolín, Reina, Trasierra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606105; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06106-LIM",
    "orden": 4510,
    "concepto": "¿Con qué municipios o territorios limita Puebla del Prior?",
    "respuesta": "Dentro de la provincia de Badajoz: Hornachos, Ribera del Fresno.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606106; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06902-LIM",
    "orden": 4520,
    "concepto": "¿Con qué municipios o territorios limita Pueblonuevo del Guadiana?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Talavera la Real, Valdelacalzada.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606902; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06109-LIM",
    "orden": 4530,
    "concepto": "¿Con qué municipios o territorios limita Quintana de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Campanario, Castuera, La Haba, Malpartida de la Serena, Valle de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606109; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06110-LIM",
    "orden": 4540,
    "concepto": "¿Con qué municipios o territorios limita Reina?",
    "respuesta": "Dentro de la provincia de Badajoz: Berlanga, Casas de Reina, Fuente del Arco, Puebla del Maestre, Trasierra, Valverde de Llerena. Límite externo: Guadalcanal.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606110; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06111-LIM",
    "orden": 4550,
    "concepto": "¿Con qué municipios o territorios limita Rena?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, Villanueva de la Serena, Villar de Rena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606111; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06112-LIM",
    "orden": 4560,
    "concepto": "¿Con qué municipios o territorios limita Retamal de Llerena?",
    "respuesta": "Dentro de la provincia de Badajoz: Campillo de Llerena, Higuera de la Serena, Hornachos, Oliva de Mérida, Valle de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606112; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06113-LIM",
    "orden": 4570,
    "concepto": "¿Con qué municipios o territorios limita Ribera del Fresno?",
    "respuesta": "Dentro de la provincia de Badajoz: Alange, Hinojosa del Valle, Hornachos, Los Santos de Maimona, Palomas, Puebla de la Reina, Puebla del Prior, Villafranca de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606113; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06114-LIM",
    "orden": 4580,
    "concepto": "¿Con qué municipios o territorios limita Risco?",
    "respuesta": "Dentro de la provincia de Badajoz: Capilla, Garlitos, Peñalsordo, Sancti-Spíritus, Siruela.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606114; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06116-LIM",
    "orden": 4590,
    "concepto": "¿Con qué municipios o territorios limita Salvaleón?",
    "respuesta": "Dentro de la provincia de Badajoz: Almendral, Barcarrota, Jerez de los Caballeros, Nogales, Salvatierra de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606116; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06117-LIM",
    "orden": 4600,
    "concepto": "¿Con qué municipios o territorios limita Salvatierra de los Barros?",
    "respuesta": "Dentro de la provincia de Badajoz: Burguillos del Cerro, Feria, Jerez de los Caballeros, La Parra, Nogales, Salvaleón.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606117; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06119-LIM",
    "orden": 4610,
    "concepto": "¿Con qué municipios o territorios limita San Pedro de Mérida?",
    "respuesta": "Dentro de la provincia de Badajoz: Guareña, Mérida, Valverde de Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606119; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06123-LIM",
    "orden": 4620,
    "concepto": "¿Con qué municipios o territorios limita San Vicente de Alcántara?",
    "respuesta": "Dentro de la provincia de Badajoz: Alburquerque, La Codosera. Límite externo: Herreruela, Salorino, Valencia de Alcántara.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606123; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06118-LIM",
    "orden": 4630,
    "concepto": "¿Con qué municipios o territorios limita Sancti-Spíritus?",
    "respuesta": "Dentro de la provincia de Badajoz: Cabeza del Buey, Esparragosa de Lares, Risco, Siruela.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606118; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06120-LIM",
    "orden": 4640,
    "concepto": "¿Con qué municipios o territorios limita Santa Amalia?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, Guareña, Medellín, Mérida. Límite externo: Almoharín, Arroyomolinos, Miajadas.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606120; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06121-LIM",
    "orden": 4650,
    "concepto": "¿Con qué municipios o territorios limita Santa Marta?",
    "respuesta": "Dentro de la provincia de Badajoz: Corte de Peleas, Entrín Bajo, La Morera, La Parra, Nogales, Villalba de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606121; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06124-LIM",
    "orden": 4660,
    "concepto": "¿Con qué municipios o territorios limita Segura de León?",
    "respuesta": "Dentro de la provincia de Badajoz: Bodonal de la Sierra, Cabeza la Vaca, Fregenal de la Sierra, Fuente de Cantos, Fuentes de León, Valencia del Ventoso.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606124; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06125-LIM",
    "orden": 4670,
    "concepto": "¿Con qué municipios o territorios limita Siruela?",
    "respuesta": "Dentro de la provincia de Badajoz: Baterno, Casas de Don Pedro, Garbayuela, Garlitos, Puebla de Alcocer, Risco, Sancti-Spíritus, Tamurejo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606125; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06126-LIM",
    "orden": 4680,
    "concepto": "¿Con qué municipios o territorios limita Solana de los Barros?",
    "respuesta": "Dentro de la provincia de Badajoz: Aceuchal, Badajoz, Corte de Peleas, Mérida, Villalba de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606126; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06127-LIM",
    "orden": 4690,
    "concepto": "¿Con qué municipios o territorios limita Talarrubias?",
    "respuesta": "Dentro de la provincia de Badajoz: Casas de Don Pedro, Herrera del Duque, Puebla de Alcocer, Valdecaballeros. Límite externo: Cañamero.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606127; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06128-LIM",
    "orden": 4700,
    "concepto": "¿Con qué municipios o territorios limita Talavera la Real?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Lobón, Pueblonuevo del Guadiana, Valdelacalzada.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606128; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06130-LIM",
    "orden": 4710,
    "concepto": "¿Con qué municipios o territorios limita Tamurejo?",
    "respuesta": "Dentro de la provincia de Badajoz: Baterno, Garbayuela, Siruela. Límite externo: Agudo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606130; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06131-LIM",
    "orden": 4720,
    "concepto": "¿Con qué municipios o territorios limita Torre de Miguel Sesmero?",
    "respuesta": "Dentro de la provincia de Badajoz: Almendral, Badajoz, Nogales.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606131; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06132-LIM",
    "orden": 4730,
    "concepto": "¿Con qué municipios o territorios limita Torremayor?",
    "respuesta": "Dentro de la provincia de Badajoz: La Garrovilla, Montijo, Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606132; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06133-LIM",
    "orden": 4740,
    "concepto": "¿Con qué municipios o territorios limita Torremejía?",
    "respuesta": "Dentro de la provincia de Badajoz: Alange, Almendralejo, La Zarza, Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606133; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06134-LIM",
    "orden": 4750,
    "concepto": "¿Con qué municipios o territorios limita Trasierra?",
    "respuesta": "Dentro de la provincia de Badajoz: Casas de Reina, Fuente del Arco, Llerena, Montemolín, Puebla del Maestre, Reina.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606134; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06135-LIM",
    "orden": 4760,
    "concepto": "¿Con qué municipios o territorios limita Trujillanos?",
    "respuesta": "Dentro de la provincia de Badajoz: Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606135; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06129-LIM",
    "orden": 4770,
    "concepto": "¿Con qué municipios o territorios limita Táliga?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconchel, Olivenza.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606129; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06136-LIM",
    "orden": 4780,
    "concepto": "¿Con qué municipios o territorios limita Usagre?",
    "respuesta": "Dentro de la provincia de Badajoz: Bienvenida, Calzadilla de los Barros, Hinojosa del Valle, Llera, Los Santos de Maimona, Puebla de Sancho Pérez, Valencia de las Torres, Villagarcía de la Torre.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606136; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06137-LIM",
    "orden": 4790,
    "concepto": "¿Con qué municipios o territorios limita Valdecaballeros?",
    "respuesta": "Dentro de la provincia de Badajoz: Casas de Don Pedro, Castilblanco, Herrera del Duque, Talarrubias. Límite externo: Alía.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606137; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06901-LIM",
    "orden": 4800,
    "concepto": "¿Con qué municipios o territorios limita Valdelacalzada?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Lobón, Puebla de la Calzada, Pueblonuevo del Guadiana, Talavera la Real.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606901; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06138-LIM",
    "orden": 4810,
    "concepto": "¿Con qué municipios o territorios limita Valdetorres?",
    "respuesta": "Dentro de la provincia de Badajoz: Guareña, Medellín.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606138; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06139-LIM",
    "orden": 4820,
    "concepto": "¿Con qué municipios o territorios limita Valencia de las Torres?",
    "respuesta": "Dentro de la provincia de Badajoz: Campillo de Llerena, Higuera de Llerena, Hornachos, Llera, Maguilla, Usagre, Villagarcía de la Torre.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606139; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06140-LIM",
    "orden": 4830,
    "concepto": "¿Con qué municipios o territorios limita Valencia del Mombuey?",
    "respuesta": "Dentro de la provincia de Badajoz: Oliva de la Frontera, Villanueva del Fresno. Límite externo: Portugal (límite internacional).",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606140; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06141-LIM",
    "orden": 4840,
    "concepto": "¿Con qué municipios o territorios limita Valencia del Ventoso?",
    "respuesta": "Dentro de la provincia de Badajoz: Atalaya, Burguillos del Cerro, Fregenal de la Sierra, Fuente de Cantos, Medina de las Torres, Segura de León, Valverde de Burguillos.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606141; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06146-LIM",
    "orden": 4850,
    "concepto": "¿Con qué municipios o territorios limita Valle de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Campillo de Llerena, Don Benito, Higuera de la Serena, Oliva de Mérida, Quintana de la Serena, Retamal de Llerena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606146; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06147-LIM",
    "orden": 4860,
    "concepto": "¿Con qué municipios o territorios limita Valle de Matamoros?",
    "respuesta": "Dentro de la provincia de Badajoz: Jerez de los Caballeros, Valle de Santa Ana.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606147; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06148-LIM",
    "orden": 4870,
    "concepto": "¿Con qué municipios o territorios limita Valle de Santa Ana?",
    "respuesta": "Dentro de la provincia de Badajoz: Jerez de los Caballeros, Valle de Matamoros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606148; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06142-LIM",
    "orden": 4880,
    "concepto": "¿Con qué municipios o territorios limita Valverde de Burguillos?",
    "respuesta": "Dentro de la provincia de Badajoz: Atalaya, Burguillos del Cerro, Valencia del Ventoso.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606142; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06143-LIM",
    "orden": 4890,
    "concepto": "¿Con qué municipios o territorios limita Valverde de Leganés?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Olivenza.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606143; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06144-LIM",
    "orden": 4900,
    "concepto": "¿Con qué municipios o territorios limita Valverde de Llerena?",
    "respuesta": "Dentro de la provincia de Badajoz: Azuaga, Berlanga, Reina. Límite externo: Guadalcanal.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606144; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06145-LIM",
    "orden": 4910,
    "concepto": "¿Con qué municipios o territorios limita Valverde de Mérida?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Álvaro, Guareña, Mérida, San Pedro de Mérida, Villagonzalo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606145; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06149-LIM",
    "orden": 4920,
    "concepto": "¿Con qué municipios o territorios limita Villafranca de los Barros?",
    "respuesta": "Dentro de la provincia de Badajoz: Alange, Almendralejo, Fuente del Maestre, Los Santos de Maimona, Ribera del Fresno.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606149; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06150-LIM",
    "orden": 4930,
    "concepto": "¿Con qué municipios o territorios limita Villagarcía de la Torre?",
    "respuesta": "Dentro de la provincia de Badajoz: Bienvenida, Higuera de Llerena, Llerena, Usagre, Valencia de las Torres.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606150; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06151-LIM",
    "orden": 4940,
    "concepto": "¿Con qué municipios o territorios limita Villagonzalo?",
    "respuesta": "Dentro de la provincia de Badajoz: Alange, Guareña, La Zarza, Mérida, Oliva de Mérida, Valverde de Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606151; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06152-LIM",
    "orden": 4950,
    "concepto": "¿Con qué municipios o territorios limita Villalba de los Barros?",
    "respuesta": "Dentro de la provincia de Badajoz: Aceuchal, Feria, Fuente del Maestre, La Parra, Santa Marta, Solana de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606152; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06153-LIM",
    "orden": 4960,
    "concepto": "¿Con qué municipios o territorios limita Villanueva de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, La Coronada, La Haba, Magacela, Rena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606153; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06154-LIM",
    "orden": 4970,
    "concepto": "¿Con qué municipios o territorios limita Villanueva del Fresno?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconchel, Higuera de Vargas, Oliva de la Frontera, Valencia del Mombuey, Zahínos. Límite externo: Portugal (límite internacional).",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606154; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06156-LIM",
    "orden": 4980,
    "concepto": "¿Con qué municipios o territorios limita Villar de Rena?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, Rena. Límite externo: Campo Lugar, Miajadas.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606156; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06155-LIM",
    "orden": 4990,
    "concepto": "¿Con qué municipios o territorios limita Villar del Rey?",
    "respuesta": "Dentro de la provincia de Badajoz: Alburquerque, Badajoz.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606155; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06157-LIM",
    "orden": 5000,
    "concepto": "¿Con qué municipios o territorios limita Villarta de los Montes?",
    "respuesta": "Dentro de la provincia de Badajoz: Fuenlabrada de los Montes, Helechosa de los Montes, Herrera del Duque. Límite externo: Arroba de los Montes, Navalpino, Puebla de Don Rodrigo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606157; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06158-LIM",
    "orden": 5010,
    "concepto": "¿Con qué municipios o territorios limita Zafra?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconera, Feria, Fuente del Maestre, La Lapa, Los Santos de Maimona, Medina de las Torres, Puebla de Sancho Pérez.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606158; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06159-LIM",
    "orden": 5020,
    "concepto": "¿Con qué municipios o territorios limita Zahínos?",
    "respuesta": "Dentro de la provincia de Badajoz: Higuera de Vargas, Jerez de los Caballeros, Oliva de la Frontera, Villanueva del Fresno.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606159; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06160-LIM",
    "orden": 5030,
    "concepto": "¿Con qué municipios o territorios limita Zalamea de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Benquerencia de la Serena, Campillo de Llerena, Castuera, Esparragosa de la Serena, Higuera de la Serena, Malpartida de la Serena, Monterrubio de la Serena, Peraleda del Zaucejo, Quintana de la Serena, Retamal de Llerena, Valle de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606160; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06161-LIM",
    "orden": 5040,
    "concepto": "¿Con qué municipios o territorios limita Zarza-Capilla?",
    "respuesta": "Dentro de la provincia de Badajoz: Cabeza del Buey, Capilla, Peñalsordo. Límite externo: El Viso.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606161; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  }
];

/** Tema 36 lote 07 recall cards — local subset (55). Self-contained: do not load all 528 tema 36 cards nor the other lotes (lote 01, lote 02, lote 03, lote 04, lote 05, lote 06, lote 08). */

export type Tema36Lote07RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA36_LOTE07_RECALL_META = {
  tema: 36,
  lote: "lote07",
  title: "Tema 36 · Lote 07 — Límites administrativos: Guadiana → Puebla de Sancho Pérez",
  count: 55,
  source: "tema36_fichas.json + tema36_lotes.json",
} as const;

export const TEMA36_LOTE07_RECALL_CARDS: Tema36Lote07RecallCard[] = [
  {
    "id": "CPEI-T36-S03-MUN-06903-LIM",
    "orden": 3950,
    "concepto": "¿Con qué municipios o territorios limita Guadiana?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606903; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06060-LIM",
    "orden": 3960,
    "concepto": "¿Con qué municipios o territorios limita Guareña?",
    "respuesta": "Dentro de la provincia de Badajoz: Cristina, Don Benito, Manchita, Medellín, Mengabril, Mérida, Oliva de Mérida, San Pedro de Mérida, Santa Amalia, Valdetorres, Valverde de Mérida, Villagonzalo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606060; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06062-LIM",
    "orden": 3970,
    "concepto": "¿Con qué municipios o territorios limita Helechosa de los Montes?",
    "respuesta": "Dentro de la provincia de Badajoz: Herrera del Duque, Villarta de los Montes. Límite externo: Alía, Anchuras, Horcajo de los Montes, Los Navalucillos, Sevilleja de la Jara.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606062; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06063-LIM",
    "orden": 3980,
    "concepto": "¿Con qué municipios o territorios limita Herrera del Duque?",
    "respuesta": "Dentro de la provincia de Badajoz: Castilblanco, Fuenlabrada de los Montes, Helechosa de los Montes, Puebla de Alcocer, Talarrubias, Valdecaballeros, Villarta de los Montes. Límite externo: Alía.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606063; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06064-LIM",
    "orden": 3990,
    "concepto": "¿Con qué municipios o territorios limita Higuera de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Oliva de Mérida, Retamal de Llerena, Valle de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606064; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06065-LIM",
    "orden": 4000,
    "concepto": "¿Con qué municipios o territorios limita Higuera de Llerena?",
    "respuesta": "Dentro de la provincia de Badajoz: Berlanga, Casas de Reina, Llerena, Maguilla, Valencia de las Torres, Villagarcía de la Torre.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606065; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06066-LIM",
    "orden": 4010,
    "concepto": "¿Con qué municipios o territorios limita Higuera de Vargas?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconchel, Barcarrota, Jerez de los Caballeros, Olivenza, Villanueva del Fresno, Zahínos.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606066; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06067-LIM",
    "orden": 4020,
    "concepto": "¿Con qué municipios o territorios limita Higuera la Real?",
    "respuesta": "Dentro de la provincia de Badajoz: Fregenal de la Sierra, Jerez de los Caballeros. Límite externo: Cumbres Mayores, Cumbres de Enmedio, Cumbres de San Bartolomé, Encinasola.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606067; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06068-LIM",
    "orden": 4030,
    "concepto": "¿Con qué municipios o territorios limita Hinojosa del Valle?",
    "respuesta": "Dentro de la provincia de Badajoz: Hornachos, Llera, Los Santos de Maimona, Ribera del Fresno, Usagre.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606068; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06069-LIM",
    "orden": 4040,
    "concepto": "¿Con qué municipios o territorios limita Hornachos?",
    "respuesta": "Dentro de la provincia de Badajoz: Campillo de Llerena, Hinojosa del Valle, Llera, Puebla de la Reina, Puebla del Prior, Retamal de Llerena, Ribera del Fresno, Valencia de las Torres.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606069; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06070-LIM",
    "orden": 4050,
    "concepto": "¿Con qué municipios o territorios limita Jerez de los Caballeros?",
    "respuesta": "Dentro de la provincia de Badajoz: Barcarrota, Burguillos del Cerro, Fregenal de la Sierra, Higuera de Vargas, Higuera la Real, Oliva de la Frontera, Salvaleón, Salvatierra de los Barros, Valle de Matamoros, Valle de Santa Ana, Zahínos. Límite externo: Encinasola.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606070; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06005-LIM",
    "orden": 4060,
    "concepto": "¿Con qué municipios o territorios limita La Albuera?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606005; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06037-LIM",
    "orden": 4070,
    "concepto": "¿Con qué municipios o territorios limita La Codosera?",
    "respuesta": "Dentro de la provincia de Badajoz: Alburquerque, San Vicente de Alcántara. Límite externo: Portugal (límite internacional), Valencia de Alcántara.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606037; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06039-LIM",
    "orden": 4080,
    "concepto": "¿Con qué municipios o territorios limita La Coronada?",
    "respuesta": "Dentro de la provincia de Badajoz: Campanario, Don Benito, Magacela, Orellana la Vieja, Villanueva de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606039; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06058-LIM",
    "orden": 4090,
    "concepto": "¿Con qué municipios o territorios limita La Garrovilla?",
    "respuesta": "Dentro de la provincia de Badajoz: Esparragalejo, Montijo, Mérida, Torremayor.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606058; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06061-LIM",
    "orden": 4100,
    "concepto": "¿Con qué municipios o territorios limita La Haba?",
    "respuesta": "Dentro de la provincia de Badajoz: Campanario, Don Benito, Magacela, Quintana de la Serena, Villanueva de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606061; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06071-LIM",
    "orden": 4110,
    "concepto": "¿Con qué municipios o territorios limita La Lapa?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconera, Burguillos del Cerro, Feria, Zafra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606071; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06089-LIM",
    "orden": 4120,
    "concepto": "¿Con qué municipios o territorios limita La Morera?",
    "respuesta": "Dentro de la provincia de Badajoz: La Parra, Nogales, Santa Marta.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606089; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06090-LIM",
    "orden": 4130,
    "concepto": "¿Con qué municipios o territorios limita La Nava de Santiago?",
    "respuesta": "Dentro de la provincia de Badajoz: Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606090; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06099-LIM",
    "orden": 4140,
    "concepto": "¿Con qué municipios o territorios limita La Parra?",
    "respuesta": "Dentro de la provincia de Badajoz: Feria, La Morera, Nogales, Salvatierra de los Barros, Santa Marta, Villalba de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606099; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06115-LIM",
    "orden": 4150,
    "concepto": "¿Con qué municipios o territorios limita La Roca de la Sierra?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606115; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06162-LIM",
    "orden": 4160,
    "concepto": "¿Con qué municipios o territorios limita La Zarza?",
    "respuesta": "Dentro de la provincia de Badajoz: Alange, Almendralejo, Don Álvaro, Mérida, Oliva de Mérida, Torremejía, Villagonzalo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606162; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06073-LIM",
    "orden": 4170,
    "concepto": "¿Con qué municipios o territorios limita Llera?",
    "respuesta": "Dentro de la provincia de Badajoz: Hinojosa del Valle, Hornachos, Usagre, Valencia de las Torres.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606073; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06074-LIM",
    "orden": 4180,
    "concepto": "¿Con qué municipios o territorios limita Llerena?",
    "respuesta": "Dentro de la provincia de Badajoz: Bienvenida, Casas de Reina, Fuente de Cantos, Higuera de Llerena, Montemolín, Trasierra, Villagarcía de la Torre.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606074; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06072-LIM",
    "orden": 4190,
    "concepto": "¿Con qué municipios o territorios limita Lobón?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Montijo, Mérida, Puebla de la Calzada, Talavera la Real, Valdelacalzada.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606072; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06122-LIM",
    "orden": 4200,
    "concepto": "¿Con qué municipios o territorios limita Los Santos de Maimona?",
    "respuesta": "Dentro de la provincia de Badajoz: Fuente del Maestre, Hinojosa del Valle, Puebla de Sancho Pérez, Ribera del Fresno, Usagre, Villafranca de los Barros, Zafra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606122; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06075-LIM",
    "orden": 4210,
    "concepto": "¿Con qué municipios o territorios limita Magacela?",
    "respuesta": "Dentro de la provincia de Badajoz: Campanario, La Coronada, La Haba, Villanueva de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606075; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06076-LIM",
    "orden": 4220,
    "concepto": "¿Con qué municipios o territorios limita Maguilla?",
    "respuesta": "Dentro de la provincia de Badajoz: Azuaga, Berlanga, Campillo de Llerena, Higuera de Llerena, Valencia de las Torres.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606076; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06077-LIM",
    "orden": 4230,
    "concepto": "¿Con qué municipios o territorios limita Malcocinado?",
    "respuesta": "Dentro de la provincia de Badajoz: Azuaga. Límite externo: Alanís, Guadalcanal.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606077; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06078-LIM",
    "orden": 4240,
    "concepto": "¿Con qué municipios o territorios limita Malpartida de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Castuera, Esparragosa de la Serena, Quintana de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606078; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06079-LIM",
    "orden": 4250,
    "concepto": "¿Con qué municipios o territorios limita Manchita?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, Guareña, Oliva de Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606079; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06080-LIM",
    "orden": 4260,
    "concepto": "¿Con qué municipios o territorios limita Medellín?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, Guareña, Mengabril, Santa Amalia, Valdetorres.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606080; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06081-LIM",
    "orden": 4270,
    "concepto": "¿Con qué municipios o territorios limita Medina de las Torres?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconera, Atalaya, Calzadilla de los Barros, Fuente de Cantos, Puebla de Sancho Pérez, Valencia del Ventoso, Zafra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606081; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06082-LIM",
    "orden": 4280,
    "concepto": "¿Con qué municipios o territorios limita Mengabril?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, Guareña, Medellín.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606082; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06084-LIM",
    "orden": 4290,
    "concepto": "¿Con qué municipios o territorios limita Mirandilla?",
    "respuesta": "Dentro de la provincia de Badajoz: Aljucén, El Carrascalejo, Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606084; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06085-LIM",
    "orden": 4300,
    "concepto": "¿Con qué municipios o territorios limita Monesterio?",
    "respuesta": "Dentro de la provincia de Badajoz: Calera de León, Casas de Reina, Fuente de Cantos, Fuente del Arco, Montemolín, Puebla del Maestre. Límite externo: Cala, El Real de la Jara, Santa Olalla del Cala.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606085; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06086-LIM",
    "orden": 4310,
    "concepto": "¿Con qué municipios o territorios limita Montemolín?",
    "respuesta": "Dentro de la provincia de Badajoz: Casas de Reina, Fuente de Cantos, Llerena, Monesterio, Puebla del Maestre, Trasierra. Límite externo: El Real de la Jara.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606086; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06087-LIM",
    "orden": 4320,
    "concepto": "¿Con qué municipios o territorios limita Monterrubio de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Benquerencia de la Serena, Cabeza del Buey, Castuera, Esparragosa de Lares, Peraleda del Zaucejo, Zalamea de la Serena. Límite externo: Belalcázar, Hinojosa del Duque, Los Blázquez, Valsequillo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606087; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06088-LIM",
    "orden": 4330,
    "concepto": "¿Con qué municipios o territorios limita Montijo?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, La Garrovilla, Lobón, Mérida, Puebla de la Calzada, Torremayor.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606088; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06083-LIM",
    "orden": 4340,
    "concepto": "¿Con qué municipios o territorios limita Mérida?",
    "respuesta": "Dentro de la provincia de Badajoz: Aljucén, Almendralejo, Arroyo de San Serván, Badajoz, Calamonte, Carmonita, Cordobilla de Lácara, Don Álvaro, El Carrascalejo, Esparragalejo, Guareña, La Garrovilla, La Nava de Santiago, La Roca de la Sierra, La Zarza, Lobón, Mirandilla, Montijo, San Pedro de Mérida, Santa Amalia, Solana de los Barros, Torremayor, Torremejía, Trujillanos, Valverde de Mérida, Villagonzalo. Límite externo: Alcuéscar, Arroyomolinos, Cáceres, Montánchez.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606083; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06091-LIM",
    "orden": 4350,
    "concepto": "¿Con qué municipios o territorios limita Navalvillar de Pela?",
    "respuesta": "Dentro de la provincia de Badajoz: Acedera, Esparragosa de Lares, Orellana de la Sierra, Orellana la Vieja, Puebla de Alcocer. Límite externo: Logrosán, Madrigalejo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606091; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06092-LIM",
    "orden": 4360,
    "concepto": "¿Con qué municipios o territorios limita Nogales?",
    "respuesta": "Dentro de la provincia de Badajoz: Almendral, Badajoz, Entrín Bajo, La Morera, La Parra, Salvaleón, Salvatierra de los Barros, Santa Marta, Torre de Miguel Sesmero.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606092; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06093-LIM",
    "orden": 4370,
    "concepto": "¿Con qué municipios o territorios limita Oliva de la Frontera?",
    "respuesta": "Dentro de la provincia de Badajoz: Jerez de los Caballeros, Valencia del Mombuey, Villanueva del Fresno, Zahínos. Límite externo: Encinasola, Portugal (límite internacional).",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606093; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06094-LIM",
    "orden": 4380,
    "concepto": "¿Con qué municipios o territorios limita Oliva de Mérida?",
    "respuesta": "Dentro de la provincia de Badajoz: Alange, Cristina, Don Benito, Guareña, Higuera de la Serena, La Zarza, Manchita, Palomas, Puebla de la Reina, Retamal de Llerena, Valle de la Serena, Villagonzalo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606094; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06095-LIM",
    "orden": 4390,
    "concepto": "¿Con qué municipios o territorios limita Olivenza?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconchel, Badajoz, Barcarrota, Higuera de Vargas, Táliga, Valverde de Leganés. Límite externo: Portugal (límite internacional).",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606095; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06096-LIM",
    "orden": 4400,
    "concepto": "¿Con qué municipios o territorios limita Orellana de la Sierra?",
    "respuesta": "Dentro de la provincia de Badajoz: Campanario, Esparragosa de Lares, Navalvillar de Pela, Orellana la Vieja.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606096; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06097-LIM",
    "orden": 4410,
    "concepto": "¿Con qué municipios o territorios limita Orellana la Vieja?",
    "respuesta": "Dentro de la provincia de Badajoz: Acedera, Campanario, Don Benito, La Coronada, Navalvillar de Pela, Orellana de la Sierra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606097; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06098-LIM",
    "orden": 4420,
    "concepto": "¿Con qué municipios o territorios limita Palomas?",
    "respuesta": "Dentro de la provincia de Badajoz: Alange, Oliva de Mérida, Puebla de la Reina, Ribera del Fresno.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606098; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06101-LIM",
    "orden": 4430,
    "concepto": "¿Con qué municipios o territorios limita Peraleda del Zaucejo?",
    "respuesta": "Dentro de la provincia de Badajoz: Azuaga, Campillo de Llerena, Granja de Torrehermosa, Monterrubio de la Serena, Zalamea de la Serena. Límite externo: Fuente Obejuna, Los Blázquez.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606101; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06100-LIM",
    "orden": 4440,
    "concepto": "¿Con qué municipios o territorios limita Peñalsordo?",
    "respuesta": "Dentro de la provincia de Badajoz: Cabeza del Buey, Capilla, Risco, Zarza-Capilla.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606100; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06102-LIM",
    "orden": 4450,
    "concepto": "¿Con qué municipios o territorios limita Puebla de Alcocer?",
    "respuesta": "Dentro de la provincia de Badajoz: Casas de Don Pedro, Esparragosa de Lares, Fuenlabrada de los Montes, Garbayuela, Herrera del Duque, Navalvillar de Pela, Siruela, Talarrubias. Límite externo: Logrosán.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606102; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06103-LIM",
    "orden": 4460,
    "concepto": "¿Con qué municipios o territorios limita Puebla de la Calzada?",
    "respuesta": "Dentro de la provincia de Badajoz: Lobón, Montijo, Valdelacalzada.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606103; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06104-LIM",
    "orden": 4470,
    "concepto": "¿Con qué municipios o territorios limita Puebla de la Reina?",
    "respuesta": "Dentro de la provincia de Badajoz: Hornachos, Oliva de Mérida, Palomas, Ribera del Fresno.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606104; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06107-LIM",
    "orden": 4480,
    "concepto": "¿Con qué municipios o territorios limita Puebla de Obando?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz. Límite externo: Cáceres.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606107; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06108-LIM",
    "orden": 4490,
    "concepto": "¿Con qué municipios o territorios limita Puebla de Sancho Pérez?",
    "respuesta": "Dentro de la provincia de Badajoz: Los Santos de Maimona, Medina de las Torres, Usagre, Zafra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606108; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  }
];

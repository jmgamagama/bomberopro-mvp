/** Tema 36 lote 06 recall cards — local subset (55). Self-contained: do not load all 528 tema 36 cards nor the other lotes (lote 01, lote 02, lote 03, lote 04, lote 05, lote 07, lote 08). */

export type Tema36Lote06RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA36_LOTE06_RECALL_META = {
  tema: 36,
  lote: "lote06",
  title: "Tema 36 · Lote 06 — Límites administrativos: Acedera → Granja de Torrehermosa",
  count: 55,
  source: "tema36_fichas.json + tema36_lotes.json",
} as const;

export const TEMA36_LOTE06_RECALL_CARDS: Tema36Lote06RecallCard[] = [
  {
    "id": "CPEI-T36-S03-MUN-06001-LIM",
    "orden": 3400,
    "concepto": "¿Con qué municipios o territorios limita Acedera?",
    "respuesta": "Dentro de la provincia de Badajoz: Don Benito, Navalvillar de Pela, Orellana la Vieja. Límite externo: Madrigalejo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606001; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06002-LIM",
    "orden": 3410,
    "concepto": "¿Con qué municipios o territorios limita Aceuchal?",
    "respuesta": "Dentro de la provincia de Badajoz: Almendralejo, Fuente del Maestre, Solana de los Barros, Villalba de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606002; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06003-LIM",
    "orden": 3420,
    "concepto": "¿Con qué municipios o territorios limita Ahillones?",
    "respuesta": "Dentro de la provincia de Badajoz: Berlanga, Casas de Reina.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606003; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06004-LIM",
    "orden": 3430,
    "concepto": "¿Con qué municipios o territorios limita Alange?",
    "respuesta": "Dentro de la provincia de Badajoz: Almendralejo, La Zarza, Oliva de Mérida, Palomas, Ribera del Fresno, Torremejía, Villafranca de los Barros, Villagonzalo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606004; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06006-LIM",
    "orden": 3440,
    "concepto": "¿Con qué municipios o territorios limita Alburquerque?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, La Codosera, San Vicente de Alcántara, Villar del Rey. Límite externo: Cáceres, Herreruela, Portugal (límite internacional), Valencia de Alcántara.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606006; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06007-LIM",
    "orden": 3450,
    "concepto": "¿Con qué municipios o territorios limita Alconchel?",
    "respuesta": "Dentro de la provincia de Badajoz: Cheles, Higuera de Vargas, Olivenza, Táliga, Villanueva del Fresno. Límite externo: Portugal (límite internacional).",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606007; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06008-LIM",
    "orden": 3460,
    "concepto": "¿Con qué municipios o territorios limita Alconera?",
    "respuesta": "Dentro de la provincia de Badajoz: Atalaya, Burguillos del Cerro, La Lapa, Medina de las Torres, Zafra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606008; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06009-LIM",
    "orden": 3470,
    "concepto": "¿Con qué municipios o territorios limita Aljucén?",
    "respuesta": "Dentro de la provincia de Badajoz: El Carrascalejo, Mirandilla, Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606009; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06010-LIM",
    "orden": 3480,
    "concepto": "¿Con qué municipios o territorios limita Almendral?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Barcarrota, Nogales, Salvaleón, Torre de Miguel Sesmero.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606010; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06011-LIM",
    "orden": 3490,
    "concepto": "¿Con qué municipios o territorios limita Almendralejo?",
    "respuesta": "Dentro de la provincia de Badajoz: Aceuchal, Alange, Fuente del Maestre, La Zarza, Mérida, Torremejía, Villafranca de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606011; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06012-LIM",
    "orden": 3500,
    "concepto": "¿Con qué municipios o territorios limita Arroyo de San Serván?",
    "respuesta": "Dentro de la provincia de Badajoz: Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606012; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06013-LIM",
    "orden": 3510,
    "concepto": "¿Con qué municipios o territorios limita Atalaya?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconera, Burguillos del Cerro, Medina de las Torres, Valencia del Ventoso, Valverde de Burguillos.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606013; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06014-LIM",
    "orden": 3520,
    "concepto": "¿Con qué municipios o territorios limita Azuaga?",
    "respuesta": "Dentro de la provincia de Badajoz: Berlanga, Campillo de Llerena, Granja de Torrehermosa, Maguilla, Malcocinado, Peraleda del Zaucejo, Valverde de Llerena. Límite externo: Alanís, Fuente Obejuna, Guadalcanal, Hornachuelos.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606014; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06015-LIM",
    "orden": 3530,
    "concepto": "¿Con qué municipios o territorios limita Badajoz?",
    "respuesta": "Dentro de la provincia de Badajoz: Alburquerque, Almendral, Barcarrota, Corte de Peleas, Entrín Bajo, Guadiana, La Albuera, La Roca de la Sierra, Lobón, Montijo, Mérida, Nogales, Olivenza, Puebla de Obando, Pueblonuevo del Guadiana, Solana de los Barros, Talavera la Real, Torre de Miguel Sesmero, Valdelacalzada, Valverde de Leganés, Villar del Rey. Límite externo: Cáceres, Portugal (límite internacional).",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606015; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06016-LIM",
    "orden": 3540,
    "concepto": "¿Con qué municipios o territorios limita Barcarrota?",
    "respuesta": "Dentro de la provincia de Badajoz: Almendral, Badajoz, Higuera de Vargas, Jerez de los Caballeros, Olivenza, Salvaleón.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606016; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06017-LIM",
    "orden": 3550,
    "concepto": "¿Con qué municipios o territorios limita Baterno?",
    "respuesta": "Dentro de la provincia de Badajoz: Garlitos, Siruela, Tamurejo. Límite externo: Agudo, Chillón, Valdemanco del Esteras.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606017; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06018-LIM",
    "orden": 3560,
    "concepto": "¿Con qué municipios o territorios limita Benquerencia de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Cabeza del Buey, Castuera, Monterrubio de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606018; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06019-LIM",
    "orden": 3570,
    "concepto": "¿Con qué municipios o territorios limita Berlanga?",
    "respuesta": "Dentro de la provincia de Badajoz: Ahillones, Azuaga, Casas de Reina, Higuera de Llerena, Maguilla, Reina, Valverde de Llerena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606019; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06020-LIM",
    "orden": 3580,
    "concepto": "¿Con qué municipios o territorios limita Bienvenida?",
    "respuesta": "Dentro de la provincia de Badajoz: Calzadilla de los Barros, Fuente de Cantos, Llerena, Usagre, Villagarcía de la Torre.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606020; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06021-LIM",
    "orden": 3590,
    "concepto": "¿Con qué municipios o territorios limita Bodonal de la Sierra?",
    "respuesta": "Dentro de la provincia de Badajoz: Fregenal de la Sierra, Fuentes de León, Segura de León.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606021; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06022-LIM",
    "orden": 3600,
    "concepto": "¿Con qué municipios o territorios limita Burguillos del Cerro?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconera, Atalaya, Feria, Fregenal de la Sierra, Jerez de los Caballeros, La Lapa, Salvatierra de los Barros, Valencia del Ventoso, Valverde de Burguillos.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606022; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06023-LIM",
    "orden": 3610,
    "concepto": "¿Con qué municipios o territorios limita Cabeza del Buey?",
    "respuesta": "Dentro de la provincia de Badajoz: Benquerencia de la Serena, Castuera, Esparragosa de Lares, Monterrubio de la Serena, Peñalsordo, Sancti-Spíritus, Zarza-Capilla. Límite externo: Belalcázar, El Viso.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606023; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06024-LIM",
    "orden": 3620,
    "concepto": "¿Con qué municipios o territorios limita Cabeza la Vaca?",
    "respuesta": "Dentro de la provincia de Badajoz: Calera de León, Fuente de Cantos, Fuentes de León, Segura de León. Límite externo: Arroyomolinos de León.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606024; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06025-LIM",
    "orden": 3630,
    "concepto": "¿Con qué municipios o territorios limita Calamonte?",
    "respuesta": "Dentro de la provincia de Badajoz: Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606025; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06026-LIM",
    "orden": 3640,
    "concepto": "¿Con qué municipios o territorios limita Calera de León?",
    "respuesta": "Dentro de la provincia de Badajoz: Cabeza la Vaca, Fuente de Cantos, Monesterio. Límite externo: Arroyomolinos de León, Cala.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606026; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06027-LIM",
    "orden": 3650,
    "concepto": "¿Con qué municipios o territorios limita Calzadilla de los Barros?",
    "respuesta": "Dentro de la provincia de Badajoz: Bienvenida, Fuente de Cantos, Medina de las Torres, Usagre.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606027; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06028-LIM",
    "orden": 3660,
    "concepto": "¿Con qué municipios o territorios limita Campanario?",
    "respuesta": "Dentro de la provincia de Badajoz: Castuera, Esparragosa de Lares, La Coronada, La Haba, Magacela, Orellana de la Sierra, Orellana la Vieja, Quintana de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606028; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06029-LIM",
    "orden": 3670,
    "concepto": "¿Con qué municipios o territorios limita Campillo de Llerena?",
    "respuesta": "Dentro de la provincia de Badajoz: Azuaga, Hornachos, Maguilla, Peraleda del Zaucejo, Retamal de Llerena, Valencia de las Torres, Valle de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606029; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06030-LIM",
    "orden": 3680,
    "concepto": "¿Con qué municipios o territorios limita Capilla?",
    "respuesta": "Dentro de la provincia de Badajoz: Garlitos, Peñalsordo, Risco, Zarza-Capilla. Límite externo: Chillón, El Viso, Guadalmez.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606030; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06031-LIM",
    "orden": 3690,
    "concepto": "¿Con qué municipios o territorios limita Carmonita?",
    "respuesta": "Dentro de la provincia de Badajoz: Cordobilla de Lácara, Mérida. Límite externo: Cáceres, Montánchez.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606031; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06033-LIM",
    "orden": 3700,
    "concepto": "¿Con qué municipios o territorios limita Casas de Don Pedro?",
    "respuesta": "Dentro de la provincia de Badajoz: Puebla de Alcocer, Siruela, Talarrubias, Valdecaballeros. Límite externo: Cañamero, Logrosán.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606033; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06034-LIM",
    "orden": 3710,
    "concepto": "¿Con qué municipios o territorios limita Casas de Reina?",
    "respuesta": "Dentro de la provincia de Badajoz: Ahillones, Berlanga, Fuente del Arco, Higuera de Llerena, Llerena, Monesterio, Montemolín, Puebla del Maestre, Reina, Trasierra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606034; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06035-LIM",
    "orden": 3720,
    "concepto": "¿Con qué municipios o territorios limita Castilblanco?",
    "respuesta": "Dentro de la provincia de Badajoz: Herrera del Duque, Valdecaballeros. Límite externo: Alía.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606035; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06036-LIM",
    "orden": 3730,
    "concepto": "¿Con qué municipios o territorios limita Castuera?",
    "respuesta": "Dentro de la provincia de Badajoz: Benquerencia de la Serena, Cabeza del Buey, Campanario, Esparragosa de Lares, Esparragosa de la Serena, Malpartida de la Serena, Monterrubio de la Serena, Quintana de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606036; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06042-LIM",
    "orden": 3740,
    "concepto": "¿Con qué municipios o territorios limita Cheles?",
    "respuesta": "Dentro de la provincia de Badajoz: Alconchel. Límite externo: Portugal (límite internacional).",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606042; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06038-LIM",
    "orden": 3750,
    "concepto": "¿Con qué municipios o territorios limita Cordobilla de Lácara?",
    "respuesta": "Dentro de la provincia de Badajoz: Carmonita, Mérida. Límite externo: Cáceres.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606038; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06040-LIM",
    "orden": 3760,
    "concepto": "¿Con qué municipios o territorios limita Corte de Peleas?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Entrín Bajo, Santa Marta, Solana de los Barros.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606040; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06041-LIM",
    "orden": 3770,
    "concepto": "¿Con qué municipios o territorios limita Cristina?",
    "respuesta": "Dentro de la provincia de Badajoz: Guareña, Oliva de Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606041; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06044-LIM",
    "orden": 3780,
    "concepto": "¿Con qué municipios o territorios limita Don Benito?",
    "respuesta": "Dentro de la provincia de Badajoz: Acedera, Guareña, La Coronada, La Haba, Manchita, Medellín, Mengabril, Oliva de Mérida, Orellana la Vieja, Rena, Santa Amalia, Valle de la Serena, Villanueva de la Serena, Villar de Rena. Límite externo: Almoharín, Campo Lugar, Madrigalejo, Miajadas.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606044; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06043-LIM",
    "orden": 3790,
    "concepto": "¿Con qué municipios o territorios limita Don Álvaro?",
    "respuesta": "Dentro de la provincia de Badajoz: La Zarza, Mérida, Valverde de Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606043; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06032-LIM",
    "orden": 3800,
    "concepto": "¿Con qué municipios o territorios limita El Carrascalejo?",
    "respuesta": "Dentro de la provincia de Badajoz: Aljucén, Mirandilla, Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606032; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06045-LIM",
    "orden": 3810,
    "concepto": "¿Con qué municipios o territorios limita Entrín Bajo?",
    "respuesta": "Dentro de la provincia de Badajoz: Badajoz, Corte de Peleas, Nogales, Santa Marta.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606045; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06046-LIM",
    "orden": 3820,
    "concepto": "¿Con qué municipios o territorios limita Esparragalejo?",
    "respuesta": "Dentro de la provincia de Badajoz: La Garrovilla, Mérida.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606046; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06047-LIM",
    "orden": 3830,
    "concepto": "¿Con qué municipios o territorios limita Esparragosa de la Serena?",
    "respuesta": "Dentro de la provincia de Badajoz: Castuera, Malpartida de la Serena, Zalamea de la Serena.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606047; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06048-LIM",
    "orden": 3840,
    "concepto": "¿Con qué municipios o territorios limita Esparragosa de Lares?",
    "respuesta": "Dentro de la provincia de Badajoz: Cabeza del Buey, Campanario, Castuera, Monterrubio de la Serena, Navalvillar de Pela, Orellana de la Sierra, Puebla de Alcocer, Sancti-Spíritus.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606048; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06049-LIM",
    "orden": 3850,
    "concepto": "¿Con qué municipios o territorios limita Feria?",
    "respuesta": "Dentro de la provincia de Badajoz: Burguillos del Cerro, Fuente del Maestre, La Lapa, La Parra, Salvatierra de los Barros, Villalba de los Barros, Zafra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606049; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06050-LIM",
    "orden": 3860,
    "concepto": "¿Con qué municipios o territorios limita Fregenal de la Sierra?",
    "respuesta": "Dentro de la provincia de Badajoz: Bodonal de la Sierra, Burguillos del Cerro, Fuentes de León, Higuera la Real, Jerez de los Caballeros, Segura de León, Valencia del Ventoso. Límite externo: Cumbres Mayores.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606050; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06051-LIM",
    "orden": 3870,
    "concepto": "¿Con qué municipios o territorios limita Fuenlabrada de los Montes?",
    "respuesta": "Dentro de la provincia de Badajoz: Garbayuela, Herrera del Duque, Puebla de Alcocer, Villarta de los Montes. Límite externo: Agudo, Puebla de Don Rodrigo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606051; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06052-LIM",
    "orden": 3880,
    "concepto": "¿Con qué municipios o territorios limita Fuente de Cantos?",
    "respuesta": "Dentro de la provincia de Badajoz: Bienvenida, Cabeza la Vaca, Calera de León, Calzadilla de los Barros, Llerena, Medina de las Torres, Monesterio, Montemolín, Segura de León, Valencia del Ventoso.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606052; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06053-LIM",
    "orden": 3890,
    "concepto": "¿Con qué municipios o territorios limita Fuente del Arco?",
    "respuesta": "Dentro de la provincia de Badajoz: Casas de Reina, Monesterio, Puebla del Maestre, Reina, Trasierra. Límite externo: Cazalla de la Sierra, Guadalcanal.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606053; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06054-LIM",
    "orden": 3900,
    "concepto": "¿Con qué municipios o territorios limita Fuente del Maestre?",
    "respuesta": "Dentro de la provincia de Badajoz: Aceuchal, Almendralejo, Feria, Los Santos de Maimona, Villafranca de los Barros, Villalba de los Barros, Zafra.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606054; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06055-LIM",
    "orden": 3910,
    "concepto": "¿Con qué municipios o territorios limita Fuentes de León?",
    "respuesta": "Dentro de la provincia de Badajoz: Bodonal de la Sierra, Cabeza la Vaca, Fregenal de la Sierra, Segura de León. Límite externo: Arroyomolinos de León, Cañaveral de León, Cumbres Mayores, Hinojales.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606055; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06056-LIM",
    "orden": 3920,
    "concepto": "¿Con qué municipios o territorios limita Garbayuela?",
    "respuesta": "Dentro de la provincia de Badajoz: Fuenlabrada de los Montes, Puebla de Alcocer, Siruela, Tamurejo. Límite externo: Agudo.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606056; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06057-LIM",
    "orden": 3930,
    "concepto": "¿Con qué municipios o territorios limita Garlitos?",
    "respuesta": "Dentro de la provincia de Badajoz: Baterno, Capilla, Risco, Siruela. Límite externo: Chillón.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606057; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  },
  {
    "id": "CPEI-T36-S03-MUN-06059-LIM",
    "orden": 3940,
    "concepto": "¿Con qué municipios o territorios limita Granja de Torrehermosa?",
    "respuesta": "Dentro de la provincia de Badajoz: Azuaga, Peraleda del Zaucejo. Límite externo: Fuente Obejuna.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 34110606059; relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites administrativos"
  }
];

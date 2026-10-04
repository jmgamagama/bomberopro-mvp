/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// ⚠️ RAMA DE VISTA PREVIA `claude/preview-staging` — NO FUSIONAR.
// Conexión FIJA al proyecto de pruebas `bomberopro-staging` (fxhvgvehhekqeqpkxtrm), con datos
// inventados. Se ignoran a propósito las variables de entorno de Vercel para que esta vista
// previa no pueda conectarse a producción aunque Vercel tenga sus claves configuradas.
// La clave es la publicable (pública por diseño) del proyecto de staging.
export const IS_STAGING_PREVIEW = true;
const supabaseUrl = 'https://fxhvgvehhekqeqpkxtrm.supabase.co';
const supabaseAnonKey = 'sb_publishable_7TL45YVjOt62YqwYCCM0aw_sPUaGw8b';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return supabase !== null;
};

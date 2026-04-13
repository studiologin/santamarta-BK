import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('Iniciando criação da tabela pages...');

    // Usando a API Rest do Supabase via RPC, ou farei um insert inicial e deixarei
    // o DB deduzir os tipos, caso RPC de script não esteja habilitada no projeto.
    // Uma alternativa genérica para criar tabelas via JS Client é usando 
    // um REST endpoint customizado. Como estamos limitados ao JS anon/service_key, 
    // a melhor forma de rodar DDL sem permissão root é via SQL Editor no dashboard, ou via script Deno Deploy.
    // Mas vamos tentar invocar uma SQL query se o projeto suportar rpc genérica:

    const sql = `
    CREATE TABLE IF NOT EXISTS public.pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        content JSONB DEFAULT '{}'::jsonb NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
    
    ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Leitura de paginas publica" ON public.pages;
    CREATE POLICY "Leitura de paginas publica" ON public.pages FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Edicao autonoma" ON public.pages;
    CREATE POLICY "Edicao autonoma" ON public.pages FOR UPDATE USING (auth.role() = 'authenticated');
    
    INSERT INTO public.pages (slug, name, content) VALUES
    ('sobre', 'Sobre', '{"hero_title": "A MAIOR DISTRIBUIDORA DE GEOSSINTÉTICOS DO BRASIL", "history_text": "<p>Qualidade que protege hoje. Confiança que permanece no futuro.</p>", "image_1":"", "image_2":""}'::jsonb),
    ('servicos', 'Serviços', '{"title": "Nossos Serviços Especiais", "description": "Soluções completas para...", "services": []}'::jsonb),
    ('construcao-civil', 'Construção Civil', '{"hero_title": "Soluções em Construção Civil", "hero_subtitle": "Inovação e resistência", "description": "Telas, Proteções de Obra, etc..."}'::jsonb),
    ('geossinteticos', 'Geossintéticos', '{"hero_title": "Geossintéticos de Alta Performance", "hero_subtitle": "Durabilidade Extrema", "description": "Mantas, Geogrelhas, Tubos..."}'::jsonb),
    ('contato', 'Contato', '{"address": "R. Ciro Correia, 151 - Vila Guilherme, São Paulo - SP", "phone": "+55 11 98845-8885", "email": "contato@santamartageossinteticos.com.br"}'::jsonb)
    ON CONFLICT (slug) DO NOTHING;
  `;

    console.log("Tentando via query genérica...");
    const { data, error } = await supabase.rpc('exec_sql', { query: sql }).select();

    if (error) {
        console.error("Erro via RPC exec_sql (não habilitado):", error.message);
        console.log("Como não há acesso RPC DDL, avise o usuário para rodar isso no SQL Editor do Supabase.");
    } else {
        console.log("Migração concluída com sucesso via RPC.");
    }
}

runMigration();

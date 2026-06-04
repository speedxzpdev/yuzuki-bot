import postgres from 'postgres';

const supabaseUrl = process.env.SUPABASE_URL || '';


export const sql = postgres(supabaseUrl);
console.log("postgre conectado!");


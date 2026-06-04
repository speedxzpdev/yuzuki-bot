import postgres from 'postgres';

const supabaseUrl = process.env.DATABASE_URL || '';


export const sql = postgres(supabaseUrl, {
    ssl: { rejectUnauthorized: false },
    prepare: false,
    max: 10,
});
console.log("postgre conectado!");


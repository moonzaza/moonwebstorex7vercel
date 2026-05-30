// EDITAR AQUÍ CON TUS CREDENCIALES DE SUPABASE
const SUPABASE_URL = 'https://qrvpycpdrcgymzybdrby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydnB5Y3BkcmNneW16eWJkcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDQwMTYsImV4cCI6MjA5NDgyMDAxNn0.2EI0vonSZuTvNXgsPNl8AM36WdAZh2Xi186-24JDk6g';

// Inicializar cliente de Supabase
const { createClient } = supabase;
window.m7Supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ MoonX7: Cliente de Supabase inicializado');

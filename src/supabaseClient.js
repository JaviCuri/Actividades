import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mdmnybpebuxddofqarye.supabase.co"; // reemplaza con tu URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbW55YnBlYnV4ZGRvZnFhcnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTA0MjQsImV4cCI6MjA2MzE4NjQyNH0.qfJNzrEAkCE1rYaA6G1zu7sPt0Zav5QzcM1LV7Xt-UY"; // reemplaza con tu Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
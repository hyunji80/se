import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string;
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Product = {
  id: string;
  category: string;
  name: string;
  price: number;
  original_price: number | null;
  unit: string;
  image_url: string | null;
  tag: string | null;
  is_best: boolean;
  sort_order: number;
  created_at: string;
};

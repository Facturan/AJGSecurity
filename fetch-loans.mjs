import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('LOANS').select('*').limit(10);
  if (error) console.error(error);
  console.log(JSON.stringify(data, null, 2));

  const { data: mdata } = await supabase.from('LOAN_TYPES').select('*');
  console.log("LOAN TYPES", JSON.stringify(mdata, null, 2));
}

run();

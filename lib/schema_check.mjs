import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwbhhsfzsdflrmxogzqa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Ymhoc2Z6c2RmbHJteG9nenFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzAwODQsImV4cCI6MjA4ODAwNjA4NH0.KU2fWv0J2dlz4tfAo_uzGtnVJ3UZZJ4eZG8PJWCVZL8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  const { data, error } = await supabase
    .rpc('get_schema_info'); // if we have it, else we try a direct pg query via rest? we can't.

  // Instead, let's insert a fake row with idno="wrong" to see if it fails on idno
  const dbData = { EmplID: 99999999, idno: "EMP-TEST" };
  const { error: err } = await supabase.from('EMPDETAILS').insert([dbData]);
  if (err) {
    console.log('Error inserting:', err.message);
  } else {
    console.log('Insert succeeded! Cleaning up...');
    await supabase.from('EMPDETAILS').delete().eq('EmplID', 99999999);
  }
}

inspectSchema();

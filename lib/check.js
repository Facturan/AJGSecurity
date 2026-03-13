import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwbhhsfzsdflrmxogzqa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Ymhoc2Z6c2RmbHJteG9nenFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzAwODQsImV4cCI6MjA4ODAwNjA4NH0.KU2fWv0J2dlz4tfAo_uzGtnVJ3UZZJ4eZG8PJWCVZL8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('EMPDETAILS')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Columns available in EMPDETAILS:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('Table is empty, but query succeeded. No schema error. Which means columns are available or it is completely empty.');
      
      // Try a deliberate wrong query to see schema
      const { error: err2 } = await supabase.from('EMPDETAILS').select('Age').limit(1);
      if (err2) {
        console.error('Age error:', err2.message);
      } else {
        console.log('Age column definitely exists!');
      }
    }
  }
}

check();

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
    console.error('Error fetching EMPDETAILS:', error.message);
  } else {
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      console.log('Total columns found:', keys.length);
      console.log('Has Age column?', keys.includes('Age'));
      console.log('Has Age (lowercase) column?', keys.includes('age'));
      console.log('Has Age (uppercase) column?', keys.includes('AGE'));
      console.log('All columns:', JSON.stringify(keys));
    } else {
      console.log('Table is empty.');
      const { error: err2 } = await supabase.from('EMPDETAILS').select('Age').limit(1);
      if (err2) {
        console.error('Select Age error:', err2.message);
      } else {
        console.log('Select Age succeeded');
      }
    }
  }
}

check();

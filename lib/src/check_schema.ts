import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://clpbtuzojylgexqyfqqi.supabase.co';
const supabaseKey = '[YOUR-ANON-KEY]'; // I need to find the actual key if I can, or use the one in the project

async function checkSchema() {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('EMPDETAILS').select('*').limit(1).single();
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Keys:', Object.keys(data));
        console.log('Sample Data:', data);
    }
}

checkSchema();
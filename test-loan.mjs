import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('LOANS')
    .insert([{
      loanId: 'test_loan_id',
      employeeId: 1, // Change to valid ID if needed
      employeeName: 'Test Employee',
      loanType: 'MPL',
      amountBorrowed: 1000,
      monthlyToPay: 2,
      monthlyPayment: 500,
      biMonthlyPayment: 250,
      status: 'Active'
    }]);

  if (error) {
    console.error('Insert Error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Insert Success:', JSON.stringify(data, null, 2));
  }
}

run();

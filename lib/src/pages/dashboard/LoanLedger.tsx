import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Calendar, CreditCard, Save, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Payment {
  id?: number;
  no: number;
  paymentDate: string;
  paymentAmount: number;
  balance: number;
  isNew?: boolean;
}

interface LoanLedgerProps {
  employeeName: string;
  loanId: string;
  loanType: string;
  amount: number;
  monthly: number;
  biMonthly: number;
  onClose: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

export function LoanLedger({
  employeeName,
  loanId,
  loanType,
  amount,
  monthly,
  biMonthly,
  onClose,
}: LoanLedgerProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('LOAN_PAYMENTS')
        .select('*')
        .eq('loanId', loanId)
        .order('paymentDate', { ascending: true });

      if (error) throw error;

      let currentBalance = amount;
      const mappedPayments = (data || []).map((p, idx) => {
        currentBalance -= p.paymentAmount;
        return {
          id: p.id,
          no: idx + 1,
          paymentDate: p.paymentDate,
          paymentAmount: p.paymentAmount,
          balance: currentBalance,
        };
      });

      setPayments(mappedPayments);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  }, [loanId, amount]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleAddEntry = () => {
    const nextNo = payments.length > 0 ? Math.max(...payments.map(p => p.no)) + 1 : 1;
    const lastBalance = payments.length > 0 ? payments[payments.length - 1].balance : amount;
    setPayments(prev => [
      ...prev,
      { no: nextNo, paymentDate: new Date().toISOString().split('T')[0], paymentAmount: 0, balance: lastBalance, isNew: true },
    ]);
  };

  const handleSaveEntry = async (idx: number) => {
    const payment = payments[idx];
    if (!payment.no || !payment.paymentDate || payment.paymentAmount <= 0) {
      toast.error('Please provide a valid date and amount');
      return;
    }

    try {
      const { error } = await supabase
        .from('LOAN_PAYMENTS')
        .insert([{
          loanId: loanId,
          paymentDate: payment.paymentDate,
          paymentAmount: payment.paymentAmount
        }]);

      if (error) throw error;
      toast.success('Payment entry saved.');
      fetchPayments();
    } catch (error: any) {
      toast.error('Failed to save payment: ' + error.message);
    }
  };

  const handleDeleteEntry = async (p: Payment) => {
    if (p.isNew) {
      setPayments(prev => prev.filter(item => item.no !== p.no));
      return;
    }

    if (!confirm('Are you sure you want to delete this payment record?')) return;

    try {
      const { error } = await supabase
        .from('LOAN_PAYMENTS')
        .delete()
        .eq('id', p.id);

      if (error) throw error;
      toast.success('Payment deleted');
      fetchPayments();
    } catch (error: any) {
      toast.error('Failed to delete: ' + error.message);
    }
  };

  const handlePaymentAmountChange = (idx: number, value: string) => {
    const newAmount = parseFloat(value) || 0;
    setPayments(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], paymentAmount: newAmount };
      let running = amount;
      return copy.map(p => {
        running -= p.paymentAmount;
        return { ...p, balance: running };
      });
    });
  };

  const handleDateChange = (idx: number, value: string) => {
    setPayments(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], paymentDate: value };
      return copy;
    });
  };

  const totalPaid = payments.reduce((sum, p) => p.isNew ? sum : sum + p.paymentAmount, 0);
  const currentBalance = payments.length > 0 ? payments[payments.length - 1].balance : amount;

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Loan Ledger</h2>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{employeeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-8 space-y-8">

          {/* ── Loan Info Fields ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Loan ID */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-900 tracking-wide mb-1">Loan ID:</p>
              <p className="text-base font-semibold text-slate-900 truncate">{loanId}</p>
            </div>

            {/* Loan Type */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-900 tracking-wide mb-1">Loan Type:</p>
              <p className="text-base font-semibold text-slate-900 truncate">{loanType}</p>
            </div>

            {/* Amount */}
            <div className="bg-blue-600 rounded-xl p-4 border border-blue-600 shadow-lg shadow-blue-100">
              <p className="text-xs font-medium text-white tracking-wide mb-1">Amount:</p>
              <p className="text-base font-semibold text-white tabular-nums">{formatCurrency(amount)}</p>
            </div>

            {/* Monthly Payment */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-900 tracking-wide mb-1">Monthly Payment:</p>
              <p className="text-base font-semibold text-slate-900 tabular-nums">{formatCurrency(monthly)}</p>
            </div>

            {/* Bi-Monthly Payment */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-medium text-slate-900 tracking-wide mb-1">Bi/Monthly Payment:</p>
              <p className="text-base font-semibold text-slate-900 tabular-nums">{formatCurrency(biMonthly)}</p>
            </div>
          </div>



          {/* ── Payment Table ── */}
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-6 py-5 text-center text-15 font-black uppercase tracking-wide w-16">No.</th>
                    <th className="px-6 py-5 text-left text-15 font-black uppercase tracking-wide">Payment Date</th>
                    <th className="px-6 py-5 text-center text-15 font-black uppercase tracking-wide">Payment Amount</th>
                    <th className="px-6 py-5 text-center text-15 font-black uppercase tracking-wide">Balance</th>
                    <th className="px-6 py-5 text-center text-15 font-black uppercase tracking-wide w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto opacity-20" />
                        <p className="text-slate-400 text-xs mt-3 italic">Updating ledger...</p>
                      </td>
                    </tr>
                  ) : (
                    payments.map((p, idx) => (
                      <tr
                        key={p.no}
                        className={`transition-colors ${p.isNew ? 'bg-blue-50/50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-blue-50/30`}
                      >
                        {/* No. */}
                        <td className="px-6 py-3 text-center">
                          <span className="w-7 mx-auto flex items-center justify-center text-[15px] font-black text-slate-600">
                            {p.no}
                          </span>
                        </td>

                        {/* Payment Date */}
                        <td className="px-6 py-3">
                          {p.isNew ? (
                            <Input
                              type="date"
                              value={p.paymentDate}
                              onChange={e => handleDateChange(idx, e.target.value)}
                              className="h-8 text-xs rounded-lg border-slate-200 w-40"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-slate-700 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                              {new Date(p.paymentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
                        </td>

                        {/* Payment Amount */}
                        <td className="px-6 py-3 text-center">
                          {p.isNew ? (
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={p.paymentAmount === 0 ? '' : p.paymentAmount}
                              onChange={e => handlePaymentAmountChange(idx, e.target.value)}
                              className="h-8 text-xs text-right rounded-lg border-blue-200 bg-white w-36 mx-auto"
                            />
                          ) : (
                            <span className="text-slate-900 tabular-nums">{formatCurrency(p.paymentAmount)}</span>
                          )}
                        </td>

                        {/* Balance */}
                        <td className="px-6 py-3 text-center">
                          <span className={`tabular-nums ${p.balance <= 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {formatCurrency(Math.max(p.balance, 0))}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-3 text-center">
                          {p.isNew ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveEntry(idx)}
                                className="px-3 py-1 bg-blue-600 text-white text-[10px] font-medium tracking-wider hover:bg-blue-700 transition-colors flex items-center gap-1"
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(p)}
                                className="px-2 py-1 bg-red-50 text-red-500 text-[10px] font-medium rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-medium tracking-wider">Paid</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}

                  {!isLoading && payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                        No payment records yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-900 tracking-wide">Total Paid:</span>
              <span className="text-sm font-semibold text-emerald-600 tabular-nums">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-900 tracking-wide">Remaining Balance:</span>
              <span className="text-sm font-semibold text-blue-600 tabular-nums">{formatCurrency(currentBalance)}</span>
            </div>
          </div>
          <Button
            onClick={handleAddEntry}
            size="sm"
            className="h-10 px-5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        </div>
      </div>
    </div>
  );
}

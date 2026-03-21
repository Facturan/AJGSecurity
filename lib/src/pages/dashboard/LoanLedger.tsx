import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl min-h-[600px] max-h-[90vh] flex flex-col overflow-hidden"
      >

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border shrink-0 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">Loan Ledger</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{employeeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-8 space-y-8 bg-card">

          {/* ── Loan Info Fields ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Loan ID */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <p className="text-xs font-bold text-muted-foreground tracking-wide mb-1">Loan ID:</p>
              <p className="text-base font-bold text-foreground truncate">{loanId}</p>
            </div>

            {/* Loan Type */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <p className="text-xs font-bold text-muted-foreground tracking-wide mb-1">Loan Type:</p>
              <p className="text-base font-bold text-foreground truncate">{loanType}</p>
            </div>

            {/* Amount */}
            <div className="bg-primary rounded-xl p-4 border border-primary shadow-lg shadow-primary/20">
              <p className="text-xs font-bold text-white tracking-wide mb-1">Amount:</p>
              <p className="text-base font-black text-white tabular-nums">{formatCurrency(amount)}</p>
            </div>

            {/* Monthly Payment */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <p className="text-xs font-bold text-muted-foreground tracking-wide mb-1">Monthly Payment:</p>
              <p className="text-base font-bold text-foreground tabular-nums">{formatCurrency(monthly)}</p>
            </div>

            {/* Bi-Monthly Payment */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <p className="text-xs font-bold text-muted-foreground tracking-wide mb-1">Bi/Monthly Payment:</p>
              <p className="text-base font-bold text-foreground tabular-nums">{formatCurrency(biMonthly)}</p>
            </div>
          </div>



          {/* ── Payment Table ── */}
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-foreground border-b border-border">
                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-wide w-16">No.</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-wide">Payment Date</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-wide">Payment Amount</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-wide">Balance</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-wide w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm italic">
                        No payment records yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p, idx) => (
                      <tr
                        key={p.no}
                        className={`transition-colors hover:bg-muted/30 ${p.isNew ? 'bg-primary/5' : 'bg-transparent'}`}
                      >
                        {/* No. */}
                        <td className="px-6 py-3 text-center">
                          <span className="w-7 mx-auto flex items-center justify-center text-[15px] font-black text-foreground">
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
                              className="h-8 text-xs rounded-lg border-border bg-muted/20 w-40 text-foreground"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-foreground font-bold">
                              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
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
                              className="h-8 text-xs text-right rounded-lg border-primary/30 bg-card w-36 mx-auto text-foreground"
                            />
                          ) : (
                            <span className="text-foreground font-bold tabular-nums">{formatCurrency(p.paymentAmount)}</span>
                          )}
                        </td>

                        {/* Balance */}
                        <td className="px-6 py-3 text-center">
                          <span className={`tabular-nums font-black ${p.balance <= 0 ? 'text-green-500' : 'text-foreground'}`}>
                            {formatCurrency(Math.max(p.balance, 0))}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-3 text-center">
                          {p.isNew ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveEntry(idx)}
                                className="px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-wider hover:bg-primary/90 rounded-md transition-colors flex items-center gap-1"
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(p)}
                                className="px-2 py-1 bg-destructive/10 text-destructive text-[10px] font-bold rounded-md hover:bg-destructive/20 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5 text-green-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-wider">Paid</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0 bg-muted/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground tracking-wide">Total Paid:</span>
              <span className="text-sm font-black text-green-500 tabular-nums">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground tracking-wide">Remaining Balance:</span>
              <span className="text-sm font-black text-primary tabular-nums">{formatCurrency(currentBalance)}</span>
            </div>
          </div>
          <Button
            onClick={handleAddEntry}
            size="sm"
            className="h-10 px-5 text-xs font-black bg-primary hover:bg-primary/90 text-white rounded-lg gap-1.5 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add Payment
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

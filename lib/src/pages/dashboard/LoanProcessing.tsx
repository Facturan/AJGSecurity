import { useState, useEffect } from 'react';
import { Save, FileText, User, CreditCard, Calculator, TrendingUp, Search, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHeader } from './components/Header';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogClose } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { PesoIcon } from './icons/PesoIcon';

import { useMasterData } from './MasterDataContext';

interface Employee {
  EmplID: number;
  Fname: string;
  LName: string;
}

interface LoanProcessingData {
  loanId: string;
  employeeId: string;
  employeeName: string;
  loanType: string;
  amountBorrowed: number;
  monthlyPayment: number;
  biMonthlyPayment: number;
  monthlyToPay: number;
}

export function LoanProcessing() {
  const { setHeaderInfo } = useHeader();
  const { loanTypes } = useMasterData();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<LoanProcessingData>({
    loanId: '',
    employeeId: '',
    employeeName: '',
    loanType: '',
    amountBorrowed: 0,
    monthlyPayment: 0,
    biMonthlyPayment: 0,
    monthlyToPay: 0,
  });

  const [amountInput, setAmountInput] = useState('');

  // Helper to format with commas
  const formatWithCommas = (value: string | number) => {
    const stringValue = typeof value === 'number' ? value.toFixed(2) : value;
    const cleanValue = stringValue.replace(/,/g, '');
    if (!cleanValue) return '';
    const parts = cleanValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Automatic calculation effect
  useEffect(() => {
    const amt = formData.amountBorrowed;
    const mos = formData.monthlyToPay;

    if (amt > 0 && mos > 0) {
      const monthly = amt / mos;
      const biMonthly = monthly / 2;
      setFormData(prev => ({
        ...prev,
        monthlyPayment: monthly,
        biMonthlyPayment: biMonthly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        monthlyPayment: 0,
        biMonthlyPayment: 0
      }));
    }
  }, [formData.amountBorrowed, formData.monthlyToPay]);

  useEffect(() => {
    setHeaderInfo({
      title: 'LOAN PROCESSING',
      subtitle: 'Process new loan applications',
      searchPlaceholder: 'Search applications...',
      showSearch: false,
    });
    fetchEmployees();
  }, [setHeaderInfo]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('EMPDETAILS')
        .select('EmplID, Fname, LName')
        .order('LName', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const handleMonthlyToPayChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      monthlyToPay: parseFloat(value) || 0
    }));
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.Fname} ${emp.LName}`.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.EmplID.toString().includes(employeeSearch)
  );

  const handleSave = async () => {
    if (!formData.employeeId || !formData.loanType || formData.amountBorrowed <= 0) {
      toast.error(`Please fill in all required fields. Missing: ${!formData.employeeId ? 'Employee ' : ''}${!formData.loanType ? 'Loan Type ' : ''}${formData.amountBorrowed <= 0 ? 'Amount Borrowed' : ''}`);
      return;
    }

    setIsLoading(true);
    try {
      // Generate a unique transaction ID like LN-5ABC123-9999
      const uniqueLoanRef = `LN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      const { error } = await supabase
        .from('LOANS')
        .insert([{
          loanId: uniqueLoanRef,
          employeeId: parseInt(formData.employeeId),
          employeeName: formData.employeeName,
          loanType: formData.loanType,
          amountBorrowed: formData.amountBorrowed,
          monthlyToPay: formData.monthlyToPay,
          monthlyPayment: formData.monthlyPayment,
          biMonthlyPayment: formData.biMonthlyPayment,
          status: 'Active'
        }]);

      if (error) throw error;

      setIsSuccessOpen(true);

      // Reset form
      setFormData({
        loanId: '',
        employeeId: '',
        employeeName: '',
        loanType: '',
        amountBorrowed: 0,
        monthlyPayment: 0,
        biMonthlyPayment: 0,
        monthlyToPay: 0,
      });
      setAmountInput('');
    } catch (error: any) {
      console.error('Error saving loan:', error);
      setErrorMessage(error?.message || JSON.stringify(error) || 'Failed to connect to database.');
      setIsErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-6">
      <Card className="border-slate-200 shadow-xl overflow-hidden">
        <div className="h-2 bg-slate-900 w-full"></div>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-slate-900 rounded-2xl shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">New Loan Application</CardTitle>
              <CardDescription>Fill out the form below to process a new loan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* 1. Employee Name */}
              <div className="space-y-2">
                <Label htmlFor="employee" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Employee Name
                </Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => {
                    const emp = employees.find(e => e.EmplID.toString() === value);
                    setFormData(prev => ({
                      ...prev,
                      employeeId: value,
                      employeeName: emp ? `${emp.Fname} ${emp.LName}` : ''
                    }));
                  }}
                >
                  <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent className="w-[400px]">
                    <div className="p-2 border-b sticky top-0 bg-white/80 backdrop-blur-md z-10" onKeyDown={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          placeholder="Search by name or ID..."
                          className="pl-9 h-9 text-xs focus-visible:ring-1 focus-visible:ring-slate-900 border-slate-100"
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                          <SelectItem key={emp.EmplID} value={emp.EmplID.toString()}>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{emp.Fname} {emp.LName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">#{emp.EmplID}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-400 text-xs italic">
                          No employees found.
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Loan Type */}
              <div className="space-y-2">
                <Label htmlFor="loanType" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  Loan Type
                </Label>
                <Select
                  value={formData.loanType}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      loanType: value
                    }));
                  }}
                >
                  <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(loanTypes.map(lt => lt.loanType))).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amountBorrowed" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <PesoIcon className="w-4 h-4 text-slate-400" />
                  Amount Borrowed
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                  <Input
                    id="amountBorrowed"
                    type="text"
                    placeholder="0.00"
                    className="h-12 pl-8 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-lg"
                    value={amountInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setAmountInput(formatWithCommas(value));
                        setFormData(prev => ({ ...prev, amountBorrowed: parseFloat(value) || 0 }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyToPay" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Month To Pay
                </Label>
                <div className="relative group">
                  <Input
                    id="monthlyToPay"
                    type="number"
                    placeholder="e.g. 12"
                    className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-lg"
                    value={formData.monthlyToPay === 0 ? '' : formData.monthlyToPay}
                    onChange={(e) => handleMonthlyToPayChange(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-200 rounded text-[10px] font-black text-slate-600">
                    Months
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyPayment" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  Monthly Payment
                </Label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-slate-900">₱</span>
                  <Input
                    id="monthlyPayment"
                    type="text"
                    readOnly
                    placeholder="0.00"
                    className="h-12 pl-8 bg-slate-100 border-slate-200 text-slate-500 font-bold cursor-not-allowed"
                    value={formData.monthlyPayment === 0 ? '' : formatWithCommas(formData.monthlyPayment)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="biMonthlyPayment" className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-slate-300" />
                  Bi/Monthly Payment
                </Label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-slate-400">₱</span>
                  <Input
                    id="biMonthlyPayment"
                    type="text"
                    readOnly
                    placeholder="0.00"
                    className="h-12 pl-8 bg-slate-100 border-slate-200 text-slate-500 font-bold cursor-not-allowed"
                    value={formData.biMonthlyPayment === 0 ? '' : formatWithCommas(formData.biMonthlyPayment)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-4">
            <Button
              variant="outline"
              className="h-12 px-8 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              onClick={() => setFormData({
                loanId: '',
                employeeId: '',
                employeeName: '',
                loanType: '',
                amountBorrowed: 0,
                monthlyPayment: 0,
                biMonthlyPayment: 0,
                monthlyToPay: 0,
              })}
            >
              Clear Form
            </Button>
            <Button
              className="h-12 px-12 bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-all"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Loan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isSuccessOpen && (
          <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none bg-white p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] gap-0">
              <div className="bg-indigo-600 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute w-64 h-64 bg-white/10 rounded-full -top-32 -right-32"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-48 h-48 bg-white/5 rounded-full -bottom-24 -left-24"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl z-10"
                >
                  <CheckCircle2 className="w-10 h-10 text-indigo-600" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-2xl font-bold mt-6 z-10"
                >
                  Loan Processed
                </motion.h2>
              </div>

              <div className="p-8 space-y-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-600 text-center leading-relaxed"
                >
                  The loan application has been successfully saved to the database.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <DialogClose asChild>
                    <Button
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                    >
                      Continue
                    </Button>
                  </DialogClose>
                </motion.div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isErrorOpen && (
          <Dialog open={isErrorOpen} onOpenChange={setIsErrorOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none bg-white p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] gap-0">
              <div className="bg-red-500 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute w-64 h-64 bg-white/10 rounded-full -top-32 -right-32"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-48 h-48 bg-white/5 rounded-full -bottom-24 -left-24"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl z-10"
                >
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-2xl font-bold mt-6 z-10"
                >
                  Save Failed
                </motion.h2>
              </div>

              <div className="p-8 space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 break-words font-mono"
                >
                  {errorMessage}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-slate-600 rounded-2xl font-semibold border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                      Dismiss
                    </Button>
                  </DialogClose>
                </motion.div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

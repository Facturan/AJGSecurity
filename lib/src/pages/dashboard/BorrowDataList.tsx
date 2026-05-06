import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Users, Search, Filter, Calendar, ArrowUpRight } from 'lucide-react';
import { useHeader } from './components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { LoanLedger } from './LoanLedger';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface BorrowRecord {
  id: string;
  employeeName: string;
  loanType: string;
  amountBorrowed: number;
  monthlyToPay: number; // Term in months
  monthlyPayment: number;
  biMonthlyPayment: number;
  loanId: string;
}

export function BorrowDataList() {
  const { setHeaderInfo } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);
  const [borrowData, setBorrowData] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHeaderInfo({
      title: 'EMPLOYEE LOANS REGISTRY',
      subtitle: 'List of all active loans',
      icon: Users,
      searchPlaceholder: 'Search employees or loan types...',
      onSearch: (query) => setSearchTerm(query),
      onFilter: () => console.log('Filter clicked'),
    });
    fetchBorrowRecords();
  }, [setHeaderInfo]);

  const fetchBorrowRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('LOANS')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBorrowData(data || []);
    } catch (error: any) {
      console.error('Error fetching borrow records:', error);
      toast.error('Failed to load borrowing data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = borrowData.filter(
    (item) =>
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loanType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

  return (
    <>
      <div className="animate-in fade-in duration-500 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border shadow-sm bg-card text-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              <Users className="w-20 h-20 text-slate-950" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                Total Borrowers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-950">{borrowData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active loan accounts</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                Total Amount Loaned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-950">
                {formatCurrency(borrowData.reduce((sum, item) => sum + item.amountBorrowed, 0))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Cumulative principal</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                Avg. Monthly Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-950">
                {formatCurrency(
                  borrowData.length > 0
                    ? borrowData.reduce((sum, item) => sum + item.monthlyPayment, 0) / borrowData.length
                    : 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per active borrower</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="border-border shadow-xl overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950 border-b border-border">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 px-6 text-xs">Employee Name</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-xs">Loan Type</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10 text-xs">
                      Amount Borrowed
                    </TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10 text-xs">Month to Pay</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10 text-xs">Monthly</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10 text-xs">Bi/Monthly</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <p className="text-muted-foreground font-medium">Loading records...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className="group transition-colors hover:bg-muted/30 border-b border-border/50 last:border-0"
                      >
                        <TableCell className="px-6 py-4">
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="flex items-center gap-2 text-foreground font-bold hover:text-primary transition-all group-hover:translate-x-1"
                          >
                            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-black text-[10px] border border-border">
                              {item.employeeName.charAt(0)}
                            </span>
                            {item.employeeName}
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-muted/30 border-border text-muted-foreground font-bold text-[10px] uppercase tracking-tighter"
                          >
                            {item.loanType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground tabular-nums px-10">
                          {formatCurrency(item.amountBorrowed)}
                        </TableCell>
                        <TableCell className="text-center font-medium text-muted-foreground italic px-10">
                          {item.monthlyToPay} Months
                        </TableCell>
                        <TableCell className="text-center font-bold text-foreground tabular-nums px-10">
                          {formatCurrency(item.monthlyPayment)}
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary tabular-nums px-10">
                          {formatCurrency(item.biMonthlyPayment)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                          <Search className="w-10 h-10 mb-2 opacity-20" />
                          <p className="font-medium">No borrow data found matching your search.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loan Ledger Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <LoanLedger
            employeeName={selectedRecord.employeeName}
            loanId={selectedRecord.loanId}
            loanType={selectedRecord.loanType}
            amount={selectedRecord.amountBorrowed}
            monthly={selectedRecord.monthlyPayment}
            biMonthly={selectedRecord.biMonthlyPayment}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
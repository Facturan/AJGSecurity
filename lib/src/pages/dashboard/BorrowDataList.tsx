import { useState, useEffect } from 'react';
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
          <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-20 h-20" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">
                Total Borrowers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{borrowData.length}</div>
              <p className="text-xs opacity-60 mt-1">Active loan accounts</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                Total Amount Loaned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(borrowData.reduce((sum, item) => sum + item.amountBorrowed, 0))}
              </div>
              <p className="text-xs text-slate-500 mt-1">Cumulative principal</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                Avg. Monthly Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(
                  borrowData.length > 0
                    ? borrowData.reduce((sum, item) => sum + item.monthlyPayment, 0) / borrowData.length
                    : 0
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Per active borrower</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="border-slate-200 shadow-xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="hover:bg-slate-900 border-none">
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 px-6">Employee Name</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14">Loan Type</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10">
                      Amount Borrowed
                    </TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10">Month to Pay</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10">Monthly</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center px-10">Bi/Monthly</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-wide h-14 text-center">Loan ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={`group transition-colors hover:bg-blue-50/30 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                          }`}
                      >
                        <TableCell className="px-6 py-4">
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="flex items-center gap-2 text-slate-900 hover:text-blue-600 font-normal transition-all group-hover:translate-x-1"
                          >
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200">
                              {item.employeeName.charAt(0)}
                            </span>
                            {item.employeeName}
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-600 font-medium text-[10px] uppercase tracking-tighter"
                          >
                            {item.loanType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-normal text-slate-900 tabular-nums px-10">
                          {formatCurrency(item.amountBorrowed)}
                        </TableCell>
                        <TableCell className="text-center font-medium text-slate-600 italic px-10">
                          {item.monthlyToPay} Months
                        </TableCell>
                        <TableCell className="text-center font-normal text-slate-900 tabular-nums px-10">
                          {formatCurrency(item.monthlyPayment)}
                        </TableCell>
                        <TableCell className="text-center font-normal text-blue-600 tabular-nums px-10">
                          {formatCurrency(item.biMonthlyPayment)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-slate-100 border-slate-200 text-slate-800 font-normal text-[11px] uppercase whitespace-nowrap px-3"
                          >
                            {item.loanId}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
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
    </>
  );
}
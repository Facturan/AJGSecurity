import { useState, useEffect } from 'react';
import { Save, FileText, CreditCard, Trash2 } from 'lucide-react';
import { useHeader } from './components/Header';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

import { useMasterData } from './MasterDataContext';

export function SetupTypeLoan() {
  const { setHeaderInfo } = useHeader();
  const { loanTypes, addLoanType, deleteLoanType } = useMasterData();
  const [loanId, setLoanId] = useState('');
  const [loanType, setLoanType] = useState('');

  useEffect(() => {
    setHeaderInfo({
      title: 'SETUP TYPE OF LOAN',
      subtitle: 'Configure different types of loans available',
      searchPlaceholder: 'Search loan types...',
      showSearch: false,
    });
  }, [setHeaderInfo]);

  const handleSave = async () => {
    if (!loanId.trim() || !loanType.trim()) {
      toast.error('Please fill in both Loan ID and Loan Type');
      return;
    }

    // Check for duplicate Loan ID
    if (loanTypes.some(lt => lt.loanId.toLowerCase() === loanId.trim().toLowerCase())) {
      toast.error('Loan ID already exists');
      return;
    }

    await addLoanType({
      loanId: loanId.trim(),
      loanType: loanType.trim(),
    });

    setLoanId('');
    setLoanType('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this loan type?')) {
      await deleteLoanType(id);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entry Form */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="h-2 bg-slate-900 w-full"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900">Add Loan Type</CardTitle>
              <CardDescription>Enter details for a new loan classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="loanId" className="text-sm font-semibold text-slate-700">Loan ID</Label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <Input
                    id="loanId"
                    placeholder="e.g. LN-001"
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanType" className="text-sm font-semibold text-slate-700">Loan Type</Label>
                <div className="relative group">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <Input
                    id="loanType"
                    placeholder="e.g. Salary Loan"
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white gap-2 mt-2 font-bold shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
                onClick={handleSave}
              >
                <Save className="w-5 h-5" />
                Save Loan Type
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Existing Loan Types</CardTitle>
                <CardDescription>View and manage all loan types</CardDescription>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm font-bold text-slate-600 text-sm">
                {loanTypes.length} Total
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {loanTypes.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 italic font-medium">No loan types configured yet.</p>
                </div>
              ) : (
                loanTypes.map((item) => (
                  <div
                    key={item.loanId}
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 group hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-md shadow-slate-200">
                        {item.loanId}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{item.loanType}</p>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Classification: {item.loanId}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                      onClick={() => handleDelete(item.loanId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
      icon: CreditCard,
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
          <Card className="border-border shadow-sm overflow-hidden bg-card">
            <div className="h-2 bg-primary w-full"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-foreground">Add Loan Type</CardTitle>
              <CardDescription className="text-muted-foreground">Enter details for a new loan classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="loanId" className="text-sm font-semibold text-foreground">Loan ID</Label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="loanId"
                    placeholder="e.g. LN-001"
                    className="pl-10 h-11 bg-muted/20 border-border focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanType" className="text-sm font-semibold text-foreground">Loan Type</Label>
                <div className="relative group">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="loanType"
                    placeholder="e.g. Salary Loan"
                    className="pl-10 h-11 bg-muted/20 border-border focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white gap-2 mt-2 font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                onClick={handleSave}
              >
                <Save className="w-5 h-5" />
                Save Loan Type
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border shadow-sm flex flex-col bg-card">
          <CardHeader className="border-b border-border bg-muted/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Existing Loan Types</CardTitle>
                <CardDescription className="text-muted-foreground">View and manage all loan types</CardDescription>
              </div>
              <div className="p-2 bg-muted/20 rounded-lg border border-border shadow-sm font-bold text-foreground text-sm">
                {loanTypes.length} Total
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {loanTypes.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground italic font-medium">No loan types configured yet.</p>
                </div>
              ) : (
                loanTypes.map((item) => (
                  <div
                    key={item.loanId}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-300 group hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs shadow-md shadow-primary/20">
                        {item.loanId}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{item.loanType}</p>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Classification: {item.loanId}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
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

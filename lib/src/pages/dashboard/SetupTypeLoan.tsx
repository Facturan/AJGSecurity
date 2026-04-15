import { useState, useEffect } from 'react';
import { Save, FileText, CreditCard, Trash2, Plus, X, Pen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useHeader } from './components/Header';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

import { useMasterData } from './MasterDataContext';

export function SetupTypeLoan() {
  const { setHeaderInfo } = useHeader();
  const { loanTypes, addLoanType, updateLoanType, deleteLoanType } = useMasterData();
  const [loanId, setLoanId] = useState('');
  const [loanType, setLoanType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Auto-generate Loan ID when loanTypes changes, only if not editing
  useEffect(() => {
    if (!isEditing) {
      if (loanTypes && loanTypes.length > 0) {
        let maxInt = 0;
        loanTypes.forEach(t => {
          const idStr = t.loanId.trim().toUpperCase();
          if (idStr.startsWith("LN-")) {
            const num = parseInt(idStr.replace("LN-", ""), 10);
            if (!isNaN(num) && num > maxInt) {
              maxInt = num;
            }
          }
        });
        const nextId = `LN-${String(maxInt + 1).padStart(3, '0')}`;
        setLoanId(nextId);
      } else {
        setLoanId('LN-001');
      }
    }
  }, [loanTypes, modalOpen, isEditing]);

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

    if (isEditing) {
      await updateLoanType({
        loanId: loanId.trim(),
        loanType: loanType.trim(),
      });
    } else {
      if (loanTypes.some(lt => lt.loanId.toLowerCase() === loanId.trim().toLowerCase())) {
        toast.error('Loan ID already exists');
        return;
      }
      await addLoanType({
        loanId: loanId.trim(),
        loanType: loanType.trim(),
      });
    }

    setLoanType('');
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this loan type?')) {
      await deleteLoanType(id);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="border-border shadow-sm flex flex-col bg-card">
        <CardHeader className="border-b border-border bg-muted/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Existing Loan Types</CardTitle>
              <CardDescription className="text-muted-foreground">View and manage all loan types</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-muted/20 rounded-lg border border-border shadow-sm font-bold text-foreground text-sm">
                {loanTypes.length} Total
              </div>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setLoanType('');
                  setModalOpen(true);
                }}
                className="gap-2 font-bold shadow-md bg-primary hover:bg-primary/90 text-white rounded-full transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Loan Type
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <Table>
              <TableHeader className="bg-slate-950 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-white font-black uppercase tracking-wide h-14 pl-6 text-xs w-[150px]">
                    Loan ID
                  </TableHead>
                  <TableHead className="text-white font-black uppercase tracking-wide h-14 text-xs">
                    Loan Type
                  </TableHead>
                  <TableHead className="text-white font-black uppercase tracking-wide h-14 text-right pr-6 text-xs w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-60 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground italic font-medium">No loan types configured yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  loanTypes.map((item) => (
                    <TableRow key={item.loanId} className="group transition-colors hover:bg-muted/30 border-b border-border/50 last:border-0">
                      <TableCell className="pl-6 py-4">
                        <Badge
                          variant="outline"
                          className="bg-primary/10 border-primary/20 text-primary font-bold text-xs uppercase px-2.5 py-1"
                        >
                          {item.loanId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-foreground text-sm">{item.loanType}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-lg"
                          onClick={() => {
                            setIsEditing(true);
                            setLoanId(item.loanId);
                            setLoanType(item.loanType);
                            setModalOpen(true);
                          }}
                        >
                          <Pen className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
                          onClick={() => handleDelete(item.loanId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Add Loan Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/40 z-40 transition-opacity"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-500">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                      <CreditCard size={14} className="text-white" />
                    </div>
                    <span className="font-semibold text-white">{isEditing ? 'Edit Loan Type' : 'Add Loan Type'}</span>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="loanId" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {isEditing ? 'Loan ID (Fixed)' : 'Loan ID (Auto-generated)'}
                    </Label>
                    <div className="relative group">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="loanId"
                        value={loanId}
                        readOnly
                        disabled
                        className="pl-10 h-11 bg-muted/40 border-border font-medium text-muted-foreground cursor-not-allowed uppercase rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanType" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Loan Type</Label>
                    <div className="relative group">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="loanType"
                        placeholder="e.g. Salary Loan"
                        className="pl-10 h-11 bg-muted/5 border-border focus:bg-background focus:ring-2 focus:ring-indigo-300 transition-all text-foreground rounded-xl"
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                  <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button
                    disabled={!loanType.trim()}
                    onClick={handleSave}
                    className="px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-40 disabled:shadow-none transition-all active:scale-95"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

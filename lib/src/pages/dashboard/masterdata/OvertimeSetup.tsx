import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '../ui/dialog';
import { useMasterData } from '../MasterDataContext';

export function OvertimeSetup() {
  const { overtimeRates, updateOvertimeRates } = useMasterData();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSave = async () => {
    const RateOTRegDay  = parseFloat((document.getElementById('RateOTRegDay')  as HTMLInputElement)?.value || '0');
    const RateOTSunday  = parseFloat((document.getElementById('RateOTSunday')  as HTMLInputElement)?.value || '0');
    const RateOTSpecial = parseFloat((document.getElementById('RateOTSpecial') as HTMLInputElement)?.value || '0');
    const RateOTLegal   = parseFloat((document.getElementById('RateOTLegal')   as HTMLInputElement)?.value || '0');
    const RateOTNDBase  = parseFloat((document.getElementById('RateOTNDBase')  as HTMLInputElement)?.value || '0');
    const RateOTNDAdd   = parseFloat((document.getElementById('RateOTNDAdd')   as HTMLInputElement)?.value || '0');

    try {
      await updateOvertimeRates({ RateOTRegDay, RateOTSunday, RateOTSpecial, RateOTLegal, RateOTNDBase, RateOTNDAdd });
      setIsSuccessOpen(true);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleReset = () => {
    (document.getElementById('RateOTRegDay')  as HTMLInputElement).value = '1.25';
    (document.getElementById('RateOTSunday')  as HTMLInputElement).value = '1.30';
    (document.getElementById('RateOTSpecial') as HTMLInputElement).value = '1.30';
    (document.getElementById('RateOTLegal')   as HTMLInputElement).value = '2.00';
    (document.getElementById('RateOTNDBase')  as HTMLInputElement).value = '1.25';
    (document.getElementById('RateOTNDAdd')   as HTMLInputElement).value = '0.10';
    toast.info('Rates reset to standard defaults. Click Save to apply.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overtime Rate Configuration</CardTitle>
        <CardDescription>Set overtime rate multipliers for different scenarios</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="RateOTRegDay">Overtime Regular Day Rate</Label>
                <Input id="RateOTRegDay" type="number" step="0.01" defaultValue={overtimeRates?.RateOTRegDay ?? 1.25} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="RateOTSunday">Overtime Sunday Rate</Label>
                <Input id="RateOTSunday" type="number" step="0.01" defaultValue={overtimeRates?.RateOTSunday ?? 1.30} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="RateOTSpecial">Overtime Special Holiday Rate</Label>
                <Input id="RateOTSpecial" type="number" step="0.01" defaultValue={overtimeRates?.RateOTSpecial ?? 1.30} />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="RateOTLegal">Overtime Legal Holiday Rate</Label>
                <Input id="RateOTLegal" type="number" step="0.01" defaultValue={overtimeRates?.RateOTLegal ?? 2.00} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Overtime Night Differential Rate</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input id="RateOTNDBase" type="number" step="0.01" defaultValue={overtimeRates?.RateOTNDBase ?? 1.25} />
                  <Input id="RateOTNDAdd"  type="number" step="0.01" defaultValue={overtimeRates?.RateOTNDAdd  ?? 0.10} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t border-border mt-4">
          <Button variant="outline" className="border-border text-foreground" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold" onClick={handleSave}>
            Save Rates
          </Button>
        </div>

        {/* Success dialog */}
        <AnimatePresence>
          {isSuccessOpen && (
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
              <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none bg-card p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] gap-0">
                <div className="bg-primary p-8 flex flex-col items-center justify-center relative overflow-hidden">
                  <motion.div
                    className="absolute w-64 h-64 bg-white/10 rounded-full -top-32 -right-32"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute w-48 h-48 bg-white/5 rounded-full -bottom-24 -left-24"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl z-10"
                  >
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-2xl font-bold mt-6 z-10"
                  >
                    Rates Updated
                  </motion.h2>
                </div>

                <div className="p-8 space-y-6">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-center leading-relaxed font-bold"
                  >
                    The system has been successfully calibrated with the new overtime rate matrix.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <DialogClose asChild>
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                        Go Back
                      </Button>
                    </DialogClose>
                  </motion.div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

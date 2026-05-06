import { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useMasterData } from '../MasterDataContext';

export function PositionSetup() {
  const { positions, addPosition } = useMasterData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleAdd = async () => {
    const inputEl = document.getElementById('positionName') as HTMLInputElement;
    const val = inputEl?.value;
    if (!val) {
      toast.error('Please enter a value');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      await addPosition(val);
      setSubmitStatus('success');
      setSubmitMessage('Position added successfully!');
      inputEl.value = '';
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } catch (err: any) {
      setSubmitStatus('error');
      setSubmitMessage(err.message || 'Failed to add Position');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFeedback = () => {
    if (submitStatus === 'idle') return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`p-3 mt-2 rounded-lg flex items-center gap-2 text-sm font-bold ${
            submitStatus === 'success'
              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}
        >
          {submitStatus === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="break-words">{submitMessage}</span>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="positionName">Position Name</Label>
            <Input id="positionName" placeholder="e.g., Manager, Supervisor" disabled={isSubmitting} />
          </div>
          <Button className="w-full" disabled={isSubmitting} onClick={handleAdd}>
            {isSubmitting ? 'Adding...' : 'Add Position'}
          </Button>
          {renderFeedback()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Positions</CardTitle>
          <CardDescription>List of all positions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {positions.map((position, index) => (
              <div
                key={`${position.name}-${index}`}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-bold text-foreground">{position.name}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

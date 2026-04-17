import { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useMasterData } from '../MasterDataContext';

export function DepartmentSetup() {
  const { departments, addDepartment } = useMasterData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleAdd = async () => {
    const inputEl = document.getElementById('deptName') as HTMLInputElement;
    const val = inputEl?.value;
    if (!val) {
      toast.error('Please enter a value');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      await addDepartment(val);
      setSubmitStatus('success');
      setSubmitMessage('Department added successfully!');
      inputEl.value = '';
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } catch (err: any) {
      setSubmitStatus('error');
      setSubmitMessage(err.message || 'Failed to add Department');
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
            <Label htmlFor="deptName">Department Name</Label>
            <Input id="deptName" placeholder="e.g., Human Resources, IT" disabled={isSubmitting} />
          </div>
          <Button className="w-full" disabled={isSubmitting} onClick={handleAdd}>
            {isSubmitting ? 'Adding...' : 'Add Department'}
          </Button>
          {renderFeedback()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Departments</CardTitle>
          <CardDescription>List of all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {departments.map((dept, index) => (
              <div
                key={`${dept.name}-${index}`}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-bold text-foreground">{dept.name}</p>
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

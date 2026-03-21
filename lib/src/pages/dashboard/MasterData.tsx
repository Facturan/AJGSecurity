import { Settings, Building2, Briefcase, MapPin, Award, Clock, Users2, Users, Target, AlertCircle, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'sonner';
import { PesoIcon } from './icons/PesoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useHeader } from './components/Header';
import { useMasterData } from './MasterDataContext';
import { EmployeeData } from './EmployeeData';
import { EmployeeRegistration } from './EmployeeRegistration';
import { TrainingDetails } from './TrainingDetails';

export function MasterData() {
  const { setHeaderInfo } = useHeader();
  const {
    religions, positions, departments, employeeStatuses,
    addReligion, addPosition, addDepartment, addEmployeeStatus,
    overtimeRates, updateOvertimeRates
  } = useMasterData();
  const location = useLocation();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleAdd = async (type: string, inputId: string, action: (val: string) => Promise<any>) => {
    const inputEl = document.getElementById(inputId) as HTMLInputElement;
    const val = inputEl?.value;
    if (!val) {
      toast.error('Please enter a value');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      await action(val);
      setSubmitStatus('success');
      setSubmitMessage(`${type} added successfully!`);
      inputEl.value = '';
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } catch (err: any) {
      setSubmitStatus('error');
      setSubmitMessage(err.message || `Failed to add ${type}`);
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
          className={`p-3 mt-2 rounded-lg flex items-center gap-2 text-sm font-bold ${submitStatus === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
        >
          {submitStatus === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="break-words">{submitMessage}</span>
        </motion.div>
      </AnimatePresence>
    );
  };

  const path = location.pathname.split('/').filter(Boolean).pop() || 'position';
  const section = path === 'master-data' ? 'position' : path;

  useEffect(() => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      'employee-data-list': { title: 'EMPLOYEE DATA LIST', subtitle: 'Employee Records' },
      'employee-registration': { title: 'EMPLOYEE REGISTRATION', subtitle: 'Register a new employee' },
      'training-details': { title: 'TRAINING DETAILS', subtitle: 'Manage employee training records' },
      position: { title: 'Add New Position', subtitle: 'Create a new position in the system' },
      department: { title: 'Add New Department', subtitle: 'Create a new department' },
      religion: { title: 'Add New Religion', subtitle: 'Add a new religion option' },
      overtime: { title: 'Setup Overtime Rate', subtitle: 'Configure overtime multipliers' },
      rates: { title: 'Government Contribution Rates', subtitle: 'Configure SSS, PHIC, and HDMF contribution rates' },
      status: { title: 'Add Employee Status', subtitle: 'Create a new employee status type' },
      location: { title: 'LOCATION', subtitle: 'Manage work locations' },
      'firearm-setup': { title: 'FIREARM SETUP', subtitle: 'Global configuration for firearm records' },
    };

    const currentHeader = titles[section] || titles.position;

    // Skip setting header info for sections that manage their own header
    if (section === 'employee-registration' || section === 'employee-data-list' || section === 'training-details') {
      return;
    }

    setHeaderInfo({
      title: currentHeader.title,
      subtitle: currentHeader.subtitle,
      icon: Settings,
      searchPlaceholder: 'Search...',
      showSearch: false,
    });
  }, [section, setHeaderInfo]);

  const renderContent = () => {
    switch (section) {
      case 'employee-data-list':
        return <EmployeeData />;
      case 'employee-registration':
        return <EmployeeRegistration />;
      case 'training-details':
        return <TrainingDetails />;
      case 'position':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="positionName">Position Name</Label>
                  <Input id="positionName" placeholder="e.g., Manager, Supervisor" disabled={isSubmitting} />
                </div>
                <Button className="w-full" disabled={isSubmitting} onClick={() => handleAdd('Position', 'positionName', addPosition)}>
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

      case 'department':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="deptName">Department Name</Label>
                  <Input id="deptName" placeholder="e.g., Human Resources, IT" disabled={isSubmitting} />
                </div>
                <Button className="w-full" disabled={isSubmitting} onClick={() => handleAdd('Department', 'deptName', addDepartment)}>
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

      case 'religion':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="religionName">Religion Name</Label>
                  <Input id="religionName" placeholder="e.g., Catholic, Christian" disabled={isSubmitting} />
                </div>
                <Button className="w-full" disabled={isSubmitting} onClick={() => handleAdd('Religion', 'religionName', addReligion)}>
                  {isSubmitting ? 'Adding...' : 'Add Religion'}
                </Button>
                {renderFeedback()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Religion List</CardTitle>
                <CardDescription>All religion options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {religions.map((religion, index) => (
                    <div
                      key={`${religion}-${index}`}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <p className="font-bold text-foreground">{religion}</p>
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

      case 'overtime':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Overtime Rate Configuration</CardTitle>
              <CardDescription>Set overtime rate multipliers for different scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                        <Input id="RateOTNDAdd" type="number" step="0.01" defaultValue={overtimeRates?.RateOTNDAdd ?? 0.10} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-6 border-t border-border mt-4">
                <Button variant="outline" className="border-border text-foreground" onClick={() => {
                  (document.getElementById('RateOTRegDay') as HTMLInputElement).value = '1.25';
                  (document.getElementById('RateOTSunday') as HTMLInputElement).value = '1.30';
                  (document.getElementById('RateOTSpecial') as HTMLInputElement).value = '1.30';
                  (document.getElementById('RateOTLegal') as HTMLInputElement).value = '2.00';
                  (document.getElementById('RateOTNDBase') as HTMLInputElement).value = '1.25';
                  (document.getElementById('RateOTNDAdd') as HTMLInputElement).value = '0.10';
                  toast.info('Rates reset to standard defaults. Click Save to apply.');
                }}>Reset to Default</Button>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold" onClick={async () => {
                  const RateOTRegDay = parseFloat((document.getElementById('RateOTRegDay') as HTMLInputElement)?.value || '0');
                  const RateOTSunday = parseFloat((document.getElementById('RateOTSunday') as HTMLInputElement)?.value || '0');
                  const RateOTSpecial = parseFloat((document.getElementById('RateOTSpecial') as HTMLInputElement)?.value || '0');
                  const RateOTLegal = parseFloat((document.getElementById('RateOTLegal') as HTMLInputElement)?.value || '0');
                  const RateOTNDBase = parseFloat((document.getElementById('RateOTNDBase') as HTMLInputElement)?.value || '0');
                  const RateOTNDAdd = parseFloat((document.getElementById('RateOTNDAdd') as HTMLInputElement)?.value || '0');

                  try {
                    await updateOvertimeRates({ RateOTRegDay, RateOTSunday, RateOTSpecial, RateOTLegal, RateOTNDBase, RateOTNDAdd });
                    setIsSuccessOpen(true);
                  } catch (err) {
                    console.error("Save failed:", err);
                  }
                }}>Save Rates</Button>
              </div>

              <AnimatePresence>
                {isSuccessOpen && (
                  <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                    <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none bg-card p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] gap-0">
                      <div className="bg-primary p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Abstract animated background elements */}
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
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                          }}
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
                            <Button
                              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            >
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

      case 'rates':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Government Contribution Rates</CardTitle>
              <CardDescription>Configure SSS, PHIC, and HDMF contribution rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                  <h3 className="font-bold text-foreground border-b border-border pb-2">SSS Contribution</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sssEmployee">Employee Contributions (%)</Label>
                      <Input id="sssEmployee" type="number" step="0.01" defaultValue="4.50" className="bg-background border-border text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sssEmployer">Employer Share (%)</Label>
                      <Input id="sssEmployer" type="number" step="0.01" defaultValue="9.50" className="bg-background border-border text-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                  <h3 className="font-bold text-foreground border-b border-border pb-2">PhilHealth (PHIC)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phicEmployee">Employee Contributions (%)</Label>
                      <Input id="phicEmployee" type="number" step="0.01" defaultValue="2.00" className="bg-background border-border text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phicEmployer">Employer Share (%)</Label>
                      <Input id="phicEmployer" type="number" step="0.01" defaultValue="2.00" className="bg-background border-border text-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                  <h3 className="font-bold text-foreground border-b border-border pb-2">HDMF (Pag-IBIG)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hdmfEmployee">Employee Contributions (%)</Label>
                      <Input id="hdmfEmployee" type="number" step="0.01" defaultValue="2.00" className="bg-background border-border text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hdmfEmployer">Employer Share (%)</Label>
                      <Input id="hdmfEmployer" type="number" step="0.01" defaultValue="2.00" className="bg-background border-border text-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border">
                <Button variant="outline" className="border-border text-foreground">Reset to Default</Button>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md shadow-primary/20">Save Contribution Rates</Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'location':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Location</CardTitle>
                <CardDescription>Add a new work location or branch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="locationName">Location Name</Label>
                  <Input id="locationName" placeholder="e.g., Main Office, Branch 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationAddress">Address</Label>
                  <Input id="locationAddress" placeholder="Full address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationContact">Contact Number</Label>
                  <Input id="locationContact" placeholder="Phone number" />
                </div>
                <Button className="w-full">Add Location</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Locations</CardTitle>
                <CardDescription>All work locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {[
                    { name: 'Main Office', address: 'Makati City', employees: 120 },
                    { name: 'Branch 1', address: 'Quezon City', employees: 65 },
                    { name: 'Branch 2', address: 'Mandaluyong City', employees: 40 },
                    { name: 'Branch 3', address: 'Pasig City', employees: 20 },
                  ].map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-foreground">{location.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{location.address} - {location.employees} employees</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-foreground/70">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 font-bold">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );



      case 'status':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="statusName">Status Name</Label>
                  <Input id="statusName" placeholder="e.g., Regular, Probationary" disabled={isSubmitting} />
                </div>
                <Button className="w-full" disabled={isSubmitting} onClick={() => handleAdd('Status', 'statusName', addEmployeeStatus)}>
                  {isSubmitting ? 'Adding...' : 'Add Status'}
                </Button>
                {renderFeedback()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Status Types</CardTitle>
                <CardDescription>All employee status options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {employeeStatuses.map((status, index) => (
                    <div
                      key={`${status}-${index}`}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-foreground">{status}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-foreground/70">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 font-bold">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {renderContent()}
    </div>
  );
}

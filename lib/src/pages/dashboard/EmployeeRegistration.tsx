import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { UserPlus, Upload, Save, Search, Trash2, Loader2, RefreshCcw, Eye, Calendar as CalendarIcon, CheckCircle2, XCircle, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useHeader } from './components/Header';
import { useMasterData } from './MasterDataContext';
import { supabase } from '../../lib/supabase';
import { DatePicker } from './ui/date-picker';
import { Controller } from 'react-hook-form';
import { cn } from './ui/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeeData {
  EmplID: number;
  idno: string;
  Fname: string;
  MName: string;
  LName: string;
  Bdate: string;
  BloodType: string;
  Age: string;
  CivilStatus: string;
  Gender: string;
  Religion: string;
  heightCm: string;
  weightLb: string;
  ContactNo: string;
  EmailAdd: string;
  CAddress: string;
  PAddress: string;
  FatherName: string;
  FOccupation: string;
  FContact: string;
  FAddress: string;
  MotherName: string;
  MOccupation: string;
  MContact: string;
  MAddress: string;
  ECPerson: string;
  ECNo: string;
  EmpRate: string;
  MonthlyRate: number;
  DailyRate: number;
  HourRate: number;
  Allowance: number;
  CardNumber: string;
  BankAccount: string;
  BankType: string;
  DTHired: string;
  EmpStatus: string;
  Position: string;
  Department: string;
  JobDescription: string;
  QuitClaim: string;
  OTRegDay: number;
  OTSunday: number;
  OTSpecial: number;
  OTLegal: number;
  OTNightDiff: number;
  OTNDBase: number;
  OTNDAdd: number;
  MempHDMF: number;
  MempSSS: number;
  MempPHIC: number;
  MComHDMF: number;
  MComSSS: number;
  MComPHIC: number;
  HDMF: string;
  PHIC: string;
  SSS: string;
  TIN: string;
  LevelType: string;
  School: string;
  Course: string;
  EducAddress: string;
  DTYearGrad: string;
  IDControlNo: string;
  Locator: string;
  IssueAt: string;
  OPNo: string;
  DTIssue: string;
  DTPaid: string;
  DTApproved: string;
  DTExpiry: string;
  AssignedCompany: string;
}

export function EmployeeRegistration() {
  const [searchParams] = useSearchParams();
  const { setHeaderInfo } = useHeader();
  const { religions, positions, departments, employeeStatuses, overtimeRates } = useMasterData();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const [employeePhoto, setEmployeePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heightFt, setHeightFt] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, setValue, watch, reset, control, formState: { errors } } = useForm<EmployeeData>({
    defaultValues: {
      EmplID: '' as any,
      idno: '',
      Fname: '', MName: '', LName: '',
      Bdate: '',
      BloodType: '', Age: '', CivilStatus: '', Gender: '', Religion: '',
      heightCm: '', weightLb: '',
      ContactNo: '', EmailAdd: '', CAddress: '', PAddress: '',
      FatherName: '', FOccupation: '', FContact: '', FAddress: '',
      MotherName: '', MOccupation: '', MContact: '', MAddress: '',
      ECPerson: '', ECNo: '',
      EmpRate: 'monthly',
      MonthlyRate: 0, DailyRate: 0, HourRate: 0, Allowance: 0,
      CardNumber: '', BankAccount: '', BankType: '',
      DTHired: '',
      EmpStatus: '', Position: '', Department: '', JobDescription: '', QuitClaim: 'no',
      OTRegDay: '' as any, OTSunday: '' as any, OTSpecial: '' as any, OTLegal: '' as any, OTNightDiff: '' as any,
      OTNDBase: '' as any, OTNDAdd: '' as any,
      MempHDMF: '' as any, MempSSS: '' as any, MempPHIC: '' as any,
      MComHDMF: '' as any, MComSSS: '' as any, MComPHIC: '' as any,
      HDMF: '', PHIC: '', SSS: '', TIN: '',
      LevelType: '', School: '', Course: '', EducAddress: '',
      DTYearGrad: '',
      IDControlNo: '', Locator: '', IssueAt: '', OPNo: '',
      DTIssue: '', DTPaid: '', DTApproved: '', DTExpiry: '',
      AssignedCompany: ''
    }
  });

  const loadEmployeeData = (data: any) => {
    const heightCmNum = parseFloat(data.heightCm) || 0;
    if (heightCmNum > 0) {
      const totalInches = heightCmNum / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      setHeightFt(`${ft}'${inches}`);
    } else {
      setHeightFt('');
    }

    reset({
      ...data,
      MonthlyRate: data.MonthlyRate || 0,
      DailyRate: data.DailyRate || 0,
      HourRate: data.HourRate || 0,
      Allowance: data.Allowance || 0,
    });
    setEmployeePhoto(null);
    setIsEditing(true);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsLoadingEmployee(true);
    try {
      const isNumeric = /^\d+$/.test(query);
      const { data, error } = await supabase
        .from('EMPDETAILS')
        .select('*')
        .or(isNumeric ? `EmplID.eq.${query},idno.eq.${query}` : `idno.eq.${query}`)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        loadEmployeeData(data);
        toast.success('Employee data loaded');
      } else {
        toast.error('Employee not found');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Search failed: ' + error.message);
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    const view = searchParams.get('view');

    if (id) {
      handleSearch(id);
      if (view === 'true') {
        setIsViewOnly(true);
      }
    }
  }, [searchParams]);

  const generateRandomID = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `EMP-${random}`;
  };

  const generateNumericID = () => {
    // Generate a numeric ID based on timestamp and randomness to ensure uniqueness
    // Supabase bigint or int columns can handle these
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployeePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    console.log('Submission started with data:', data);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to save employee data');
      return;
    }

    if (isViewOnly) {
      toast.error('Cannot save in view-only mode');
      return;
    }

    setIsSubmitting(true);
    try {
      // Numerical conversions and object preparation
      const { EmplID, ...rest } = data;

      // Parse EmplID carefully - it could be string or number, and might contain 'EMP-'
      const rawEmplID = String(EmplID).replace(/\D/g, ''); // Removes all non-numeric characters like "EMP-"
      const parsedEmplID = parseInt(rawEmplID);

      if (isNaN(parsedEmplID) || rawEmplID === '') {
        throw new Error('Invalid Employee ID. Please ensure it contains numeric values.');
      }

      const dbData: any = {
        ...rest,
        EmplID: parsedEmplID,
        // Ensure all numerical fields are actually numbers or null
        Age: parseInt(String(data.Age)) || 0,
        MonthlyRate: parseFloat(String(data.MonthlyRate)) || 0,
        DailyRate: parseFloat(String(data.DailyRate)) || 0,
        HourRate: parseFloat(String(data.HourRate)) || 0,
        Allowance: parseFloat(String(data.Allowance)) || 0,
        OTRegDay: parseFloat(String(data.OTRegDay)) || 0,
        OTSunday: parseFloat(String(data.OTSunday)) || 0,
        OTSpecial: parseFloat(String(data.OTSpecial)) || 0,
        OTLegal: parseFloat(String(data.OTLegal)) || 0,
        OTNightDiff: parseFloat(String(data.OTNightDiff)) || 0,
        OTNDBase: parseFloat(String(data.OTNDBase)) || 0,
        OTNDAdd: parseFloat(String(data.OTNDAdd)) || 0,
        MempHDMF: parseFloat(String(data.MempHDMF)) || 0,
        MempSSS: parseFloat(String(data.MempSSS)) || 0,
        MempPHIC: parseFloat(String(data.MempPHIC)) || 0,
        MComHDMF: parseFloat(String(data.MComHDMF)) || 0,
        MComSSS: parseFloat(String(data.MComSSS)) || 0,
        MComPHIC: parseFloat(String(data.MComPHIC)) || 0,
        heightCm: parseFloat(String(data.heightCm)) || 0,
        weightLb: parseFloat(String(data.weightLb)) || 0,
      };

      console.log('Sending data to Supabase:', dbData);

      const { error } = await supabase
        .from('EMPDETAILS')
        .upsert([dbData], {
          onConflict: 'EmplID',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Supabase Upsert Error:', error);
        throw error;
      }

      setIsSuccessOpen(true);
      // Removed toast.success here as we are using the dialog now

      // If we just registered a new employee, we might want to refresh the view to "edit mode" with the new ID
      // or just reset the form. For now, we'll reset if not editing.
      if (!isEditing) {
        reset();
        setEmployeePhoto(null);
        setHeightFt('');
      }
    } catch (error: any) {
      console.error('Error saving employee:', error);
      setErrorMessage('Failed to save employee: ' + error.message);
      setIsErrorOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-calculate age when birthdate changes
  const bdate = watch('Bdate');
  useEffect(() => {
    if (bdate) {
      const birth = new Date(bdate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 0) setValue('Age', String(age));
    }
  }, [bdate, setValue]);

  // Auto-generate IDs for new employees
  useEffect(() => {
    if (!isEditing) {
      if (!watch('idno')) {
        setValue('idno', generateRandomID());
      }
      if (!watch('EmplID')) {
        setValue('EmplID', generateNumericID());
      }
    }
  }, [isEditing, setValue, watch]);

  // Auto-calculate rates (Daily, Hour)
  const monthlyRate = watch('MonthlyRate');
  const dRate = watch('DailyRate');
  const allowance = watch('Allowance');

  useEffect(() => {
    if (monthlyRate > 0) {
      const daily = monthlyRate / 26;
      const hourly = daily / 8;
      setValue('DailyRate', parseFloat(daily.toFixed(2)));
      setValue('HourRate', parseFloat(hourly.toFixed(2)));
    }
  }, [monthlyRate, setValue]);

  useEffect(() => {
    if (dRate > 0 && !monthlyRate) {
      const hourly = dRate / 8;
      setValue('HourRate', parseFloat(hourly.toFixed(2)));
    }
  }, [dRate, monthlyRate, setValue]);

  // Auto-fill global rates if they are missing
  useEffect(() => {
    if (overtimeRates) {
      // Check if any overtime fields are empty/zero and fill them
      const otReg = watch('OTRegDay');
      const otSun = watch('OTSunday');
      const otSpec = watch('OTSpecial');
      const otLeg = watch('OTLegal');
      const otNDB = watch('OTNDBase');
      const otNDA = watch('OTNDAdd');

      if (!otReg) setValue('OTRegDay', overtimeRates.RateOTRegDay);
      if (!otSun) setValue('OTSunday', overtimeRates.RateOTSunday);
      if (!otSpec) setValue('OTSpecial', overtimeRates.RateOTSpecial);
      if (!otLeg) setValue('OTLegal', overtimeRates.RateOTLegal);
      if (!otNDB) setValue('OTNDBase', overtimeRates.RateOTNDBase);
      if (!otNDA) setValue('OTNDAdd', overtimeRates.RateOTNDAdd);
    }
  }, [overtimeRates, setValue, watch]);

  useEffect(() => {
    setHeaderInfo({
      title: isEditing ? (isViewOnly ? 'View Employee Details' : 'Edit Employee Details') : 'Employee Registration Form',
      subtitle: 'Employee Management',
      icon: UserPlus,
      showSearch: false,
      showPrimaryAction: !isViewOnly,
      primaryActionLabel: isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'UPDATE RECORD' : 'SAVE EMPLOYEE'),
      onPrimaryAction: () => {
        console.log('Header Primary Action Triggered');
        handleSubmit(onSubmit, (validationErrors) => {
          console.error('Form Validation Errors:', validationErrors);
          setErrorMessage('Please fill in all required fields marked with *');
          setIsErrorOpen(true);
        })();
      },
      isLoading: isSubmitting
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, isEditing, isViewOnly, setHeaderInfo]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit, (validationErrors) => {
        console.error('Form Validation Errors:', validationErrors);
        setErrorMessage('Please fill in all required fields marked with *');
        setIsErrorOpen(true);
      })} className="space-y-6">
        {isViewOnly && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-500 px-4 py-3 rounded-lg flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 font-bold" />
              <p className="text-sm font-bold uppercase tracking-wider">Read Only Mode</p>
            </div>
            <div className="h-4 w-[1px] bg-blue-500/20 ml-2" />
            <p className="text-xs font-medium">You are viewing this record. Updates are disabled.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-auto text-blue-500 border-blue-500/30 hover:bg-blue-500 hover:text-white transition-all font-bold"
              onClick={() => setIsViewOnly(false)}
            >
              ENABLE EDITING
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Columns (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Details</CardTitle>
                <CardDescription>Personal information and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID <span className="text-red-500">*</span></Label>
                    <Input
                      id="employeeId"
                      {...register('EmplID', { required: true })}
                      placeholder="Enter Employee ID"
                      disabled={isViewOnly}
                      className={cn(errors.EmplID && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="idNumber"
                        {...register('idno')}
                        readOnly
                        className="bg-muted/20 font-mono font-bold text-foreground/80 border-border"
                        disabled={isViewOnly}
                      />
                      {!isEditing && !isViewOnly && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setValue('idno', generateRandomID())}
                          title="Regenerate ID"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                    <Input id="firstName" {...register('Fname', { required: true })} placeholder="First name" disabled={isViewOnly} className={cn(errors.Fname && "border-red-500 focus-visible:ring-red-500")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" {...register('MName')} placeholder="Middle name" disabled={isViewOnly} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                    <Input id="lastName" {...register('LName', { required: true })} placeholder="Last name" disabled={isViewOnly} className={cn(errors.LName && "border-red-500 focus-visible:ring-red-500")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Controller
                      name="Bdate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isViewOnly}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" placeholder="Age" {...register('Age')} disabled={isViewOnly} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Controller
                      name="BloodType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                          <SelectTrigger id="bloodType">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">Civil Status</Label>
                    <Controller
                      name="CivilStatus"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                          <SelectTrigger id="civilStatus">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            <SelectItem value="separated">Separated</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" {...register('Gender')} placeholder="Enter gender" list="gender-list" disabled={isViewOnly} />
                    <datalist id="gender-list">
                      <option value="Male" />
                      <option value="Female" />
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input id="religion" {...register('Religion')} placeholder="Enter religion" list="religion-list" disabled={isViewOnly} />
                    <datalist id="religion-list">
                      {religions.map((r) => (
                        <option key={r} value={r} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heightFt">Height (ft'in")</Label>
                    <Input
                      id="heightFt"
                      type="text"
                      placeholder="e.g. 5'7"
                      value={heightFt}
                      disabled={isViewOnly}
                      onChange={(e) => {
                        let val = e.target.value;
                        const isAdding = val.length > heightFt.length;
                        if (isAdding && /^\d$/.test(val)) val = val + "'";
                        setHeightFt(val);
                        const match = val.match(/^(\d+)'(\d*)$/);
                        if (match) {
                          const ft = parseInt(match[1]) || 0;
                          const inches = parseInt(match[2]) || 0;
                          const totalCm = (ft * 12 + inches) * 2.54;
                          if (totalCm > 0) setValue('heightCm', totalCm.toFixed(1));
                        } else {
                          setValue('heightCm', '');
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heightCm">Centimeter</Label>
                    <Input
                      id="heightCm"
                      {...register('heightCm')}
                      readOnly
                      className="bg-muted/20 text-muted-foreground border-border"
                      disabled={isViewOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightLb">Weight (lb)</Label>
                    <Input id="weightLb" {...register('weightLb')} placeholder="Weight" disabled={isViewOnly} />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold mb-3">Address & Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactNo">Contact No.</Label>
                      <Input id="contactNo" {...register('ContactNo')} placeholder="Phone number" disabled={isViewOnly} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailAdd">Email Address</Label>
                      <Input id="emailAdd" type="email" {...register('EmailAdd')} placeholder="Email" disabled={isViewOnly} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentAddress">Current Address</Label>
                      <Textarea id="currentAddress" {...register('CAddress')} placeholder="Current address" disabled={isViewOnly} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permanentAddress">Permanent Address</Label>
                      <Textarea id="permanentAddress" {...register('PAddress')} placeholder="Permanent address" disabled={isViewOnly} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parents & Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-foreground font-bold uppercase tracking-wider text-xs">Father's Information</Label>
                    <Input {...register('FatherName')} placeholder="Father's Name" disabled={isViewOnly} />
                    <Input {...register('FOccupation')} placeholder="Occupation" disabled={isViewOnly} />
                    <Input {...register('FContact')} placeholder="Contact Number" disabled={isViewOnly} />
                    <Textarea {...register('FAddress')} placeholder="Address" disabled={isViewOnly} />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-foreground font-bold uppercase tracking-wider text-xs">Mother's Information</Label>
                    <Input {...register('MotherName')} placeholder="Mother's Name" disabled={isViewOnly} />
                    <Input {...register('MOccupation')} placeholder="Occupation" disabled={isViewOnly} />
                    <Input {...register('MContact')} placeholder="Contact Number" disabled={isViewOnly} />
                    <Textarea {...register('MAddress')} placeholder="Address" disabled={isViewOnly} />
                  </div>
                </div>
                <div className="pt-4 border-t space-y-4">
                  <Label className="text-foreground font-bold uppercase tracking-wider text-xs font-black">In Case of Emergency</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input {...register('ECPerson')} placeholder="Contact Person Name" disabled={isViewOnly} />
                    <Input {...register('ECNo')} placeholder="Emergency Contact No." disabled={isViewOnly} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="contributions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="license">SG License</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <TabsContent value="contributions" className="space-y-4 mt-6">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Employee Share Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <Label className="text-foreground font-bold uppercase tracking-wider text-xs">Employee Contributions</Label>
                          <div className="hidden sm:flex gap-16 pr-4 lowercase sm:uppercase">
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Monthly</span>
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Yearly</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px] items-center gap-4">
                            <Label className="text-sm">SSS</Label>
                            <Input type="number" step="0.01" {...register('MempSSS')} className="h-8 text-right tabular-nums" disabled={isViewOnly} />
                            <div className="h-8 flex items-center justify-end px-3 rounded-md bg-muted/20 border border-border text-xs font-bold text-muted-foreground/80 tabular-nums shadow-inner">
                              {(parseFloat(String(watch('MempSSS'))) * 12 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px] items-center gap-4">
                            <Label className="text-sm">PHIC</Label>
                            <Input type="number" step="0.01" {...register('MempPHIC')} className="h-8 text-right tabular-nums" disabled={isViewOnly} />
                            <div className="h-8 flex items-center justify-end px-3 rounded-md bg-muted/20 border border-border text-xs font-bold text-muted-foreground/80 tabular-nums shadow-inner">
                              {(parseFloat(String(watch('MempPHIC'))) * 12 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px] items-center gap-4">
                            <Label className="text-sm">HDMF</Label>
                            <Input type="number" step="0.01" {...register('MempHDMF')} className="h-8 text-right tabular-nums" disabled={isViewOnly} />
                            <div className="h-8 flex items-center justify-end px-3 rounded-md bg-muted/20 border border-border text-xs font-bold text-muted-foreground/80 tabular-nums shadow-inner">
                              {(parseFloat(String(watch('MempHDMF'))) * 12 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Employer Share Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <Label className="text-foreground font-bold uppercase tracking-wider text-xs">Employer Share</Label>
                          <div className="hidden sm:flex gap-16 pr-4 lowercase sm:uppercase">
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Monthly</span>
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Yearly</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px] items-center gap-4">
                            <Label className="text-sm">SSS</Label>
                            <Input type="number" step="0.01" {...register('MComSSS')} className="h-8 text-right tabular-nums" disabled={isViewOnly} />
                            <div className="h-8 flex items-center justify-end px-3 rounded-md bg-muted/20 border border-border text-xs font-bold text-muted-foreground/80 tabular-nums shadow-inner">
                              {(parseFloat(String(watch('MComSSS'))) * 12 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px] items-center gap-4">
                            <Label className="text-sm">PHIC</Label>
                            <Input type="number" step="0.01" {...register('MComPHIC')} className="h-8 text-right tabular-nums" disabled={isViewOnly} />
                            <div className="h-8 flex items-center justify-end px-3 rounded-md bg-muted/20 border border-border text-xs font-bold text-muted-foreground/80 tabular-nums shadow-inner">
                              {(parseFloat(String(watch('MComPHIC'))) * 12 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px] items-center gap-4">
                            <Label className="text-sm">HDMF</Label>
                            <Input type="number" step="0.01" {...register('MComHDMF')} className="h-8 text-right tabular-nums" disabled={isViewOnly} />
                            <div className="h-8 flex items-center justify-end px-3 rounded-md bg-muted/20 border border-border text-xs font-bold text-muted-foreground/80 tabular-nums shadow-inner">
                              {(parseFloat(String(watch('MComHDMF'))) * 12 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">SSS No.</Label>
                        <Input {...register('SSS')} placeholder="SSS NO" className="h-9" disabled={isViewOnly} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">PHIC No.</Label>
                        <Input {...register('PHIC')} placeholder="PHIC NO" className="h-9" disabled={isViewOnly} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">HDMF No.</Label>
                        <Input {...register('HDMF')} placeholder="HDMF NO" className="h-9" disabled={isViewOnly} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">TIN No.</Label>
                        <Input {...register('TIN')} placeholder="TIN NO" className="h-9" disabled={isViewOnly} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="license" className="space-y-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ID Control No.</Label>
                        <Input {...register('IDControlNo')} disabled={isViewOnly} />
                      </div>
                      <div className="space-y-2">
                        <Label>Locator</Label>
                        <Input {...register('Locator')} disabled={isViewOnly} />
                      </div>
                      <div className="space-y-2">
                        <Label>Issued At</Label>
                        <Input {...register('IssueAt')} disabled={isViewOnly} />
                      </div>
                      <div className="space-y-2">
                        <Label>OP No.</Label>
                        <Input {...register('OPNo')} disabled={isViewOnly} />
                      </div>
                      <div className="space-y-2">
                        <Label>Date Issued</Label>
                        <Controller name="DTIssue" control={control} render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} disabled={isViewOnly} />} />
                      </div>
                      <div className="space-y-2">
                        <Label>Date Paid</Label>
                        <Controller name="DTPaid" control={control} render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} disabled={isViewOnly} />} />
                      </div>
                      <div className="space-y-2">
                        <Label>Date Approved</Label>
                        <Controller name="DTApproved" control={control} render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} disabled={isViewOnly} />} />
                      </div>
                      <div className="space-y-2">
                        <Label>Date Expiry</Label>
                        <Controller name="DTExpiry" control={control} render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} disabled={isViewOnly} />} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Level Type</Label>
                      <Controller
                        name="LevelType"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="elementary">Elementary</SelectItem>
                              <SelectItem value="highschool">High School</SelectItem>
                              <SelectItem value="college">College</SelectItem>
                              <SelectItem value="vocational">Vocational</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <Input {...register('School')} placeholder="School Name" disabled={isViewOnly} />
                    <Input {...register('Course')} placeholder="Course" disabled={isViewOnly} />
                    <Textarea {...register('EducAddress')} placeholder="School Address" disabled={isViewOnly} />
                    <div className="space-y-2">
                      <Label>Year Graduated</Label>
                      <Controller name="DTYearGrad" control={control} render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} disabled={isViewOnly} />} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Photo</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(
                    "w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center relative overflow-hidden",
                    !isViewOnly && "cursor-pointer hover:bg-muted/10 transition-colors"
                  )}
                  onClick={() => !isViewOnly && document.getElementById('photo-input')?.click()}
                >
                  {employeePhoto ? (
                    <img src={employeePhoto} alt="Employee" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground/40 mb-2" />
                      <span className="text-xs text-muted-foreground/60">Upload Photo</span>
                    </>
                  )}
                  <input id="photo-input" type="file" hidden accept="image/*" onChange={handlePhotoChange} disabled={isViewOnly} />
                </div>

                <div className="space-y-2 pt-4 border-t border-border mt-2">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Building2 className="w-4 h-4 text-primary" />
                    <Label className="text-[10px] font-black uppercase tracking-widest">Assigned Company</Label>
                  </div>
                  <Input
                    {...register('AssignedCompany')}
                    placeholder="Enter Assigned Company"
                    disabled={isViewOnly}
                    className="h-10 rounded-xl border-border bg-muted/5 focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Employment Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Salary Method</Label>
                  <Controller
                    name="EmpRate"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                        <SelectTrigger><SelectValue placeholder="Monthly" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Rate</Label>
                    <Input type="number" {...register('MonthlyRate')} disabled={isViewOnly} />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Rate</Label>
                    <Input type="number" {...register('DailyRate')} disabled={isViewOnly} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Allowance</Label>
                    <Input type="number" {...register('Allowance')} disabled={isViewOnly} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hour Rate</Label>
                    <Input type="number" {...register('HourRate')} disabled={isViewOnly} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bank Account / Type</Label>
                  <Input {...register('BankAccount')} placeholder="Account NO" disabled={isViewOnly} className="mb-2" />
                  <Input {...register('BankType')} placeholder="Bank Name (e.g. BDO)" disabled={isViewOnly} />
                </div>
                <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4 border-t border-border pt-4">Deployment</div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    name="EmpStatus"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {employeeStatuses.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Controller
                    name="Position"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {positions.map(p => (
                            <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Controller
                    name="Department"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {departments.map(d => (
                            <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Hired</Label>
                  <Controller name="DTHired" control={control} render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} disabled={isViewOnly} />} />
                </div>
                <div className="space-y-2 pt-2 border-t mt-2">
                  <Label>Job Description</Label>
                  <Textarea
                    {...register('JobDescription')}
                    rows={3}
                    disabled={isViewOnly}
                    className="text-xs resize-none"
                    placeholder="Brief description of duties..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quit Claim</Label>
                  <Controller
                    name="QuitClaim"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewOnly}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="No" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overtime Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-muted-foreground">Regular Day</Label>
                    <Input type="number" step="0.01" {...register('OTRegDay', { valueAsNumber: true })} disabled={isViewOnly} className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-muted-foreground">Sunday</Label>
                    <Input type="number" step="0.01" {...register('OTSunday', { valueAsNumber: true })} disabled={isViewOnly} className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-muted-foreground">Special Holiday</Label>
                    <Input type="number" step="0.01" {...register('OTSpecial', { valueAsNumber: true })} disabled={isViewOnly} className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-muted-foreground">Legal Holiday</Label>
                    <Input type="number" step="0.01" {...register('OTLegal', { valueAsNumber: true })} disabled={isViewOnly} className="h-9" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Night Differential (Base / Add)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" step="0.01" {...register('OTNDBase', { valueAsNumber: true })} disabled={isViewOnly} className="h-9" />
                    <Input type="number" step="0.01" {...register('OTNDAdd', { valueAsNumber: true })} disabled={isViewOnly} className="h-9" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </form>

      <AnimatePresence>
        {isSuccessOpen && (
          <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none bg-card p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] gap-0">
              <div className="bg-primary p-8 flex flex-col items-center justify-center relative overflow-hidden">
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
                  {isEditing ? 'Record Updated' : 'Employee Added'}
                </motion.h2>
              </div>

              <div className="p-8 space-y-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-center leading-relaxed"
                >
                  {isEditing
                    ? 'The employee record has been successfully updated in the secure database.'
                    : 'The employee has been successfully added to the system and is now active.'}
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
            <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none bg-card p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] gap-0">
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
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                  }}
                  className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl z-10"
                >
                  <XCircle className="w-10 h-10 text-red-500" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-2xl font-bold mt-6 z-10 text-center"
                >
                  Submission Failed
                </motion.h2>
              </div>

              <div className="p-8 space-y-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-center leading-relaxed font-bold"
                >
                  {errorMessage}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500 rounded-2xl font-bold transition-all active:scale-[0.98]"
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
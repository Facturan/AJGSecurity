import React, { useState, useEffect } from 'react';
import { UserPlus, Upload, Save, Search, Trash2, Plus, Loader2 } from 'lucide-react';
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
}

export function EmployeeRegistration() {
  const { setHeaderInfo } = useHeader();
  const { religions, positions, departments, employeeStatuses } = useMasterData();
  const [employeePhoto, setEmployeePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<EmployeeData>({
    defaultValues: {
      EmplID: Date.now(),
      idno: '',
      Fname: '', MName: '', LName: '',
      Bdate: new Date().toISOString().split('T')[0],
      BloodType: '', Age: '', CivilStatus: '', Gender: '', Religion: '',
      heightCm: '', weightLb: '',
      ContactNo: '', EmailAdd: '', CAddress: '', PAddress: '',
      FatherName: '', FOccupation: '', FContact: '', FAddress: '',
      MotherName: '', MOccupation: '', MContact: '', MAddress: '',
      ECPerson: '', ECNo: '',
      EmpRate: 'monthly',
      MonthlyRate: 0, DailyRate: 0, HourRate: 0, Allowance: 0,
      CardNumber: '', BankAccount: '', BankType: '',
      DTHired: new Date().toISOString().split('T')[0],
      EmpStatus: '', Position: '', Department: '', JobDescription: '', QuitClaim: 'no',
      OTRegDay: 0, OTSunday: 0, OTSpecial: 0, OTLegal: 0, OTNightDiff: 0,
      MempHDMF: 0, MempSSS: 0, MempPHIC: 0,
      MComHDMF: 0, MComSSS: 0, MComPHIC: 0,
      HDMF: '', PHIC: '', SSS: '', TIN: '',
      LevelType: '', School: '', Course: '', EducAddress: '',
      DTYearGrad: new Date().toISOString().split('T')[0],
      IDControlNo: '', Locator: '', IssueAt: '', OPNo: '',
      DTIssue: new Date().toISOString().split('T')[0], DTPaid: new Date().toISOString().split('T')[0], DTApproved: new Date().toISOString().split('T')[0], DTExpiry: new Date().toISOString().split('T')[0]
    }
  });

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
    setIsSubmitting(true);
    try {
      // Conversions
      const heightCm = parseFloat(data.heightCm) || 0;
      const totalInches = heightCm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      const kilos = Math.round((parseFloat(data.weightLb) || 0) * 0.453592);

      const dbData = {
        ...data,
        Feet: feet,
        Inch: inches,
        Kilos: kilos,
        Path: 'photo_' + data.EmplID // Placeholder for path since base64 is too long for varchar(100)
      };

      // Remove UI-only fields or fields not in DB
      delete dbData.heightCm;
      delete dbData.weightLb;
      delete dbData.Age;

      // Remove idno if empty to allow auto-generation
      if (!dbData.idno) delete dbData.idno;

      const { error } = await supabase
        .from('EMPDETAILS')
        .insert([dbData]);

      if (error) throw error;

      toast.success('Employee registered successfully!');
      reset();
      setEmployeePhoto(null);
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast.error('Failed to register employee: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setHeaderInfo({
      title: 'Employee Registration Form',
      subtitle: 'Employee Management',
      searchPlaceholder: 'Search...',
      showSearch: false,
      showPrimaryAction: true,
      primaryActionLabel: isSubmitting ? 'Adding...' : 'ADD',
      onPrimaryAction: handleSubmit(onSubmit),
    });
  }, [isSubmitting]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
              <CardDescription>Personal information and identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" {...register('EmplID')} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input id="idNumber" {...register('idno')} placeholder="Enter ID number" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('Fname')} placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" {...register('MName')} placeholder="Middle name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('LName')} placeholder="Last name" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" {...register('Bdate')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select onValueChange={(val) => setValue('BloodType', val)} value={watch('BloodType') as string}>
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select blood type" />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Age" {...register('Age')} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="civilStatus">Civil Status</Label>
                  <Select onValueChange={(val) => setValue('CivilStatus', val)} value={watch('CivilStatus') as string}>
                    <SelectTrigger id="civilStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                      <SelectItem value="separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" {...register('Gender')} placeholder="Enter or select gender" list="gender-list" />
                  <datalist id="gender-list">
                    <option value="Male" />
                    <option value="Female" />
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Input id="religion" {...register('Religion')} placeholder="Enter or select religion" list="religion-list" />
                  <datalist id="religion-list">
                    {religions.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heightCm">Height (cm)</Label>
                  <Input id="heightCm" {...register('heightCm')} type="text" inputMode="decimal" placeholder="Enter height" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightLb">Weight (lb)</Label>
                  <Input id="weightLb" {...register('weightLb')} type="text" inputMode="decimal" placeholder="Enter weight" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Contact / Address Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNo">Contact No.</Label>
                    <Input id="contactNo" {...register('ContactNo')} placeholder="Phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAdd">Email Address</Label>
                    <Input id="emailAdd" type="email" {...register('EmailAdd')} placeholder="your@gmail.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAddress">Current Address</Label>
                    <Textarea id="currentAddress" {...register('CAddress')} placeholder="Enter current address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                    <Textarea id="permanentAddress" {...register('PAddress')} placeholder="Enter permanent address" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Parents Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parents Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input id="fatherName" {...register('FatherName')} placeholder="Father's name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input id="motherName" {...register('MotherName')} placeholder="Mother's name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                  <Input id="fatherOccupation" {...register('FOccupation')} placeholder="Occupation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                  <Input id="motherOccupation" {...register('MOccupation')} placeholder="Occupation" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherContact">Father's Contact No.</Label>
                  <Input id="fatherContact" {...register('FContact')} placeholder="Contact number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherContact">Mother's Contact No.</Label>
                  <Input id="motherContact" {...register('MContact')} placeholder="Contact number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherAddress">Father's Address</Label>
                  <Textarea id="fatherAddress" {...register('FAddress')} placeholder="Address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherAddress">Mother's Address</Label>
                  <Textarea id="motherAddress" {...register('MAddress')} placeholder="Address" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">In Case of Emergency</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPerson">Contact Person</Label>
                    <Input id="emergencyPerson" {...register('ECPerson')} placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactNo">Contact No.</Label>
                    <Input id="emergencyContactNo" {...register('ECNo')} placeholder="Phone number" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contributions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="monthly">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>HDMF Employee</Label>
                        <Input type="number" step="0.01" {...register('MempHDMF')} />
                      </div>
                      <div className="space-y-2">
                        <Label>HDMF Employer</Label>
                        <Input type="number" step="0.01" {...register('MComHDMF')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SSS Employee</Label>
                        <Input type="number" step="0.01" {...register('MempSSS')} />
                      </div>
                      <div className="space-y-2">
                        <Label>SSS Employer</Label>
                        <Input type="number" step="0.01" {...register('MComSSS')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>PHIC Employee</Label>
                        <Input type="number" step="0.01" {...register('MempPHIC')} />
                      </div>
                      <div className="space-y-2">
                        <Label>PHIC Employer</Label>
                        <Input type="number" step="0.01" {...register('MComPHIC')} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="yearly" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">Yearly tracking is handled in reports.</p>
                </TabsContent>
              </Tabs>
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="hdmfNo">HDMF No:</Label>
                  <Input id="hdmfNo" {...register('HDMF')} placeholder="HDMF number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sssNo">SSS No:</Label>
                  <Input id="sssNo" {...register('SSS')} placeholder="SSS number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phicNo">PHIC No:</Label>
                  <Input id="phicNo" {...register('PHIC')} placeholder="PHIC number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tinNo">TIN No:</Label>
                  <Input id="tinNo" {...register('TIN')} placeholder="TIN number" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SG License Details */}
          <Card>
            <CardHeader>
              <CardTitle>SG License Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idControlNo">ID Control No.</Label>
                <Input id="idControlNo" {...register('IDControlNo')} placeholder="Control number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locator">Locator</Label>
                <Input id="locator" {...register('Locator')} placeholder="Locator" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuedAt">Issued at</Label>
                <Input id="issuedAt" {...register('IssueAt')} placeholder="Issue location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opNo">OP No.</Label>
                <Input id="opNo" {...register('OPNo')} placeholder="OP number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateIssued">Date Issued</Label>
                <Input id="dateIssued" type="date" {...register('DTIssue')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datePaid">Date Paid</Label>
                <Input id="datePaid" type="date" {...register('DTPaid')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateApproved">Date Approved</Label>
                <Input id="dateApproved" type="date" {...register('DTApproved')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateExpiry">Date Expiry</Label>
                <Input id="dateExpiry" type="date" {...register('DTExpiry')} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {employeePhoto ? (
                  <img src={employeePhoto} alt="Employee" className="w-full h-48 object-contain rounded" />
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-sm text-slate-600">Click to upload photo</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Load Picture
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Deployment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMethod">Salary Method</Label>
                <Select onValueChange={(val) => setValue('EmpRate', val)} value={watch('EmpRate') as string}>
                  <SelectTrigger id="salaryMethod">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRate">Monthly Rate</Label>
                  <Input id="monthlyRate" type="number" step="0.01" {...register('MonthlyRate')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate</Label>
                  <Input id="dailyRate" type="number" step="0.01" {...register('DailyRate')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allowance">Allowance</Label>
                  <Input id="allowance" type="number" step="0.01" {...register('Allowance')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourRate">Hour Rate</Label>
                  <Input id="hourRate" type="number" step="0.01" {...register('HourRate')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" {...register('CardNumber')} placeholder="Card number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Input id="bankAccount" {...register('BankAccount')} placeholder="Bank account number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankType">Bank Name/Type</Label>
                <Input id="bankType" {...register('BankType')} placeholder="e.g. BDO, BPI" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateHired">Date Hired</Label>
                <Input id="dateHired" type="date" {...register('DTHired')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empStatus">Employee Status</Label>
                <Select onValueChange={(val) => setValue('EmpStatus', val)} value={watch('EmpStatus') as string}>
                  <SelectTrigger id="empStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeStatuses.map((s) => (
                      <SelectItem key={s} value={s.toLowerCase().replace(/\s+/g, '-')}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select onValueChange={(val) => setValue('Position', val)} value={watch('Position') as string}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => (
                      <SelectItem key={p.name} value={p.code.toLowerCase()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(val) => setValue('Department', val)} value={watch('Department') as string}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.name} value={d.code.toLowerCase()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea id="jobDescription" {...register('JobDescription')} placeholder="Enter job description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quitClaim">Quit Claim</Label>
                <Select onValueChange={(val) => setValue('QuitClaim', val)} value={watch('QuitClaim') as string}>
                  <SelectTrigger id="quitClaim">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Overtime Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Overtime Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otRegDay">OT Reg Day</Label>
                  <Input id="otRegDay" type="number" step="0.01" {...register('OTRegDay')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otSunday">OT Sunday</Label>
                  <Input id="otSunday" type="number" step="0.01" {...register('OTSunday')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otSpecial">OT Special</Label>
                  <Input id="otSpecial" type="number" step="0.01" {...register('OTSpecial')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otLegal">OT Legal</Label>
                  <Input id="otLegal" type="number" step="0.01" {...register('OTLegal')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otNd">OT Night Diff</Label>
                <Input id="otNd" type="number" step="0.01" {...register('OTNightDiff')} />
              </div>
            </CardContent>
          </Card>

          {/* Educational Attainment */}
          <Card>
            <CardHeader>
              <CardTitle>Highest Educational Attainment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="levelType">Level Type</Label>
                <Select onValueChange={(val) => setValue('LevelType', val)} value={watch('LevelType') as string}>
                  <SelectTrigger id="levelType">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary</SelectItem>
                    <SelectItem value="highschool">High School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="vocational">Vocational</SelectItem>
                    <SelectItem value="masteral">Masteral</SelectItem>
                    <SelectItem value="doctoral">Doctoral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input id="school" {...register('School')} placeholder="School name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input id="course" {...register('Course')} placeholder="Course/Program" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolAddress">Address</Label>
                <Textarea id="schoolAddress" {...register('EducAddress')} placeholder="School address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearGraduated">Year Graduated</Label>
                <Input id="yearGraduated" type="date" {...register('DTYearGrad')} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
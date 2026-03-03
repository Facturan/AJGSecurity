import React, { useState, useEffect } from 'react';
import { UserPlus, Upload, Save, Search, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useHeader } from './components/Header';
import { useMasterData } from './MasterDataContext';

export function EmployeeRegistration() {
  const { setHeaderInfo } = useHeader();
  const { religions, positions, departments, employeeStatuses } = useMasterData();
  const [employeePhoto, setEmployeePhoto] = useState<string | null>(null);

  useEffect(() => {
    setHeaderInfo({
      title: 'REGISTRATION',
      subtitle: 'Employee Management',
      searchPlaceholder: 'Search employee...',
      showSearch: false,
      showPrimaryAction: true,
      primaryActionLabel: 'Save',
    });
  }, []);

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
                  <Input id="employeeId" placeholder="Auto-generated" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input id="idNumber" placeholder="Enter ID number" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" placeholder="Middle name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Last name" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" defaultValue="2026-02-17" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select>
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
                  <Input id="age" type="number" placeholder="Age" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="civilStatus">Civil Status</Label>
                  <Select>
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
                  <Input id="gender" placeholder="Enter or select gender" list="gender-list" />
                  <datalist id="gender-list">
                    <option value="Male" />
                    <option value="Female" />
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Input id="religion" placeholder="Enter or select religion" list="religion-list" />
                  <datalist id="religion-list">
                    {religions.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heightCm">Height</Label>
                  <Input id="heightCm" type="text" inputMode="decimal" placeholder="Enter height" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightLb">Weight</Label>
                  <Input id="weightLb" type="text" inputMode="decimal" placeholder="Enter weight" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Contact / Address Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNo">Contact No.</Label>
                    <Input id="contactNo" placeholder="Phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAdd">Email Address</Label>
                    <Input id="emailAdd" type="email" placeholder="your@gmail.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAddress">Current Address</Label>
                    <Textarea id="currentAddress" placeholder="Enter current address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                    <Textarea id="permanentAddress" placeholder="Enter permanent address" />
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
                  <Input id="fatherName" placeholder="Father's name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input id="motherName" placeholder="Mother's name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                  <Input id="fatherOccupation" placeholder="Occupation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                  <Input id="motherOccupation" placeholder="Occupation" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherContact">Father's Contact No.</Label>
                  <Input id="fatherContact" placeholder="Contact number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherContact">Mother's Contact No.</Label>
                  <Input id="motherContact" placeholder="Contact number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherAddress">Father's Address</Label>
                  <Textarea id="fatherAddress" placeholder="Address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherAddress">Mother's Address</Label>
                  <Textarea id="motherAddress" placeholder="Address" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">In Case of Emergency</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPerson">Contact Person</Label>
                    <Input id="emergencyPerson" placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactNo">Contact No.</Label>
                    <Input id="emergencyContactNo" placeholder="Phone number" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contributions */}
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
                    {['HDMF', 'SSS', 'PHIC'].map((item) => (
                      <div key={item} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{item} Employee</Label>
                          <Input type="number" step="0.01" defaultValue="0.00" />
                        </div>
                        <div className="space-y-2">
                          <Label>{item} Employer</Label>
                          <Input type="number" step="0.01" defaultValue="0.00" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="yearly" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {['HDMF', 'SSS', 'PHIC'].map((item) => (
                      <div key={item} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{item} Employee</Label>
                          <Input type="number" step="0.01" defaultValue="0.00" />
                        </div>
                        <div className="space-y-2">
                          <Label>{item} Employer</Label>
                          <Input type="number" step="0.01" defaultValue="0.00" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="hdmfNo">HDMF No:</Label>
                  <Input id="hdmfNo" placeholder="HDMF number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sssNo">SSS No:</Label>
                  <Input id="sssNo" placeholder="SSS number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phicNo">PHIC No:</Label>
                  <Input id="phicNo" placeholder="PHIC number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tinNo">TIN No:</Label>
                  <Input id="tinNo" placeholder="TIN number" />
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
                <Input id="idControlNo" placeholder="Control number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locator">Locator</Label>
                <Input id="locator" placeholder="Locator" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuedAt">Issued at</Label>
                <Input id="issuedAt" placeholder="Issue location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opNo">OP No.</Label>
                <Input id="opNo" placeholder="OP number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateIssued">Date Issued</Label>
                <Input id="dateIssued" type="date" defaultValue="2026-02-17" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datePaid">Date Paid</Label>
                <Input id="datePaid" type="date" defaultValue="2026-02-17" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateApproved">Date Approved</Label>
                <Input id="dateApproved" type="date" defaultValue="2026-02-17" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateExpiry">Date Expiry</Label>
                <Input id="dateExpiry" type="date" defaultValue="2026-02-17" />
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
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                {employeePhoto ? (
                  <img src={employeePhoto} alt="Employee" className="w-full h-48 object-cover rounded" />
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
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Load Picture
              </Button>
            </CardContent>
          </Card>

          {/* Company Deployment */}
          <Card>
            <CardHeader>
              <CardTitle>Company Deployment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMethod">Salary Method</Label>
                <Select>
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
                  <Input id="monthlyRate" type="number" step="0.01" defaultValue="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate</Label>
                  <Input id="dailyRate" type="number" step="0.01" defaultValue="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allowance">Allowance</Label>
                  <Input id="allowance" type="number" step="0.01" defaultValue="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourRate">Hour Rate</Label>
                  <Input id="hourRate" type="number" step="0.01" defaultValue="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="Card number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Select>
                  <SelectTrigger id="bankAccount">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bdo">BDO</SelectItem>
                    <SelectItem value="bpi">BPI</SelectItem>
                    <SelectItem value="metrobank">Metrobank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateHired">Date Hired</Label>
                <Input id="dateHired" type="date" defaultValue="2026-02-17" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empStatus">Employee Status</Label>
                <Select>
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
                <Select>
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
                <Select>
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
                <Textarea id="jobDescription" placeholder="Enter job description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quitClaim">Quit Claim</Label>
                <Select>
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
                  <Input id="otRegDay" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otRegDayRate">Rate</Label>
                  <Input id="otRegDayRate" type="number" step="0.01" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otSunday">OT Sunday</Label>
                  <Input id="otSunday" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otSundayRate">Rate</Label>
                  <Input id="otSundayRate" type="number" step="0.01" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otSpecial">OT Special</Label>
                  <Input id="otSpecial" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otSpecialRate">Rate</Label>
                  <Input id="otSpecialRate" type="number" step="0.01" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otLegal">OT Legal</Label>
                  <Input id="otLegal" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otLegalRate">Rate</Label>
                  <Input id="otLegalRate" type="number" step="0.01" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="otNd">OT ND</Label>
                  <Input id="otNd" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otNdRate1">Rate 1</Label>
                  <Input id="otNdRate1" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otNdRate2">Rate 2</Label>
                  <Input id="otNdRate2" type="number" step="0.01" />
                </div>
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
                <Select>
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
                <Input id="school" placeholder="School name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input id="course" placeholder="Course/Program" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolAddress">Address</Label>
                <Textarea id="schoolAddress" placeholder="School address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearGraduated">Year Graduated</Label>
                <Input id="yearGraduated" type="date" defaultValue="2026-02-17" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
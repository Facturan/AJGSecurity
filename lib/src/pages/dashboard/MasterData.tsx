import { Settings, Building2, Briefcase, MapPin, Award, Clock, Users2, Users, Target, AlertCircle, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { PesoIcon } from './icons/PesoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useHeader } from './components/Header';
import { useMasterData } from './MasterDataContext';
import { EmployeeData } from './EmployeeData';

export function MasterData() {
  const { setHeaderInfo } = useHeader();
  const [licenseForm, setLicenseForm] = useState({
    holderName: '',
    licenseNumber: '',
    issueDate: '',
    expirationDate: ''
  });
  const [activeFirearmTab, setActiveFirearmTab] = useState('Model');
  const {
    religions, positions, departments, employeeStatuses,
    firearmModels, firearmCalibers, firearmMakes, firearmKinds, firearmLicenses,
    addReligion, addPosition, addDepartment, addEmployeeStatus,
    addFirearmModel, addFirearmCaliber, addFirearmMake, addFirearmKind, addFirearmLicense
  } = useMasterData();
  const location = useLocation();

  const path = location.pathname.split('/').filter(Boolean).pop() || 'position';
  const section = path === 'master-data' ? 'position' : path;

  useEffect(() => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      'employee-data-list': { title: 'EMPLOYEE DATA LIST', subtitle: 'Employee Records' },
      position: { title: 'POSITION', subtitle: 'Manage employee positions' },
      department: { title: 'DEPARTMENT', subtitle: 'Manage company departments' },
      religion: { title: 'RELIGION', subtitle: 'Manage religion options' },
      overtime: { title: 'OVERTIME', subtitle: 'Configure overtime multipliers' },
      rates: { title: 'RATES', subtitle: 'Configure contribution rates' },
      location: { title: 'LOCATION', subtitle: 'Manage work locations' },
      'firearm-setup': { title: 'FIREARM SETUP', subtitle: 'Global configuration for firearm records' },
    };

    const currentHeader = titles[section] || titles.position;

    setHeaderInfo({
      title: currentHeader.title,
      subtitle: currentHeader.subtitle,
      searchPlaceholder: 'Search...',
      showSearch: false
    });
  }, [section]);

  const renderContent = () => {
    switch (section) {
      case 'employee-data-list':
        return <EmployeeData />;
      case 'position':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Position</CardTitle>
                <CardDescription>Create a new position in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="positionName">Position Name</Label>
                  <Input id="positionName" placeholder="e.g., Manager, Supervisor" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionCode">Position Code</Label>
                  <Input id="positionCode" placeholder="e.g., MGR, SUP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionLevel">Position Level</Label>
                  <Input id="positionLevel" placeholder="e.g., 1-5" />
                </div>
                <Button className="w-full" onClick={() => {
                  const name = (document.getElementById('positionName') as HTMLInputElement)?.value;
                  const code = (document.getElementById('positionCode') as HTMLInputElement)?.value;
                  const level = (document.getElementById('positionLevel') as HTMLInputElement)?.value;
                  if (name) { addPosition(name, code || '', level || ''); (document.getElementById('positionName') as HTMLInputElement).value = ''; (document.getElementById('positionCode') as HTMLInputElement).value = ''; (document.getElementById('positionLevel') as HTMLInputElement).value = ''; }
                }}>Add Position</Button>
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
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{position.name}</p>
                        <p className="text-xs text-slate-500">{position.code} - {position.level}</p>
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
              <CardHeader>
                <CardTitle>Add New Department</CardTitle>
                <CardDescription>Create a new department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deptName">Department Name</Label>
                  <Input id="deptName" placeholder="e.g., Human Resources, IT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deptCode">Department Code</Label>
                  <Input id="deptCode" placeholder="e.g., HR, IT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deptHead">Department Head</Label>
                  <Input id="deptHead" placeholder="e.g., Juan Dela Cruz" />
                </div>
                <Button className="w-full" onClick={() => {
                  const name = (document.getElementById('deptName') as HTMLInputElement)?.value;
                  const code = (document.getElementById('deptCode') as HTMLInputElement)?.value;
                  const head = (document.getElementById('deptHead') as HTMLInputElement)?.value;
                  if (name) { addDepartment(name, code || '', head || ''); (document.getElementById('deptName') as HTMLInputElement).value = ''; (document.getElementById('deptCode') as HTMLInputElement).value = ''; (document.getElementById('deptHead') as HTMLInputElement).value = ''; }
                }}>Add Department</Button>
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
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-xs text-slate-500">{dept.code} - {dept.head}</p>
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
              <CardHeader>
                <CardTitle>Add Religion</CardTitle>
                <CardDescription>Add a new religion option</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="religionName">Religion Name</Label>
                  <Input id="religionName" placeholder="e.g., Catholic, Christian" />
                </div>
                <Button className="w-full" onClick={() => {
                  const name = (document.getElementById('religionName') as HTMLInputElement)?.value;
                  if (name) { addReligion(name); (document.getElementById('religionName') as HTMLInputElement).value = ''; }
                }}>Add Religion</Button>
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
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-medium">{religion}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="otRegular">Regular Day OT Rate</Label>
                      <Input id="otRegular" type="number" step="0.01" defaultValue="1.25" />
                    </div>
                    <div className="text-sm text-slate-500 flex items-end pb-2">
                      125% of hourly rate
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="otSunday">Sunday OT Rate</Label>
                      <Input id="otSunday" type="number" step="0.01" defaultValue="1.30" />
                    </div>
                    <div className="text-sm text-slate-500 flex items-end pb-2">
                      130% of hourly rate
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="otSpecial">Special Holiday OT Rate</Label>
                      <Input id="otSpecial" type="number" step="0.01" defaultValue="1.30" />
                    </div>
                    <div className="text-sm text-slate-500 flex items-end pb-2">
                      130% of hourly rate
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="otLegal">Legal Holiday OT Rate</Label>
                      <Input id="otLegal" type="number" step="0.01" defaultValue="2.00" />
                    </div>
                    <div className="text-sm text-slate-500 flex items-end pb-2">
                      200% of hourly rate
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="otNightDiff">Night Differential Rate</Label>
                      <Input id="otNightDiff" type="number" step="0.01" defaultValue="0.10" />
                    </div>
                    <div className="text-sm text-slate-500 flex items-end pb-2">
                      Additional 10% for night shift
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-6 border-t mt-4">
                <Button variant="outline">Reset to Default</Button>
                <Button className="bg-slate-900">Save Rates</Button>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 p-4 border rounded-xl bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 border-b pb-2">SSS Contribution</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sssEmployee">Employee Share (%)</Label>
                      <Input id="sssEmployee" type="number" step="0.01" defaultValue="4.50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sssEmployer">Employer Share (%)</Label>
                      <Input id="sssEmployer" type="number" step="0.01" defaultValue="9.50" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-xl bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 border-b pb-2">PhilHealth (PHIC)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phicEmployee">Employee Share (%)</Label>
                      <Input id="phicEmployee" type="number" step="0.01" defaultValue="2.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phicEmployer">Employer Share (%)</Label>
                      <Input id="phicEmployer" type="number" step="0.01" defaultValue="2.00" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-xl bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 border-b pb-2">HDMF (Pag-IBIG)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hdmfEmployee">Employee Share (%)</Label>
                      <Input id="hdmfEmployee" type="number" step="0.01" defaultValue="2.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hdmfEmployer">Employer Share (%)</Label>
                      <Input id="hdmfEmployer" type="number" step="0.01" defaultValue="2.00" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline">Reset to Default</Button>
                <Button className="bg-slate-900 shadow-md">Save Contribution Rates</Button>
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
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-xs text-slate-500">{location.address} - {location.employees} employees</p>
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


      case 'firearm-setup':
        return (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 border-b">
              {['Model', 'Caliber', 'Make', 'Kind', 'License'].map((tab) => (
                <Button
                  key={tab}
                  variant={activeFirearmTab === tab ? 'default' : 'ghost'}
                  onClick={() => setActiveFirearmTab(tab)}
                  className="whitespace-nowrap"
                >
                  {tab}
                </Button>
              ))}
            </div>

            <div key={activeFirearmTab}>
              {(() => {
                const activeTab = activeFirearmTab;
                if (activeTab === 'License') {
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>License Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="holderName" className="text-slate-700 font-semibold">License Holder Name:</Label>
                            <Input
                              id="holderName"
                              placeholder="Enter license holder name"
                              value={licenseForm.holderName}
                              onChange={(e) => setLicenseForm({ ...licenseForm, holderName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="licenseNumber" className="text-slate-700 font-semibold">License Number:</Label>
                            <Input
                              id="licenseNumber"
                              placeholder="Enter license number"
                              value={licenseForm.licenseNumber}
                              onChange={(e) => setLicenseForm({ ...licenseForm, licenseNumber: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="issueDate" className="text-slate-700 font-semibold">Issue Date:</Label>
                            <div className="relative">
                              <Input
                                id="issueDate"
                                type="date"
                                value={licenseForm.issueDate}
                                onChange={(e) => setLicenseForm({ ...licenseForm, issueDate: e.target.value })}
                                className="pr-10"
                              />
                              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expirationDate" className="text-slate-700 font-semibold">Expiration Date:</Label>
                            <div className="relative">
                              <Input
                                id="expirationDate"
                                type="date"
                                value={licenseForm.expirationDate}
                                onChange={(e) => setLicenseForm({ ...licenseForm, expirationDate: e.target.value })}
                                className="pr-10"
                              />
                              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="h-fit">
                        <CardHeader>
                          <CardTitle>Registration Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-semibold text-sm">Under Review</span>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Model:</span>
                              <span className="text-slate-400">Pending</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Caliber:</span>
                              <span className="text-slate-400">Pending</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Manufacturer:</span>
                              <span className="text-slate-400">Pending</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-3">
                              <span className="text-slate-500 font-medium">Firearm Type:</span>
                              <span className="text-slate-400">Pending</span>
                            </div>

                            <div className="flex justify-between text-sm pt-2">
                              <span className="text-slate-500 font-medium">License Holder:</span>
                              <span className="text-slate-900">{licenseForm.holderName || 'John Doe'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">License Number:</span>
                              <span className="text-slate-900">{licenseForm.licenseNumber || '123456789'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Issue Date:</span>
                              <span className="text-slate-900">{licenseForm.issueDate || '12/15/2021'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Expiration Date:</span>
                              <span className="text-slate-900">{licenseForm.expirationDate || '12/15/2026'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                }

                const setupMap: Record<string, { label: string, data: string[], addFn: (n: string) => void }> = {
                  'Model': { label: 'Model', data: firearmModels, addFn: addFirearmModel },
                  'Caliber': { label: 'Caliber', data: firearmCalibers, addFn: addFirearmCaliber },
                  'Make': { label: 'Make', data: firearmMakes, addFn: addFirearmMake },
                  'Kind': { label: 'Kind', data: firearmKinds, addFn: addFirearmKind },
                };
                const config = setupMap[activeTab];

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add {config.label}</CardTitle>
                        <CardDescription>Setup new {config.label.toLowerCase()} in the system</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="firearmInput">{config.label} Name</Label>
                          <Input id="firearmInput" placeholder={`e.g., ${config.data[0]}`} />
                        </div>
                        <Button className="w-full" onClick={() => {
                          const val = (document.getElementById('firearmInput') as HTMLInputElement)?.value;
                          if (val) { config.addFn(val); (document.getElementById('firearmInput') as HTMLInputElement).value = ''; }
                        }}>Add {config.label}</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Existing {config.label}s</CardTitle>
                        <CardDescription>All configured {config.label.toLowerCase()}s</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                          {config.data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                              <p className="font-medium">{item}</p>
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
              })()}
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Employee Status</CardTitle>
                <CardDescription>Create a new employee status type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="statusName">Status Name</Label>
                  <Input id="statusName" placeholder="e.g., Regular, Probationary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statusDescription">Description</Label>
                  <Input id="statusDescription" placeholder="Status description" />
                </div>
                <Button className="w-full" onClick={() => {
                  const name = (document.getElementById('statusName') as HTMLInputElement)?.value;
                  if (name) { addEmployeeStatus(name); (document.getElementById('statusName') as HTMLInputElement).value = ''; }
                }}>Add Status</Button>
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
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{status}</p>
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

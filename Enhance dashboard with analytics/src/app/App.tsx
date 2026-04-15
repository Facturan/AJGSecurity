import { useState } from 'react';
import { Calendar, Users, FileText, BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import logoImage from 'figma:asset/5142cb66088be1e70d52fd658ac74a313052f746.png';

// Mock data for payroll trends
const payrollTrends = [
  { month: 'Sep', amount: 45000 },
  { month: 'Oct', amount: 47000 },
  { month: 'Nov', amount: 46500 },
  { month: 'Dec', amount: 52000 },
  { month: 'Jan', amount: 48000 },
  { month: 'Feb', amount: 49500 },
  { month: 'Mar', amount: 50000 },
];

// Mock data for department distribution
const departmentData = [
  { name: 'Engineering', value: 45, employees: 45 },
  { name: 'Sales', value: 30, employees: 30 },
  { name: 'Marketing', value: 15, employees: 15 },
  { name: 'HR', value: 10, employees: 10 },
];

// Mock data for employee growth
const employeeGrowth = [
  { month: 'Sep', count: 95 },
  { month: 'Oct', count: 97 },
  { month: 'Nov', count: 98 },
  { month: 'Dec', count: 98 },
  { month: 'Jan', count: 99 },
  { month: 'Feb', count: 100 },
  { month: 'Mar', count: 103 },
];

// Mock data for salary distribution
const salaryDistribution = [
  { range: '20K-40K', count: 25 },
  { range: '40K-60K', count: 35 },
  { range: '60K-80K', count: 28 },
  { range: '80K-100K', count: 10 },
  { range: '100K+', count: 5 },
];

// Mock data for attendance rate
const attendanceData = [
  { week: 'Week 1', rate: 96 },
  { week: 'Week 2', rate: 94 },
  { week: 'Week 3', rate: 97 },
  { week: 'Week 4', rate: 95 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const recentActivity = [
  { id: 1, type: 'New employee registration: Cameron Besas', daysAgo: 13 },
  { id: 2, type: 'New employee registration: blind coffee', daysAgo: 15 },
  { id: 3, type: 'New employee registration: Rio Facturan', daysAgo: 19 },
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <img src={logoImage} alt="HRIS Logo" className="h-16 w-16 rounded-lg" />
        <div>
          <h1 className="text-4xl font-bold text-gray-900">HRIS Payroll Software</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Calendar className="h-4 w-4" />
            <span>Friday, March 27, 2026</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-white p-1">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Employees
                </CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">103</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  +3% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  This Month Payroll
                </CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₱50.00K</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  +0.10% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Pending Reviews
                </CardTitle>
                <FileText className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  5 urgent
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Department Count
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4</div>
                <p className="text-xs text-gray-500 mt-2">
                  Across organization
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle>Payroll Trends</CardTitle>
                <CardDescription>Monthly payroll expenses over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={payrollTrends}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value) => `₱${value.toLocaleString()}`}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employees by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value, name, props) => [`${props.payload.employees} employees`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.daysAgo} days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Average Salary
                </CardTitle>
                <DollarSign className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₱48.5K</div>
                <p className="text-xs text-gray-500 mt-2">Across all departments</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Attendance Rate
                </CardTitle>
                <Users className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">95.5%</div>
                <p className="text-xs text-green-600 mt-2">Above target</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Turnover Rate
                </CardTitle>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2.1%</div>
                <p className="text-xs text-green-600 mt-2">Below industry avg</p>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle>Employee Growth</CardTitle>
                <CardDescription>Headcount growth over 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={employeeGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[90, 110]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value) => [`${value} employees`, 'Count']}
                    />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>Employees by salary range</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salaryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value) => [`${value} employees`, 'Count']}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Chart */}
          <Card className="bg-white border-none shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Attendance Rate</CardTitle>
              <CardDescription>Average attendance percentage by week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[90, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value) => [`${value}%`, 'Attendance Rate']}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card className="bg-white border-none shadow-sm">
            <CardHeader>
              <CardTitle>Department Metrics</CardTitle>
              <CardDescription>Key performance indicators by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={dept.name} className="flex items-center gap-4">
                    <div className="w-32 font-medium text-gray-900">{dept.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div 
                        className="h-full flex items-center px-4 text-white text-sm font-medium rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(dept.employees / 103) * 100}%`,
                          backgroundColor: COLORS[index]
                        }}
                      >
                        {dept.employees}
                      </div>
                    </div>
                    <div className="w-20 text-right text-gray-600">
                      {((dept.employees / 103) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Payroll Summary Report
                </CardTitle>
                <CardDescription>Complete payroll breakdown for March 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Disbursed:</span>
                    <span className="font-medium">₱50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Deductions:</span>
                    <span className="font-medium">₱8,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Benefits:</span>
                    <span className="font-medium">₱12,300</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Attendance Report
                </CardTitle>
                <CardDescription>Employee attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Attendance:</span>
                    <span className="font-medium">95.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Late Arrivals:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Absences:</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Department Analysis
                </CardTitle>
                <CardDescription>Department-wise cost and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highest Cost:</span>
                    <span className="font-medium">Engineering</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Performance:</span>
                    <span className="font-medium">Sales</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Rate:</span>
                    <span className="font-medium">+8.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Annual Overview
                </CardTitle>
                <CardDescription>Year-to-date performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTD Payroll:</span>
                    <span className="font-medium">₱147,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Hires:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departures:</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

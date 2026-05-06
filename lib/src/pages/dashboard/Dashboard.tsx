import { useEffect, useState } from 'react';
import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Loader2,
  Activity,
  DollarSign
} from 'lucide-react';
import { PesoIcon } from './icons/PesoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useHeader } from './components/Header';
import { supabase } from '../../lib/supabase';
import logo from '../../../../assets/image/logo-4.png';

// Mock data as fallback/templates for charts
const payrollTrends = [
  { month: 'Sep', amount: 45000 },
  { month: 'Oct', amount: 47000 },
  { month: 'Nov', amount: 46500 },
  { month: 'Dec', amount: 52000 },
  { month: 'Jan', amount: 48000 },
  { month: 'Feb', amount: 49500 },
  { month: 'Mar', amount: 50000 },
];

const departmentDataMock = [
  { name: 'Engineering', value: 45, employees: 45 },
  { name: 'Sales', value: 30, employees: 30 },
  { name: 'Marketing', value: 15, employees: 15 },
  { name: 'HR', value: 10, employees: 10 },
];

const employeeGrowthMock = [
  { month: 'Sep', count: 95 },
  { month: 'Oct', count: 97 },
  { month: 'Nov', count: 98 },
  { month: 'Dec', count: 98 },
  { month: 'Jan', count: 99 },
  { month: 'Feb', count: 100 },
  { month: 'Mar', count: 103 },
];

const salaryDistributionMock = [
  { range: '20K-40K', count: 25 },
  { range: '40K-60K', count: 35 },
  { range: '60K-80K', count: 28 },
  { range: '80K-100K', count: 10 },
  { range: '100K+', count: 5 },
];

const attendanceDataMock = [
  { week: 'Week 1', rate: 96 },
  { week: 'Week 2', rate: 94 },
  { week: 'Week 3', rate: 97 },
  { week: 'Week 4', rate: 95 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface DashboardStats {
  totalEmployees: number;
  thisMonthPayroll: number;
  pendingReviews: number;
  departmentCount: number;
}

interface ActivityItem {
  action: string;
  time: string;
  type: 'success' | 'info' | 'warning';
  timestamp: number;
}

export function Dashboard() {
  const { setHeaderInfo } = useHeader();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    thisMonthPayroll: 0,
    pendingReviews: 0,
    departmentCount: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // hideHeader: false shows the global system header with the new notification bell
    setHeaderInfo({
      title: 'HRIS Payroll Software',
      subtitle: todayStr,
      hideHeader: false,
      showSearch: false,
      showNotificationBell: true,
      notificationCount: 3,
      icon: Activity,
      iconColor: "bg-gradient-to-br from-blue-600 to-indigo-500 shadow-blue-100/50"
    });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch Stats
      const [
        { count: empCount },
        { data: payrollData },
        { count: deptCount },
        { data: recentEmployees },
        { data: recentPayroll }
      ] = await Promise.all([
        supabase.from('EMPDETAILS').select('*', { count: 'exact', head: true }),
        supabase.from('PAYROLLDATA').select('NetPay').gte('DatePosting', firstDayOfMonth),
        supabase.from('DEPARTMENTS').select('*', { count: 'exact', head: true }),
        supabase.from('EMPDETAILS').select('Fname, LName, created_at').order('created_at', { ascending: false }).limit(4),
        supabase.from('PAYROLLDATA').select('EmpName, DatePosting, created_at').order('created_at', { ascending: false }).limit(4),
      ]);

      const totalPayroll = (payrollData || []).reduce((sum, item) => sum + (Number(item.NetPay) || 0), 0);

      setStats({
        totalEmployees: empCount || 0,
        thisMonthPayroll: totalPayroll,
        pendingReviews: 7,
        departmentCount: deptCount || 0,
      });

      // Process Activities
      const combinedActivities: ActivityItem[] = [];
      if (recentEmployees) {
        recentEmployees.forEach(emp => {
          combinedActivities.push({
            action: `New employee registration: ${emp.Fname} ${emp.LName}`,
            time: formatTimeAgo(new Date(emp.created_at || Date.now())),
            type: 'info',
            timestamp: new Date(emp.created_at || Date.now()).getTime(),
          });
        });
      }
      if (recentPayroll) {
        recentPayroll.forEach(p => {
          combinedActivities.push({
            action: `Payroll processed for ${p.EmpName}`,
            time: formatTimeAgo(new Date(p.created_at || p.DatePosting || Date.now())),
            type: 'success',
            timestamp: new Date(p.created_at || p.DatePosting || Date.now()).getTime(),
          });
        });
      }
      setActivities(combinedActivities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 p-4 lg:p-8 pb-20">
      {/* SECTION: OVERVIEW */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Dashboard Overview</h2>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 border-none group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Employees</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-500 transition-colors">
                <Users className="h-5 w-5 text-blue-500 group-hover:text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-slate-200" /> : <div className="text-4xl font-black text-slate-900">{stats.totalEmployees}</div>}
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-3 font-bold bg-emerald-50 w-fit px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                +3% increase
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 border-none group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Monthly Payroll</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-500 transition-colors">
                <PesoIcon className="h-5 w-5 text-emerald-500 group-hover:text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-slate-200" /> : <div className="text-4xl font-black text-slate-900">₱{(stats.thisMonthPayroll / 1000).toFixed(2)}K</div>}
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-3 font-bold bg-emerald-50 w-fit px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                +0.10% spike
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 border-none group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Reviews</CardTitle>
              <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-500 transition-colors">
                <FileText className="h-5 w-5 text-orange-500 group-hover:text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{stats.pendingReviews}</div>
              <p className="text-xs text-orange-600 flex items-center gap-1 mt-3 font-bold bg-orange-50 w-fit px-2 py-1 rounded-full">
                <Activity className="h-3 w-3" />
                5 urgent
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 border-none group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Departments</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-500 transition-colors">
                <BarChart3 className="h-5 w-5 text-purple-500 group-hover:text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{stats.departmentCount}</div>
              <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1 bg-slate-50 w-fit px-2 py-1 rounded-full">
                Across organization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overview Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-sm border-none overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-xl font-black text-slate-900">Payroll Trends</CardTitle>
              <CardDescription>Monthly payroll expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={payrollTrends}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₱${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => `₱${value.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} strokeWidth={3} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-none overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-xl font-black text-slate-900">Department Distribution</CardTitle>
              <CardDescription>Headcount by key departments</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentDataMock}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentDataMock.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION: ANALYTICS */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Detailed Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border-none p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Salary</p>
                <h3 className="text-3xl font-black mt-2 text-slate-900">₱48.5K</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <PesoIcon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 font-medium italic">Industry benchmark avg</p>
          </Card>
          <Card className="bg-white shadow-sm border-none p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
                <h3 className="text-3xl font-black mt-2 text-slate-900">95.5%</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-4 font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Target met
            </p>
          </Card>
          <Card className="bg-white shadow-sm border-none p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retention</p>
                <h3 className="text-3xl font-black mt-2 text-slate-900">97.9%</h3>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <TrendingDown className="w-6 h-6 rotate-180" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-4 font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Extremely stable
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-sm border-none overflow-hidden">
            <CardHeader className="bg-slate-50/30">
              <CardTitle className="text-lg font-bold">Employee Growth</CardTitle>
              <CardDescription>Headcount expansion trajectory</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={employeeGrowthMock}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[90, 110]} />
                  <Tooltip contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ fill: '#3b82f6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-none overflow-hidden">
            <CardHeader className="bg-slate-50/30">
              <CardTitle className="text-lg font-bold">Salary Distribution</CardTitle>
              <CardDescription>Workforce by pay grade</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryDistributionMock}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm border-none overflow-hidden">
          <CardHeader className="bg-slate-50/30">
            <CardTitle className="text-lg font-bold">Attendance Trends</CardTitle>
            <CardDescription>Weekly average attendance percentage</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={attendanceDataMock}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[90, 100]} />
                <Tooltip contentStyle={{ border: 'none', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="rate" stroke="#3b82f6" fillOpacity={1} strokeWidth={2} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* SECTION: REPORTS & LOGS */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Reports & Activity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Payroll Summary', desc: 'Current month breakdown', icon: PesoIcon, color: 'blue', val: '₱50,000' },
            { title: 'Attendance Report', desc: 'Absence & late tracking', icon: Users, color: 'emerald', val: '95.5%' },
            { title: 'Cost Analysis', desc: 'Resource allocation ROI', icon: BarChart3, color: 'purple', val: 'Eng Lead' },
            { title: 'HR Overview', desc: 'Growth & turnovers', icon: FileText, color: 'orange', val: '+3.2%' }
          ].map((report, i) => (
            <Card key={i} className="hover:border-primary border border-transparent cursor-pointer transition-all hover:shadow-xl group bg-white shadow-sm p-2">
              <CardHeader className="p-4 flex flex-row items-center gap-4">
                <div className={`p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-primary group-hover:text-white transition-all`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">{report.title}</CardTitle>
                  <p className="text-xs text-slate-500 font-medium">{report.desc}</p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-white shadow-sm border-none overflow-hidden pb-4">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Latest System Logs
            </CardTitle>
            <CardDescription>Live feed of HR and Payroll updates</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-slate-300 py-6 justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="font-bold">Loading activity...</p>
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${activity.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">{activity.action}</p>
                      <p className="text-xs text-slate-400 font-bold">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-300 font-bold italic">No recent logs found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

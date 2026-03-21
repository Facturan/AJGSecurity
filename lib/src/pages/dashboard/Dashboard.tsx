import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import {
  UserPlus,
  Users,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  Calendar,
  FileText,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { PesoIcon } from './icons/PesoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useHeader } from './components/Header';
import { supabase } from '../../lib/supabase';
import logo from '../../../../assets/image/logo-4.png';

const quickActions = [
  {
    title: 'Registration Form',
    description: 'Register new employees',
    icon: UserPlus,
    path: '/master-data/employee-registration',
    color: 'bg-blue-500'
  },
  {
    title: 'Payroll Data Entry',
    description: 'Process payroll data',
    icon: PesoIcon,
    path: '/payroll-entry',
    color: 'bg-green-500'
  },
  {
    title: 'Employee Data List',
    description: 'View and manage employees',
    icon: Users,
    path: '/master-data/employee-data-list',
    color: 'bg-purple-500'
  },
  {
    title: 'Employee Master Data',
    description: 'System configuration',
    icon: Settings,
    path: '/master-data',
    color: 'bg-orange-500'
  },
  {
    title: 'Settings',
    description: 'Company, theme & preferences',
    icon: SlidersHorizontal,
    path: '/settings',
    color: 'bg-slate-600'
  },
  {
    title: 'Borrow Data List',
    description: 'Track and manage loans',
    icon: Users,
    path: '/borrow-data-list',
    color: 'bg-indigo-500'
  },
];

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
    setHeaderInfo({ title: 'DASHBOARD', subtitle: 'HR Information System', searchPlaceholder: 'Search...', hideHeader: true });
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
        pendingReviews: 0, // Placeholder if no pending reviews table exists
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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statItems = [
    { label: 'Total Employees', value: stats.totalEmployees.toString(), icon: Users, color: 'text-blue-600' },
    { label: 'This Month Payroll', value: `₱${(stats.thisMonthPayroll / 1000).toLocaleString('en-PH', { minimumFractionDigits: 2 })}K`, icon: PesoIcon, color: 'text-green-600' },
    { label: 'Pending Reviews', value: stats.pendingReviews.toString(), icon: FileText, color: 'text-orange-600' },
    { label: 'Department Count', value: stats.departmentCount.toString(), icon: BarChart3, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-2">
      {/* Custom Stylized Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 text-center md:text-left">
        <div className="bg-card p-3 rounded-2xl shadow-sm border border-border shrink-0">
          <img src={logo} alt="HRIS Logo" className="w-12 h-12 md:w-12 md:h-12 object-contain" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">HRIS Payroll Software</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{today}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-extrabold text-foreground mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-border bg-card/50 backdrop-blur-sm hover:-translate-y-1">
                  <CardHeader>
                    <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground">{action.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-foreground mb-6 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Recent Activity
        </h2>
        <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Fetching activity...</p>
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${activity.type === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                      activity.type === 'info' ? 'bg-primary shadow-[0_0_8px_rgba(8,102,255,0.4)]' :
                        'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{activity.action}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

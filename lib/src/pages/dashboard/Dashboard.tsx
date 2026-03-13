import { Link } from 'react-router';
import { useEffect } from 'react';
import {
  UserPlus,
  Users,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  Calendar,
  FileText,
  BarChart3,
  Receipt
} from 'lucide-react';
import { PesoIcon } from './icons/PesoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useHeader } from './components/Header';
import logo from '../../../../assets/image/logo-4.png';

const quickActions = [
  {
    title: 'Employee Registration Form',
    description: 'Register new employees',
    icon: UserPlus,
    path: '/employee-registration',
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

const stats = [
  { label: 'Total Employees', value: '245', icon: Users, color: 'text-blue-600' },
  { label: 'This Month Payroll', value: '₱2,569.69K', icon: PesoIcon, color: 'text-green-600' },
  { label: 'Pending Reviews', value: '12', icon: FileText, color: 'text-orange-600' },
  { label: 'Department Count', value: '8', icon: BarChart3, color: 'text-purple-600' },
];

export function Dashboard() {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({ title: 'DASHBOARD', subtitle: 'HR Information System', searchPlaceholder: 'Search...', hideHeader: true });
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-2">
      {/* Custom Stylized Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 text-center md:text-left">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 shrink-0">
          <img src={logo} alt="HRIS Logo" className="w-12 h-12 md:w-12 md:h-12 object-contain" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">HRIS Payroll Software</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mt-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{today}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.label}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-none bg-white/50 backdrop-blur-sm hover:-translate-y-1">
                  <CardHeader>
                    <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">{action.title}</CardTitle>
                    <CardDescription className="text-slate-500">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Recent Activity
        </h2>
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { action: 'Payroll processed for Employee #354354', time: '2 hours ago', type: 'success' },
                { action: 'New employee registration: PAULA BIANCA ARELLANA', time: '5 hours ago', type: 'info' },
                { action: 'Overtime rate updated', time: '1 day ago', type: 'warning' },
                { action: 'Monthly contributions calculated', time: '2 days ago', type: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${activity.type === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                    activity.type === 'info' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' :
                      'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{activity.action}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

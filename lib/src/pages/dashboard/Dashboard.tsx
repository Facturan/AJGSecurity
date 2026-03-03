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
  BarChart3
} from 'lucide-react';
import { PesoIcon } from './icons/PesoIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useHeader } from './components/Header';
import logo from '../../../../assets/image/logo.png';

const quickActions = [
  {
    title: 'Employee Registration',
    description: 'Register new employees',
    icon: UserPlus,
    path: '/employee-registration',
    color: 'bg-blue-500'
  },
  {
    title: 'Payroll Entry',
    description: 'Process payroll data',
    icon: PesoIcon,
    path: '/payroll-entry',
    color: 'bg-green-500'
  },
  {
    title: 'Employee Data',
    description: 'View and manage employees',
    icon: Users,
    path: '/employee-data',
    color: 'bg-purple-500'
  },
  {
    title: 'Master Data',
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
    setHeaderInfo({ title: 'DASHBOARD', subtitle: 'HR Information System', searchPlaceholder: 'Search...' });
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
          <img src={logo} alt="HRIS Logo" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            HRIS Payroll Software
          </h1>
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {today}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
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
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Payroll processed for Employee #354354', time: '2 hours ago', type: 'success' },
              { action: 'New employee registration: PAULA BIANCA ARELLANA', time: '5 hours ago', type: 'info' },
              { action: 'Overtime rate updated', time: '1 day ago', type: 'warning' },
              { action: 'Monthly contributions calculated', time: '2 days ago', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

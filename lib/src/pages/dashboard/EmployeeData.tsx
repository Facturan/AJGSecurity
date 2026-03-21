import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { useHeader } from './components/Header';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Employee {
  idno: string;
  EmplID: number;
  Fname: string;
  MName: string;
  LName: string;
  Position: string;
  Department: string;
  EmpStatus: string;
  MonthlyRate: number;
  DTHired: string;
  ContactNo?: string;
  AssignedCompany?: string;
}

export function EmployeeData() {
  const navigate = useNavigate();
  const { setHeaderInfo } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('EMPDETAILS')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setHeaderInfo({
      title: 'EMPLOYEE DATA',
      subtitle: 'Employee Records',
      icon: Users,
      searchPlaceholder: 'Search by name, ID, or department...',
      onSearch: (query) => setSearchTerm(query),
      onRefresh: fetchEmployees,
      onFilter: () => toast.info('Filter functionality coming soon'),
      onExport: () => toast.info('Export functionality coming soon'),
      isLoading: isLoading
    });
  }, [isLoading, setHeaderInfo]);

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.Fname || ''} ${emp.LName || ''}`.trim().toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      emp.idno.toString().includes(search) ||
      emp.EmplID.toString().includes(search) ||
      emp.Department?.toLowerCase().includes(search) ||
      emp.AssignedCompany?.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-700 border-gray-200';
    const s = status.toLowerCase();
    if (s.includes('active')) return 'bg-green-100 text-green-700 border-green-200';
    if (s.includes('leave')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (s.includes('probationary')) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '---';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0);
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.EmpStatus?.toLowerCase().includes('active')).length,
    onLeave: employees.filter(e => e.EmpStatus?.toLowerCase().includes('leave')).length,
    probationary: employees.filter(e => e.EmpStatus?.toLowerCase().includes('probationary')).length,
  };

  const handleDelete = async (empId: number) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;

    setIsDeleting(empId);
    try {
      const { error } = await supabase
        .from('EMPDETAILS')
        .delete()
        .eq('EmplID', empId);

      if (error) throw error;

      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete employee: ' + error.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (empId: number) => {
    navigate(`/master-data/employee-registration?id=${empId}`);
  };

  const handleView = (empId: number) => {
    navigate(`/master-data/employee-registration?id=${empId}&view=true`);
  };

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs text-slate-500 mt-1">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.onLeave}</div>
            <p className="text-xs text-slate-500 mt-1">Currently away</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Probationary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.probationary}</div>
            <p className="text-xs text-slate-500 mt-1">Newly joined</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>
              Showing {filteredEmployees.length} of {employees.length} employees
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Empl ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Position</TableHead>
                  <TableHead className="font-semibold text-slate-700 font-inter">Department</TableHead>
                  <TableHead className="font-semibold text-slate-700 font-inter">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 font-inter whitespace-nowrap">Hire Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right font-inter">Salary</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700 font-inter">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        <p className="text-slate-500 font-medium">Loading employees...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.idno} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-slate-900">{employee.EmplID}</TableCell>
                      <TableCell className="font-medium text-slate-900 whitespace-nowrap">
                        {`${employee.Fname || ''} ${employee.LName || ''}`.trim() || '---'}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs">{employee.Position || '---'}</TableCell>
                      <TableCell className="text-slate-600 text-xs">{employee.Department || '---'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(employee.EmpStatus)} text-[10px] uppercase font-bold px-1.5 py-0`}>
                          {employee.EmpStatus || '---'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 text-[10px] font-medium whitespace-nowrap">
                        {formatDate(employee.DTHired)}
                      </TableCell>
                      <TableCell className="text-slate-900 font-bold text-right text-xs">
                        {formatCurrency(employee.MonthlyRate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            onClick={() => handleView(employee.EmplID)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            onClick={() => handleEdit(employee.EmplID)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            disabled={isDeleting === employee.EmplID}
                            onClick={() => handleDelete(employee.EmplID)}
                          >
                            {isDeleting === employee.EmplID ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 text-slate-200" />
                        <p className="text-slate-500 font-medium font-inter">No employees found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your search or add a new employee.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
          <CardDescription>Employee distribution across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(
              employees.reduce((acc: Record<string, number>, curr) => {
                const dept = curr.Department || 'Other';
                acc[dept] = (acc[dept] || 0) + 1;
                return acc;
              }, {})
            ).map(([dept, count]) => (
              <div key={dept} className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50/50">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 capitalize">{dept}</p>
                  <p className="text-xs text-slate-500">{count} {count === 1 ? 'employee' : 'employees'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

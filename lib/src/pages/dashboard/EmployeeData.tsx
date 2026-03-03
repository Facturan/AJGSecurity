import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Download, Plus, Edit, Trash2, Eye } from 'lucide-react';
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

const employeesData = [
  {
    id: '354354',
    name: 'RIO FACTURAN',
    position: 'Staff',
    department: 'Operations',
    status: 'Active',
    salary: '₱18,000.00',
    hireDate: '2024-01-15'
  },
  {
    id: '354355',
    name: 'JUAN DELA CRUZ',
    position: 'Manager',
    department: 'IT',
    status: 'Active',
    salary: '₱35,000.00',
    hireDate: '2023-06-10'
  },
  {
    id: '354356',
    name: 'MARIA SANTOS',
    position: 'Supervisor',
    department: 'Finance',
    status: 'Active',
    salary: '₱25,000.00',
    hireDate: '2023-09-20'
  },
  {
    id: '354357',
    name: 'PEDRO REYES',
    position: 'Staff',
    department: 'HR',
    status: 'On Leave',
    salary: '₱18,000.00',
    hireDate: '2024-03-01'
  },
  {
    id: '354358',
    name: 'ANA GARCIA',
    position: 'Staff',
    department: 'Operations',
    status: 'Active',
    salary: '₱18,000.00',
    hireDate: '2024-02-14'
  },
  {
    id: '354359',
    name: 'CARLOS MENDOZA',
    position: 'Manager',
    department: 'Finance',
    status: 'Active',
    salary: '₱35,000.00',
    hireDate: '2022-11-05'
  },
  {
    id: '354360',
    name: 'ROSA FERNANDEZ',
    position: 'Supervisor',
    department: 'IT',
    status: 'Active',
    salary: '₱25,000.00',
    hireDate: '2023-04-18'
  },
  {
    id: '354361',
    name: 'LUIS RODRIGUEZ',
    position: 'Staff',
    department: 'Operations',
    status: 'Probationary',
    salary: '₱16,000.00',
    hireDate: '2025-12-01'
  },
];

export function EmployeeData() {
  const { setHeaderInfo } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHeaderInfo({ title: 'EMPLOYEE DATA', subtitle: 'Employee Records', searchPlaceholder: 'Search employee...' });
  }, []);

  const filteredEmployees = employeesData.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.includes(searchTerm) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'On Leave':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Probationary':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">245</div>
            <p className="text-xs text-slate-500 mt-1">8 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">230</div>
            <p className="text-xs text-slate-500 mt-1">93.9% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">8</div>
            <p className="text-xs text-slate-500 mt-1">3.3% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Probationary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">7</div>
            <p className="text-xs text-slate-500 mt-1">2.9% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            Showing {filteredEmployees.length} of {employeesData.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.salary}</TableCell>
                      <TableCell>{employee.hireDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No employees found
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Operations', count: 78, color: 'bg-blue-500' },
              { name: 'IT', count: 42, color: 'bg-purple-500' },
              { name: 'Finance', count: 35, color: 'bg-green-500' },
              { name: 'HR', count: 28, color: 'bg-orange-500' },
              { name: 'Marketing', count: 25, color: 'bg-pink-500' },
              { name: 'Sales', count: 20, color: 'bg-yellow-500' },
              { name: 'Admin', count: 12, color: 'bg-red-500' },
              { name: 'Others', count: 5, color: 'bg-gray-500' },
            ].map((dept) => (
              <div key={dept.name} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{dept.name}</p>
                  <p className="text-xs text-slate-500">{dept.count} employees</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

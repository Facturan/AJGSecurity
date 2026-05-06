import { useState, useEffect } from "react";
import { LeaveApplicationDialog } from "./LeaveApplication";
import { Search, Filter, Plus, User, Calendar, CreditCard, ChevronRight, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { useHeader } from "./components/Header";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface LeaveCredit {
  id: string;
  name: string;
  department: string;
  vl: number; // Vacation Leave
  sl: number; // Sick Leave
  el: number; // Emergency Leave
  bl: number; // Bereavement Leave
  total: number;
}

interface RecentApplication {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRecentApplications: RecentApplication[] = [
  { id: '1', employeeName: 'Sarah Johnson', type: 'Vacation', startDate: '2026-03-20', endDate: '2026-03-24', days: 5, status: 'pending' },
  { id: '2', employeeName: 'Michael Chen', type: 'Sick', startDate: '2026-03-10', endDate: '2026-03-11', days: 2, status: 'approved' },
  { id: '3', employeeName: 'Emily Rodriguez', type: 'Emergency', startDate: '2026-03-05', endDate: '2026-03-05', days: 1, status: 'rejected' },
];

const mockLeaveCredits: LeaveCredit[] = [
  { id: "1", name: "Sarah Johnson", department: "Engineering", vl: 12.5, sl: 8, el: 3, bl: 5, total: 28.5 },
  { id: "2", name: "Michael Chen", department: "Design", vl: 10, sl: 12, el: 2, bl: 0, total: 24 },
  { id: "3", name: "Emily Rodriguez", department: "Marketing", vl: 15, sl: 5, el: 5, bl: 2, total: 27 },
  { id: "4", name: "James Wilson", department: "Engineering", vl: 8.5, sl: 10, el: 1, bl: 0, total: 19.5 },
  { id: "5", name: "Sophia Lee", department: "Design", vl: 14, sl: 7, el: 4, bl: 1, total: 26 },
];

export function LeaveCreditView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const { setHeaderInfo } = useHeader();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setHeaderInfo({
      title: "Leave Credits",
      subtitle: "Employee Leave Balances",
      icon: FileText,
      showSearch: false,
      showPrimaryAction: false,
    });
  }, [setHeaderInfo]);

  const departments = Array.from(new Set(mockLeaveCredits.map(r => r.department))).sort();

  const filteredCredits = mockLeaveCredits.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "all" || record.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-6 lg:p-8">
      <LeaveApplicationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          // You could refresh data here if needed
          console.log("Application submitted successfully!");
        }}
      />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vacation Leave</p>
              <h3 className="text-2xl font-bold text-gray-900">12.5 Avg</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sick Leave</p>
              <h3 className="text-2xl font-bold text-gray-900">8.4 Avg</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Emergency Leave</p>
              <h3 className="text-2xl font-bold text-gray-900">3.2 Avg</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Bereavement</p>
              <h3 className="text-2xl font-bold text-gray-900">1.6 Avg</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-11 px-6 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50">
                <Filter className="w-5 h-5 text-gray-400" />
                Department: {filterDepartment === "all" ? "All" : filterDepartment}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterDepartment} onValueChange={setFilterDepartment}>
                <DropdownMenuRadioItem value="all">All Departments</DropdownMenuRadioItem>
                {departments.map((dept) => (
                  <DropdownMenuRadioItem key={dept} value={dept}>
                    {dept}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Leave Application
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vacation (VL)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sick (SL)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Emergency (EL)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Credit</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCredits.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {record.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-gray-900">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {record.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{record.vl}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{record.sl}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{record.el}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{record.total}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
            <FileText className="w-6 h-6 text-purple-600" />
            Recent Leave Applications
          </h2>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:bg-blue-50 tracking-widest uppercase">View All History</Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Days</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockRecentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-bold text-xs">
                          {app.employeeName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700">{app.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{app.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{new Date(app.startDate).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400 font-medium">to {new Date(app.endDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-6 bg-slate-100 rounded text-[11px] font-black text-slate-600">
                        {app.days}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        app.status === 'approved' ? "bg-green-100 text-green-700 border-green-200" :
                          app.status === 'rejected' ? "bg-red-100 text-red-700 border-red-200" :
                            "bg-orange-100 text-orange-700 border-orange-200"
                      )}>
                        {app.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> :
                          app.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                            <Clock className="w-3.5 h-3.5" />}
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

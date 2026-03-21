import { useState, useEffect, useMemo } from "react";
import { Search, Download, Filter, CheckCircle, XCircle, Clock, Users, User as UserIcon, Calendar } from "lucide-react";
import { useHeader } from "./components/Header";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface AttendanceRecord {
  id: string;
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late";
  hours: string;
  avatar: string;
}

const mockAttendance: AttendanceRecord[] = [
  { id: "1", name: "Sarah Johnson", department: "Engineering", checkIn: "08:45 AM", checkOut: "05:30 PM", status: "present", hours: "8.75", avatar: "SJ" },
  { id: "2", name: "Michael Chen", department: "Design", checkIn: "09:15 AM", checkOut: "05:45 PM", status: "late", hours: "8.5", avatar: "MC" },
  { id: "3", name: "Emily Rodriguez", department: "Marketing", checkIn: "08:30 AM", checkOut: "05:15 PM", status: "present", hours: "8.75", avatar: "ER" },
  { id: "4", name: "James Wilson", department: "Engineering", checkIn: "-", checkOut: "-", status: "absent", hours: "0", avatar: "JW" },
  { id: "5", name: "Lisa Anderson", department: "HR", checkIn: "08:55 AM", checkOut: "05:25 PM", status: "present", hours: "8.5", avatar: "LA" },
  { id: "6", name: "David Kim", department: "Sales", checkIn: "09:20 AM", checkOut: "06:00 PM", status: "late", hours: "8.67", avatar: "DK" },
  { id: "7", name: "Amanda White", department: "Design", checkIn: "08:40 AM", checkOut: "05:20 PM", status: "present", hours: "8.67", avatar: "AW" },
  { id: "8", name: "Robert Brown", department: "Engineering", checkIn: "08:50 AM", checkOut: "05:35 PM", status: "present", hours: "8.75", avatar: "RB" },
];

export function AttendanceView() {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchEmployeeId, setSearchEmployeeId] = useState<string>("");
  const { setHeaderInfo } = useHeader();
  const departments = useMemo(() =>
    Array.from(new Set(records.map(r => r.department))).sort()
    , [records]);

  useEffect(() => {
    setHeaderInfo({
      title: "Attendance",
      subtitle: "Monday, March 16, 2026",
      icon: Calendar,
      showSearch: false,
    });
  }, [setHeaderInfo, filterStatus, filterDepartment, departments]);

  const filteredAttendance = records.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    const matchesDept = filterDepartment === "all" || record.department === filterDepartment;
    
    // Employee ID filter (matching against record.id)
    const matchesId = !searchEmployeeId || record.id.toLowerCase().includes(searchEmployeeId.toLowerCase());
    
    // Date filter (For demo purposes, matching matchesSearch as records don't have full dates yet)
    // In a real app, you'd parse record.date and compare with fromDate/toDate
    
    return matchesSearch && matchesStatus && matchesDept && matchesId;
  });


  const getStatusBadge = (status: string) => {
    const styles = {
      present: "bg-green-100 text-green-700 border-green-200",
      late: "bg-orange-100 text-orange-700 border-orange-200",
      absent: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getStatusIcon = (status: string) => {
    if (status === "present") return <CheckCircle className="w-4 h-4" />;
    if (status === "late") return <Clock className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <fieldset className="border border-slate-200 rounded-xl px-4 pb-2 pt-1 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
          <legend className="px-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">From Date</legend>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full text-sm font-medium text-slate-700 focus:outline-none bg-transparent"
            />
          </div>
        </fieldset>

        <fieldset className="border border-slate-200 rounded-xl px-4 pb-2 pt-1 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
          <legend className="px-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">To Date</legend>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full text-sm font-medium text-slate-700 focus:outline-none bg-transparent"
            />
          </div>
        </fieldset>

        <fieldset className="border border-slate-200 rounded-xl px-4 pb-2 pt-1 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
          <legend className="px-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Employee ID</legend>
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Filter by ID..."
              value={searchEmployeeId}
              onChange={(e) => setSearchEmployeeId(e.target.value)}
              className="w-full text-sm font-medium text-slate-700 focus:outline-none bg-transparent placeholder:text-slate-300 font-bold"
            />
          </div>
        </fieldset>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Check In
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Check Out
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {record.avatar}
                      </div>
                      <span className="font-medium text-gray-900">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{record.department}</td>
                  <td className="px-6 py-4 text-gray-600">{record.checkIn}</td>
                  <td className="px-6 py-4 text-gray-600">{record.checkOut}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{record.hours}h</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                        record.status
                      )}`}
                    >
                      {getStatusIcon(record.status)}
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

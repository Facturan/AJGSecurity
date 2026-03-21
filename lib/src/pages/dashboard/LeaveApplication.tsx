import React, { useState, useEffect } from 'react';
import { Calendar, User, FileText, Send, CheckCircle, Clock, XCircle, Plus, Search, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { cn } from "./ui/utils";
import { supabase } from "../../lib/supabase";

interface Employee {
  EMPID: string;
  LName: string;
  FName: string;
}

interface LeaveApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const leaveTypes = ["Vacation Leave", "Sick Leave", "Emergency Leave", "Bereavement Leave", "Maternity/Paternity Leave"];

export function LeaveApplicationDialog({ open, onOpenChange, onSuccess }: LeaveApplicationDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  async function fetchEmployees() {
    try {
      const { data, error } = await supabase
        .from('EMPDETAILS')
        .select('EMPID, LName, FName')
        .order('LName', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !leaveType || !startDate || !endDate) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    onOpenChange(false);
    if (onSuccess) onSuccess();

    // Reset form
    setSelectedEmployee(null);
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <DialogHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-500" />
            Leave Application
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Fill out the form below to request a leave of absence.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee</label>
              <Popover open={openEmployee} onOpenChange={setOpenEmployee}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openEmployee}
                    className="w-full justify-between h-12 px-4 rounded-xl border-slate-200 text-slate-700 font-bold bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    {selectedEmployee
                      ? `${selectedEmployee.LName}, ${selectedEmployee.FName}`
                      : "Search employee..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 shadow-2xl border-slate-200" align="start">
                  <Command className="rounded-xl">
                    <CommandInput placeholder="Search by name or ID..." className="h-11 font-bold" />
                    <CommandList>
                      <CommandEmpty className="py-6 text-center text-slate-500 font-bold italic">No employee found.</CommandEmpty>
                      <CommandGroup heading="Employees">
                        {employees.map((emp) => (
                          <CommandItem
                            key={emp.EMPID}
                            onSelect={() => {
                              setSelectedEmployee(emp);
                              setOpenEmployee(false);
                            }}
                            className="py-3 px-4 font-bold text-slate-700 cursor-pointer aria-selected:bg-blue-50 aria-selected:text-blue-600 transition-colors"
                          >
                            <User className="mr-3 h-4 w-4 opacity-50" />
                            <div className="flex flex-col">
                              <span>{emp.LName}, {emp.FName}</span>
                              <span className="text-[10px] text-slate-400 font-medium tracking-tight">ID: {emp.EMPID}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Leave Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Leave Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-12 px-4 rounded-xl border-slate-200 text-slate-700 font-bold bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    {leaveType || "Select Type"}
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {leaveTypes.map(type => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setLeaveType(type)}
                      className="font-bold text-slate-700 py-2.5 px-4 cursor-pointer hover:bg-slate-50"
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Start Date */}
            <fieldset className="border border-slate-200 rounded-xl px-4 pb-2 pt-1 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200 bg-slate-50/30">
              <legend className="px-1 text-[10px] text-slate-400 font-black uppercase tracking-widest text-left">Start Date</legend>
              <div className="flex items-center h-7">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm font-bold text-slate-700 focus:outline-none bg-transparent"
                />
              </div>
            </fieldset>

            {/* End Date */}
            <fieldset className="border border-slate-200 rounded-xl px-4 pb-2 pt-1 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200 bg-slate-50/30">
              <legend className="px-1 text-[10px] text-slate-400 font-black uppercase tracking-widest text-left">End Date</legend>
              <div className="flex items-center h-7">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm font-bold text-slate-700 focus:outline-none bg-transparent"
                />
              </div>
            </fieldset>

            {/* Total Days & Reason */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50/50 rounded-xl p-4 flex flex-col items-center justify-center border border-blue-100 shadow-inner">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Total Days</span>
                <span className="text-3xl font-black text-blue-700 tracking-tighter">{calculateDays()}</span>
              </div>
              <div className="md:col-span-3">
                <fieldset className="border border-slate-200 rounded-xl px-4 pb-2 pt-1 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200 h-full bg-slate-50/30">
                  <legend className="px-1 text-[10px] text-slate-400 font-black uppercase tracking-widest text-left">Reason / Remarks</legend>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe the reason for leave..."
                    className="w-full text-sm font-bold text-slate-700 focus:outline-none bg-transparent resize-none h-10 placeholder:text-slate-300 placeholder:font-medium"
                  />
                </fieldset>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              variant="ghost"
              className="font-bold text-slate-500 px-8 hover:bg-slate-100 transition-colors"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 h-12 rounded-xl shadow-xl shadow-blue-500/20 gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

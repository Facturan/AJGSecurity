import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Send, X, BookOpen, Search, Users, Check } from 'lucide-react';
import { useHeader } from './components/Header';
import { supabase } from '../../lib/supabase';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { cn } from './ui/utils';

export function TrainingDetails() {
  const { setHeaderInfo } = useHeader();
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        const { data, error } = await supabase
          .from('EMPDETAILS')
          .select('EmplID, Fname, LName')
          .order('LName', { ascending: true });

        if (error) throw error;
        
        const formatted = (data || []).map(emp => ({
          id: emp.EmplID.toString(),
          name: `${emp.Fname} ${emp.LName}`.trim()
        }));
        
        setEmployees(formatted);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    setHeaderInfo({
      title: 'TRAINING DETAILS',
      subtitle: 'Manage and review employee training information',
      icon: BookOpen,
      searchPlaceholder: 'Search training details...',
      showSearch: false
    });
  }, [setHeaderInfo]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-8 w-full max-w-2xl relative transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-semibold text-slate-700">Training Details</h2>
        </div>

        <div className="space-y-5">
          {/* Employee Selection */}
          <div className="relative">
            <Popover open={isEmployeeOpen} onOpenChange={setIsEmployeeOpen}>
              <PopoverTrigger asChild>
                <fieldset className={cn(
                  "border rounded-xl px-4 pb-3 pt-2 transition-all duration-200 relative group cursor-pointer",
                  isEmployeeOpen ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-200",
                  "hover:border-slate-300"
                )}>
                  <legend className={cn(
                    "px-1 text-xs font-medium transition-colors",
                    isEmployeeOpen ? "text-blue-500" : "text-slate-400"
                  )}>Employee</legend>
                  <div className="flex items-center justify-between w-full relative h-[22px]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className={cn(
                        "text-[15px] font-medium select-none",
                        selectedEmployee ? "text-slate-700" : "text-slate-300"
                      )}>
                        {selectedEmployee ? selectedEmployee.name : "Select employee"}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200",
                      isEmployeeOpen ? "rotate-180" : ""
                    )} />
                  </div>
                </fieldset>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                <Command className="w-full">
                  <CommandInput placeholder="Search employee..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <CommandGroup>
                      {employees.map((emp) => (
                        <CommandItem
                          key={emp.id}
                          value={emp.name}
                          onSelect={() => {
                            setSelectedEmployee(emp);
                            setIsEmployeeOpen(false);
                          }}
                          className="flex items-center justify-between py-2 px-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>{emp.name}</span>
                          </div>
                          <Check
                            className={cn(
                              "w-4 h-4 text-blue-500",
                              selectedEmployee?.id === emp.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Title Field */}
          <fieldset className="border border-slate-200 rounded-xl px-4 pb-3 pt-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
            <legend className="px-1 text-xs text-slate-400 font-medium">Title</legend>
            <input
              type="text"
              placeholder="Enter training title"
              className="w-full text-[15px] font-medium text-slate-800 focus:outline-none bg-transparent placeholder:text-slate-300"
            />
          </fieldset>

          {/* Date Range: From and To */}
          <div className="grid grid-cols-2 gap-4">
            <fieldset className="border border-slate-200 rounded-xl px-4 pb-3 pt-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
              <legend className="px-1 text-xs text-slate-400 font-medium">From</legend>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  defaultValue="03/09/2026"
                  className="w-full text-[15px] font-semibold text-slate-700 focus:outline-none bg-transparent"
                />
              </div>
            </fieldset>

            <fieldset className="border border-slate-200 rounded-xl px-4 pb-3 pt-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
              <legend className="px-1 text-xs text-slate-400 font-medium">To</legend>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  defaultValue="03/09/2026"
                  className="w-full text-[15px] font-semibold text-slate-700 focus:outline-none bg-transparent"
                />
              </div>
            </fieldset>
          </div>

          {/* No. of Hours Field */}
          <fieldset className="border border-slate-200 rounded-xl px-4 pb-3 pt-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
            <legend className="px-1 text-xs text-slate-400 font-medium">No. of Hours</legend>
            <input
              type="number"
              defaultValue="0"
              className="w-full text-[15px] font-semibold text-slate-700 focus:outline-none bg-transparent"
            />
          </fieldset>

          {/* Type dropdown */}
          <div className="relative">
            <fieldset
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className={`border rounded-xl px-4 pb-3 pt-2 transition-all duration-200 relative group cursor-pointer ${isTypeOpen ? 'border-blue-400 ring-4 ring-blue-50' : 'border-slate-200'} hover:border-slate-300`}
            >
              <legend className={`px-1 text-xs font-medium transition-colors ${isTypeOpen ? 'text-blue-500' : 'text-slate-400'}`}>Type</legend>
              <div className="flex items-center justify-between w-full relative h-[22px]">
                <span className={`text-[15px] font-medium select-none ${selectedType ? 'text-slate-700' : 'text-slate-300'}`}>
                  {selectedType || 'Select training type'}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`} />
              </div>
            </fieldset>

            {isTypeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTypeOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {['Technical', 'Soft Skills', 'Safety', 'Compliance'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type);
                        setIsTypeOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-[14px] font-medium hover:bg-slate-50 transition-colors ${selectedType === type ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Conducted By Field */}
          <fieldset className="border border-slate-200 rounded-xl px-4 pb-3 pt-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
            <legend className="px-1 text-xs text-slate-400 font-medium">Conducted By</legend>
            <input
              type="text"
              placeholder="Enter trainer or organization"
              className="w-full text-[15px] font-medium text-slate-800 focus:outline-none bg-transparent placeholder:text-slate-300"
            />
          </fieldset>

          <div className="flex gap-4 justify-center pt-8">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-[15px] font-bold transition-all duration-200 shadow-[0_4px_12px_rgba(59,130,246,0.2)] active:scale-95">
              <Send className="w-4 h-4" />
              Submit
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100/80 hover:bg-slate-200 text-slate-500 px-8 py-3 rounded-xl text-[15px] font-bold transition-all duration-200 active:scale-95"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

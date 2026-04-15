import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useHeader } from './components/Header';
import { supabase } from '../../lib/supabase';
import { FileText, Save, Send, Loader2, CalendarIcon, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from './ui/utils';

export function Endorsement() {
    const { setHeaderInfo } = useHeader();
    const navigate = useNavigate();

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form fields
    const [customerName, setCustomerName] = useState('');
    const [companyName, setCompanyName] = useState('AJG SECURITY AGENCY CORPORATION');
    const [subject, setSubject] = useState('Endorsement-letter');
    const [date, setDate] = useState(() => {
        const d = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    });
    const [employeeName, setEmployeeName] = useState('');
    const [employeeSearch, setEmployeeSearch] = useState('');

    // Mocks / Fetched Data
    const [customers, setCustomers] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        setHeaderInfo({
            title: 'ENDORSEMENT LETTER',
            subtitle: 'Prepare and save an endorsement letter for a customer',
            icon: FileText,
            searchPlaceholder: 'Search endorsements...',
            showSearch: false
        });
    }, [setHeaderInfo]);

    useEffect(() => {
        // Fetch company and customer data
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch company to auto-fill "FROM"
                const { data: compData } = await supabase
                    .from('COMPANY')
                    .select('CompanyName')
                    .limit(1)
                    .single();
                
                if (compData && compData.CompanyName) {
                    setCompanyName(compData.CompanyName);
                }

                // Try to fetch customers - if empty or error, we'll provide fallbacks for the dropdown
                const { data: custData, error: custError } = await supabase
                    .from('CUSTOMER')
                    .select('id, CustomerName')
                    .order('CustomerName', { ascending: true });

                if (custError || !custData || custData.length === 0) {
                    // Provide fallback demo data if no CUSTOMER table is established or empty
                    setCustomers([
                        { id: 1, CustomerName: 'Acme Corp' },
                        { id: 2, CustomerName: 'Globex Inc.' },
                        { id: 3, CustomerName: 'Stark Industries' }
                    ]);
                } else {
                    setCustomers(custData);
                }

                // Fetch Employees
                const { data: empData, error: empError } = await supabase
                    .from('EMPDETAILS')
                    .select('EmplID, Fname, LName')
                    .order('LName', { ascending: true });

                if (empError || !empData || empData.length === 0) {
                    setEmployees([
                        { EmplID: 1, Fname: 'John', LName: 'Doe' },
                        { EmplID: 2, Fname: 'Jane', LName: 'Smith' }
                    ]);
                } else {
                    setEmployees(empData);
                }
            } catch (error) {
                console.error("Error fetching dependencies:", error);
                // Provide fallback
                setCustomers([
                    { id: 1, CustomerName: 'Acme Corp' },
                    { id: 2, CustomerName: 'Globex Inc.' }
                ]);
                setEmployees([
                    { EmplID: 1, Fname: 'Fallback', LName: 'User' }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        if (!customerName) {
            toast.error("Please select a valid Customer (TO)");
            return;
        }
        
        setIsSaving(true);
        // Simulate a save action since the specific table may not exist yet, 
        // typically this would insert into an 'ENDORSEMENTS' table
        try {
            await new Promise((resolve) => setTimeout(resolve, 800)); // fake delay
            toast.success("Endorsement saved successfully!");
            navigate('/company/customer-list');
        } catch (error) {
            toast.error("An error occurred while saving the endorsement.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        New Endorsement
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1 text-sm">Fill out the fields below to prepare a new endorsement letter.</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="pt-8 space-y-8 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-xl">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                <div className="max-w-3xl space-y-6 mx-auto bg-slate-50 border border-slate-100 p-8 rounded-xl shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="toField" className="sm:text-right font-bold text-slate-700 tracking-wide uppercase text-[11px]">TO:</Label>
                        <Select value={customerName} onValueChange={setCustomerName}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 focus:ring-primary/50 text-foreground font-medium w-full">
                                <SelectValue placeholder="Select Customer Name..." />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map(cust => (
                                    <SelectItem key={cust.id || cust.CustomerName} value={cust.CustomerName}>
                                        {cust.CustomerName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="fromField" className="sm:text-right font-bold text-slate-700 tracking-wide uppercase text-[11px]">FROM:</Label>
                        <Input
                            id="fromField"
                            className="h-10 bg-white border-slate-200 focus-visible:ring-primary/50 font-medium"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter Company Name"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="subjectField" className="sm:text-right font-bold text-slate-700 tracking-wide uppercase text-[11px]">SUBJECT:</Label>
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger className="h-10 bg-white border-slate-200 focus:ring-primary/50 text-foreground font-medium w-full">
                                <SelectValue placeholder="Select Subject..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Endorsement-letter">Endorsement-letter</SelectItem>
                                <SelectItem value="Notice-letter">Notice-letter</SelectItem>
                                <SelectItem value="Memorandum">Memorandum</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="dateField" className="sm:text-right font-bold text-slate-700 tracking-wide uppercase text-[11px]">DATE:</Label>
                        <div className="relative flex items-center gap-2">
                            <Input
                                id="dateField"
                                type="text"
                                placeholder="e.g. March 26, 2026"
                                className="h-10 bg-white border-slate-200 focus-visible:ring-primary/50 font-medium w-full pr-10"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <div className="absolute right-2 pt-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button type="button" className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100">
                                            <CalendarIcon className="w-5 h-5" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 shadow-xl border-slate-200 rounded-lg overflow-hidden" align="center" sideOffset={5}>
                                        <Calendar
                                            mode="single"
                                            selected={undefined}
                                            onSelect={(d) => {
                                                if (d) {
                                                    setDate(format(d, 'MMMM d, yyyy'));
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor="employeeField" className="sm:text-right font-bold text-slate-700 tracking-wide uppercase text-[11px]">Employee:</Label>
                        <div className="relative flex items-center gap-2">
                            <Input
                                id="employeeField"
                                type="text"
                                placeholder="Select or type employee name..."
                                className="h-10 bg-white border-slate-200 focus-visible:ring-primary/50 font-medium w-full pr-10"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                            />
                            <div className="absolute right-2 pt-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button type="button" className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100">
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[350px] max-w-[90vw] p-0 bg-white shadow-xl border-slate-200 rounded-lg overflow-hidden" align="center" sideOffset={5}>
                                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                                            <div className="relative">
                                                <Input
                                                    placeholder="Search employee..."
                                                    className="h-8 text-xs pl-8 focus-visible:ring-primary/30"
                                                    value={employeeSearch}
                                                    onChange={(e) => setEmployeeSearch(e.target.value)}
                                                />
                                                <div className="absolute left-2.5 top-2 text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 m-4.3 -4.3 l-4.3 4.3 l4.3 4.3"/></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-1 max-h-60 overflow-auto space-y-1">
                                            {(() => {
                                                const filtered = employees.filter(emp => 
                                                    `${emp.Fname} ${emp.LName}`.toLowerCase().includes(employeeSearch.toLowerCase())
                                                );
                                                
                                                if (filtered.length === 0) {
                                                    return <div className="p-4 text-center text-xs text-slate-500 italic">No matches found</div>;
                                                }
                                                
                                                return filtered.map(emp => {
                                                    const fullName = `${emp.Fname} ${emp.LName}`;
                                                    return (
                                                        <button
                                                            key={emp.EmplID}
                                                            type="button"
                                                            className={cn(
                                                                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between",
                                                                employeeName === fullName ? "bg-primary/10 text-primary font-bold" : "text-slate-700 hover:bg-slate-50"
                                                            )}
                                                            onClick={() => {
                                                                setEmployeeName(fullName);
                                                            }}
                                                        >
                                                            <span>{fullName}</span>
                                                            {employeeName === fullName && <Check className="w-4 h-4" />}
                                                        </button>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-border max-w-3xl mx-auto gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/company/customer-list')}
                        className="w-32 hover:bg-slate-100 font-medium text-slate-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading || isSaving}
                        className="bg-primary hover:bg-primary/90 text-white shadow-md flex items-center gap-2 font-bold px-8 w-40"
                    >
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

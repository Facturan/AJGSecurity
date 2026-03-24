import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Calendar, Shield, Bell, CheckCircle2, AlertTriangle, Plus, Hash, Layers, Tag, Target, FileText, Search, Pencil, Trash2, TrendingUp, Clock, XCircle, MoreVertical } from 'lucide-react';
import { useParams } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useHeader } from './components/Header';
import { useMasterData } from './MasterDataContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';

interface LicenseRecord {
    serialNo: string;
    kind: string;
    make: string;
    caliber: string;
    model: string;
    dateApproved: string;
    dateExpiry: string;
}

export function FirearmMasterData() {
    const { setHeaderInfo } = useHeader();
    const params = useParams();

    // The route is defined as /master-data/firearm-setup/* so params['*'] holds the sub-path
    // e.g. 'license', 'model', 'caliber', 'make', 'kind'
    const rawSegment = (params['*'] || 'model').split('/')[0].toLowerCase();
    const activeFirearmTab = rawSegment.charAt(0).toUpperCase() + rawSegment.slice(1);

    const [licenseRecords, setLicenseRecords] = useState<LicenseRecord[]>([
        { serialNo: '43', kind: 'PISTL', make: 'COLT', caliber: '38', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '43524', kind: 'SHTGN', make: 'ARMSCOR', caliber: '38', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '32432', kind: 'RVLVR', make: 'COLT', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '1111111', kind: 'RVLVR', make: 'COLT', caliber: '38', model: 'PATROL', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '1234324', kind: 'SHTGN', make: 'COLT', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '425452452525', kind: 'PISTL', make: 'ARMSCOR', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '3490958043', kind: 'RVLVR', make: 'COLT', caliber: '38', model: 'PATROL', dateApproved: '12-28-2016', dateExpiry: '12-28-2018' },
        { serialNo: '1055052', kind: 'PISTL', make: 'ARMSCOR', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2013', dateExpiry: '12-28-2018' },
        { serialNo: '9988776', kind: 'PISTL', make: 'GLOCK', caliber: '9MM', model: 'G-17', dateApproved: '03-15-2024', dateExpiry: '08-15-2026' }, // Demo: Expires in ~5 months
    ]);

    const [licenseForm, setLicenseForm] = useState({
        serialNo: '',
        dateApproved: new Date().toISOString().split('T')[0],
        dateExpiry: new Date().toISOString().split('T')[0],
        kind: '',
        make: '',
        caliber: '',
        model: '',
    });

    const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const stats = useMemo(() => {
        const today = new Date();
        let expiringSoon = 0;
        let expired = 0;
        let active = 0;

        licenseRecords.forEach(rec => {
            if (!rec.dateExpiry) return;
            const [m, d, y] = rec.dateExpiry.split('-').map(Number);
            const expiryDate = new Date(y, m - 1, d);
            const diffInDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (diffInDays < 0) {
                expired++;
            } else if (diffInDays <= 60) {
                expiringSoon++;
                active++;
            } else {
                active++;
            }
        });

        return { total: licenseRecords.length, active, expiringSoon, expired };
    }, [licenseRecords]);

    const filteredLicenses = useMemo(() => {
        return licenseRecords.filter(rec =>
            rec.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.kind.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.caliber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [licenseRecords, searchTerm]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate notifications (within 5 months) — memoized for stable reference
    const notifications = useMemo(() => licenseRecords.filter(record => {
        if (!record.dateExpiry) return false;
        const [m, d, y] = record.dateExpiry.split('-').map(Number);
        const expiryDate = new Date(y, m - 1, d);
        const today = new Date();
        const diffInMonths = (expiryDate.getFullYear() - today.getFullYear()) * 12 + (expiryDate.getMonth() - today.getMonth());
        return diffInMonths <= 5 && diffInMonths >= -1;
    }).sort((a, b) => {
        const dateA = new Date(a.dateExpiry.replace(/-/g, '/'));
        const dateB = new Date(b.dateExpiry.replace(/-/g, '/'));
        return dateA.getTime() - dateB.getTime();
    }), [licenseRecords]);

    const {
        firearmModels, firearmCalibers, firearmMakes, firearmKinds,
        addFirearmModel, addFirearmCaliber, addFirearmMake, addFirearmKind
    } = useMasterData();

    const setupMap: Record<string, { label: string, data: string[], addFn: (n: string) => void }> = {
        'Model': { label: 'Model', data: firearmModels, addFn: addFirearmModel },
        'Caliber': { label: 'Caliber', data: firearmCalibers, addFn: addFirearmCaliber },
        'Make': { label: 'Make', data: firearmMakes, addFn: addFirearmMake },
        'Kind': { label: 'Kind', data: firearmKinds, addFn: addFirearmKind },
    };

    const config = setupMap[activeFirearmTab];

    useEffect(() => {
        const titles: Record<string, string> = {
            'Model': 'FIREARM MODEL',
            'Caliber': 'FIREARM CALIBER',
            'Make': 'FIREARM MAKE',
            'Kind': 'FIREARM KIND',
            'License': 'FIREARM LICENSE'
        };

        const subtitles: Record<string, string> = {
            'License': 'Fire Arm License Entry',
        };

        setHeaderInfo({
            title: titles[activeFirearmTab] || 'FIREARM SETUP',
            subtitle: subtitles[activeFirearmTab] ?? 'Global configuration for firearm records',
            icon: Shield,
            showSearch: activeFirearmTab === 'License',
            onSearch: activeFirearmTab === 'License' ? setSearchTerm : undefined,
            searchPlaceholder: 'Search by SN, make, or model...',
            leftActions: undefined,
            customActions: activeFirearmTab === 'License' ? (
                <>
                    <div className="relative shrink mr-2" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className={cn(
                                "relative w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center transition-all",
                                notifOpen ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Bell size={18} />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
                            )}
                        </button>

                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-border bg-muted/30">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-foreground">License Notifications</h3>
                                            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {notifications.length} Alerts
                                            </span>
                                        </div>
                                    </div>
                                    <div className="max-h-[360px] overflow-y-auto p-2 space-y-2 scrollbar-hide">
                                        {notifications.length > 0 ? (
                                            notifications.map((record, idx) => (
                                                <div key={idx} className="p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors group">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                                            <AlertTriangle size={14} className="text-amber-500" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-xs font-bold text-foreground truncate">{record.make} {record.model}</span>
                                                            <span className="text-[10px] text-muted-foreground font-medium">SN: {record.serialNo}</span>
                                                            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold py-1 px-2 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20 w-fit">
                                                                <Calendar size={10} />
                                                                Expires: {record.dateExpiry}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                                                    <CheckCircle2 size={24} className="text-muted-foreground/30" />
                                                </div>
                                                <p className="text-xs font-bold text-muted-foreground">No pending expirations</p>
                                                <p className="text-[10px] text-muted-foreground/60 mt-1">All licenses are up to date</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-muted/20 border-t border-border mt-1">
                                        <button className="w-full py-2 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors uppercase tracking-widest">
                                            View All Records
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <Button onClick={() => setIsLicenseModalOpen(true)} className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 border-none gap-2 ml-8">
                        <Plus size={16} strokeWidth={3} /> Register Firearms
                    </Button>
                </>
            ) : undefined
        });
    }, [activeFirearmTab, setHeaderInfo, notifOpen, notifications, notifRef]);

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <div key={activeFirearmTab}>
                {(() => {
                    if (activeFirearmTab === 'License') {
                        const handleSaveLicense = () => {
                            if (!licenseForm.serialNo) return;
                            setLicenseRecords(prev => [...prev, {
                                serialNo: licenseForm.serialNo,
                                kind: licenseForm.kind,
                                make: licenseForm.make,
                                caliber: licenseForm.caliber,
                                model: licenseForm.model,
                                dateApproved: licenseForm.dateApproved
                                    ? new Date(licenseForm.dateApproved).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                                    : '',
                                dateExpiry: licenseForm.dateExpiry
                                    ? new Date(licenseForm.dateExpiry).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                                    : '',
                            }]);
                            setLicenseForm({
                                serialNo: '',
                                dateApproved: new Date().toISOString().split('T')[0],
                                dateExpiry: new Date().toISOString().split('T')[0],
                                kind: '',
                                make: '',
                                caliber: '',
                                model: '',
                            });
                        };

                        return (
                            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                                {/* Header & Stats Section */}
                                <div className="space-y-6">
                                    <Dialog open={isLicenseModalOpen} onOpenChange={setIsLicenseModalOpen}>
                                        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-0 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] rounded-3xl">
                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex flex-col justify-center">
                                                <DialogHeader className="p-0 border-none space-y-1">
                                                    <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
                                                        <Shield className="w-6 h-6 text-blue-200" />
                                                        Add License
                                                    </DialogTitle>
                                                    <p className="text-blue-100 text-sm mt-1 opacity-90 font-medium">Enter the details to register a new firearm license.</p>
                                                </DialogHeader>
                                            </div>

                                            <div className="p-6">
                                                <div className="grid grid-cols-2 gap-5">
                                                    <div className="col-span-2 space-y-1.5">
                                                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Serial Number</Label>
                                                        <div className="relative group">
                                                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                            <Input
                                                                id="serialNo"
                                                                value={licenseForm.serialNo}
                                                                onChange={(e) => setLicenseForm({ ...licenseForm, serialNo: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-bold shadow-sm"
                                                                placeholder="e.g. 123456789"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Date Approved</Label>
                                                        <Input
                                                            type="date"
                                                            value={licenseForm.dateApproved}
                                                            onChange={(e) => setLicenseForm({ ...licenseForm, dateApproved: e.target.value })}
                                                            className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Date Expiry</Label>
                                                        <Input
                                                            type="date"
                                                            value={licenseForm.dateExpiry}
                                                            onChange={(e) => setLicenseForm({ ...licenseForm, dateExpiry: e.target.value })}
                                                            className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Kind</Label>
                                                        <div className="relative group">
                                                            <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                                            <Select value={licenseForm.kind} onValueChange={(val) => setLicenseForm({ ...licenseForm, kind: val })}>
                                                                <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm">
                                                                    <SelectValue placeholder="Select Kind" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {firearmKinds.map(k => (
                                                                        <SelectItem key={k} value={k}>{k}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Make</Label>
                                                        <div className="relative group">
                                                            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                                            <Select value={licenseForm.make} onValueChange={(val) => setLicenseForm({ ...licenseForm, make: val })}>
                                                                <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm">
                                                                    <SelectValue placeholder="Select Make" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {firearmMakes.map(m => (
                                                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Caliber</Label>
                                                        <div className="relative group">
                                                            <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                                            <Select value={licenseForm.caliber} onValueChange={(val) => setLicenseForm({ ...licenseForm, caliber: val })}>
                                                                <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm">
                                                                    <SelectValue placeholder="Select Caliber" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {firearmCalibers.map(c => (
                                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Model</Label>
                                                        <div className="relative group">
                                                            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                                            <Select value={licenseForm.model} onValueChange={(val) => setLicenseForm({ ...licenseForm, model: val })}>
                                                                <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm">
                                                                    <SelectValue placeholder="Select Model" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {firearmModels.map(mo => (
                                                                        <SelectItem key={mo} value={mo}>{mo}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end mt-8">
                                                    <Button onClick={() => {
                                                        handleSaveLicense();
                                                        setIsLicenseModalOpen(false);
                                                    }} className="h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 border-none">
                                                        Save License
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Card className="border-none shadow-sm bg-blue-50/50 hover:bg-blue-50 transition-colors rounded-3xl overflow-hidden group">
                                            <CardContent className="p-5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                                    <Shield size={22} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-blue-600/70 uppercase tracking-widest">Total Licenses</p>
                                                    <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-none shadow-sm bg-emerald-50/50 hover:bg-emerald-50 transition-colors rounded-3xl overflow-hidden group">
                                            <CardContent className="p-5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                                    <TrendingUp size={22} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-emerald-600/70 uppercase tracking-widest">Active Safe</p>
                                                    <p className="text-2xl font-black text-slate-800">{stats.active - stats.expiringSoon}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-none shadow-sm bg-amber-50/50 hover:bg-amber-50 transition-colors rounded-3xl overflow-hidden group">
                                            <CardContent className="p-5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                                    <Clock size={22} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-amber-600/70 uppercase tracking-widest">Expiring Soon</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-2xl font-black text-slate-800">{stats.expiringSoon}</p>
                                                        {stats.expiringSoon > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-none shadow-sm bg-rose-50/50 hover:bg-rose-50 transition-colors rounded-3xl overflow-hidden group">
                                            <CardContent className="p-5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                                                    <XCircle size={22} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-rose-600/70 uppercase tracking-widest">Expired</p>
                                                    <p className="text-2xl font-black text-slate-800">{stats.expired}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="space-y-4">
                                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="w-full overflow-x-auto">
                                                <table className="w-full text-sm border-collapse min-w-[1000px]">
                                                    <thead>
                                                        <tr className="bg-slate-800 border-b border-slate-700">
                                                            <th className="px-6 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">Serial Number</th>
                                                            <th className="px-4 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">Kind</th>
                                                            <th className="px-4 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">Make</th>
                                                            <th className="px-4 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">Model</th>
                                                            <th className="px-4 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">Caliber</th>
                                                            <th className="px-6 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">Registered</th>
                                                            <th className="px-6 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">Validity Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {filteredLicenses.map((rec, i) => {
                                                            const today = new Date();
                                                            const [m, d, y] = rec.dateExpiry.split('-').map(Number);
                                                            const expiryDate = new Date(y, m - 1, d);
                                                            const diffInDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                                            let statusColor = "bg-emerald-100 text-emerald-700 ring-emerald-500/10";
                                                            let statusText = "Active";

                                                            if (diffInDays < 0) {
                                                                statusColor = "bg-rose-100 text-rose-700 ring-rose-500/10 border-rose-200";
                                                                statusText = "Expired";
                                                            } else if (diffInDays <= 60) {
                                                                statusColor = "bg-amber-100 text-amber-700 ring-amber-500/10 border-amber-200";
                                                                statusText = "Expiring Soon";
                                                            }

                                                            return (
                                                                <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                                                                    <td className="px-6 py-4 text-center">
                                                                        <span className="text-sm font-black text-slate-700 tracking-tight">{rec.serialNo}</span>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-center">
                                                                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100/50">{rec.kind}</span>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-center">
                                                                        <span className="text-sm font-bold text-slate-700">{rec.make}</span>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-center">
                                                                        <span className="text-sm font-bold text-slate-700">{rec.model}</span>
                                                                    </td>
                                                                    <td className="px-4 py-4 text-center">
                                                                        <span className="text-xs font-bold text-slate-500">{rec.caliber}</span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <span className="text-xs font-bold text-slate-600">{rec.dateApproved}</span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex flex-col items-center gap-1.5">
                                                                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", statusColor)}>
                                                                                {statusText}
                                                                            </span>
                                                                            <span className="text-[10px] font-bold text-slate-400">{rec.dateExpiry}</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        );
                    }

                    // For Model, Caliber, Make, Kind
                    if (!config) return null;

                    return (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Add New {config.label}</CardTitle>
                                            <CardDescription className="text-xs font-medium text-slate-500">Register a new entry in the master data.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Name / Description</Label>
                                            <div className="flex gap-3">
                                                <Input
                                                    placeholder={`Enter ${config.label} name...`}
                                                    className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-bold shadow-sm"
                                                    id="setupInput"
                                                />
                                                <Button
                                                    onClick={() => {
                                                        const el = document.getElementById('setupInput') as HTMLInputElement;
                                                        if (el.value) {
                                                            config.addFn(el.value);
                                                            el.value = '';
                                                        }
                                                    }}
                                                    className="h-12 px-6 bg-slate-800 text-white font-black rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 hover:-translate-y-0.5"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Existing {config.label}s</CardTitle>
                                            <CardDescription className="text-xs font-medium text-slate-500">View and manage current registry.</CardDescription>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                                            {config.data.length}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                        {config.data.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl bg-white hover:bg-slate-50 transition-all group shadow-sm hover:shadow-md">
                                                <p className="font-bold text-slate-700">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

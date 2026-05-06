import { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import {
    Calendar, Shield, CheckCircle2, AlertTriangle, Plus, Hash,
    Layers, Tag, Target, FileText, TrendingUp, Clock, XCircle, Archive
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';
import { useMasterData } from '../MasterDataContext';

interface Props {
    searchTerm: string;
    notifOpen: boolean;
    notifRef: React.RefObject<HTMLDivElement | null>;
}

export function LicenseSetup({ searchTerm, notifOpen, notifRef }: Props) {
    const {
        firearmKinds, firearmMakes, firearmCalibers, firearmModels,
        licenseRecords, addLicenseRecord, softDeleteLicense,
    } = useMasterData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [licenseForm, setLicenseForm] = useState({
        serialNo: '',
        dateApproved: new Date().toISOString().split('T')[0],
        dateExpiry: new Date().toISOString().split('T')[0],
        kind: '', make: '', caliber: '', model: '',
    });

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const today = new Date();
        let expiringSoon = 0, expired = 0, active = 0;
        licenseRecords.forEach(rec => {
            if (!rec.dateExpiry) return;
            const [m, d, y] = rec.dateExpiry.split('-').map(Number);
            const diff = Math.ceil((new Date(y, m - 1, d).getTime() - today.getTime()) / 86400000);
            if (diff < 0) { expired++; }
            else if (diff <= 60) { expiringSoon++; active++; }
            else { active++; }
        });
        return { total: licenseRecords.length, active, expiringSoon, expired };
    }, [licenseRecords]);

    // ── Notifications (expiring within 5 months) ──────────────────────────────
    const notifications = useMemo(() =>
        licenseRecords.filter(rec => {
            if (!rec.dateExpiry) return false;
            const [m, d, y] = rec.dateExpiry.split('-').map(Number);
            const today = new Date();
            const expiryDate = new Date(y, m - 1, d);
            const diff = (expiryDate.getFullYear() - today.getFullYear()) * 12
                + (expiryDate.getMonth() - today.getMonth());
            return diff <= 5 && diff >= -1;
        }).sort((a, b) =>
            new Date(a.dateExpiry.replace(/-/g, '/')).getTime() -
            new Date(b.dateExpiry.replace(/-/g, '/')).getTime()
        ), [licenseRecords]);

    // ── Filtered table ────────────────────────────────────────────────────────
    const filteredLicenses = useMemo(() =>
        licenseRecords.filter(rec =>
            [rec.serialNo, rec.make, rec.model, rec.kind, rec.caliber]
                .some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
        ), [licenseRecords, searchTerm]);

    // ── Save handler ──────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!licenseForm.serialNo) return;
        setIsSaving(true);
        const fmt = (d: string) => d
            ? new Date(d).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-')
            : '';
        try {
            await addLicenseRecord({
                serialNo: licenseForm.serialNo,
                kind: licenseForm.kind,
                make: licenseForm.make,
                caliber: licenseForm.caliber,
                model: licenseForm.model,
                dateApproved: fmt(licenseForm.dateApproved),
                dateExpiry: fmt(licenseForm.dateExpiry),
            });
            setLicenseForm({
                serialNo: '', dateApproved: new Date().toISOString().split('T')[0],
                dateExpiry: new Date().toISOString().split('T')[0],
                kind: '', make: '', caliber: '', model: '',
            });
            setIsModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    // ── Soft delete handler ───────────────────────────────────────────────────
    const handleArchive = async (id?: number) => {
        if (!id) return;
        if (!confirm('Archive this license? It will be hidden from the active list.')) return;
        await softDeleteLicense(id);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* ── Notification Dropdown ─────────────────────────────────────────── */}
            <div className="fixed top-16 right-6 z-[100]" ref={notifRef}>
                <AnimatePresence>
                    {notifOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-border bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-foreground">License Notifications</h3>
                                    <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {notifications.length} Alerts
                                    </span>
                                </div>
                            </div>
                            <div className="max-h-[360px] overflow-y-auto p-2 space-y-2">
                                {notifications.length > 0 ? notifications.map((rec, idx) => (
                                    <div key={idx} className="p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                                <AlertTriangle size={14} className="text-amber-500" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-foreground truncate">{rec.make} {rec.model}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium">SN: {rec.serialNo}</span>
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold py-1 px-2 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20 w-fit">
                                                    <Calendar size={10} />
                                                    Expires: {rec.dateExpiry}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
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

            {/* ── Page Header + Register Button ─────────────────────────────────── */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">License Entry</h2>
                        <p className="text-xs font-medium text-slate-500">Manage and monitor firearm registration records.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 border-none"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span>REGISTER FIREARMS</span>
                    </motion.button>
                </div>

                {/* ── Register Modal ─────────────────────────────────────────────── */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-0 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] rounded-3xl">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex flex-col justify-center">
                            <DialogHeader className="p-0 border-none space-y-1">
                                <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-blue-200" />Register Firearms
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
                                        <Input value={licenseForm.serialNo}
                                            onChange={e => setLicenseForm({ ...licenseForm, serialNo: e.target.value })}
                                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-bold shadow-sm"
                                            placeholder="e.g. 123456789" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Date Approved</Label>
                                    <Input type="date" value={licenseForm.dateApproved}
                                        onChange={e => {
                                            const approved = e.target.value;
                                            // Auto-calculate expiry = approved + 5 months
                                            let expiry = '';
                                            if (approved) {
                                                const d = new Date(approved);
                                                d.setMonth(d.getMonth() + 5);
                                                expiry = d.toISOString().split('T')[0];
                                            }
                                            setLicenseForm({ ...licenseForm, dateApproved: approved, dateExpiry: expiry });
                                        }}
                                        className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm" />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">
                                        Date Expiry
                                        <span className="ml-2 text-[9px] font-semibold text-blue-400 normal-case tracking-normal"></span>
                                    </Label>
                                    <Input type="date" value={licenseForm.dateExpiry}
                                        onChange={e => setLicenseForm({ ...licenseForm, dateExpiry: e.target.value })}
                                        className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-semibold shadow-sm" />
                                </div>

                                {/* Kind */}
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Kind</Label>
                                    <div className="relative group">
                                        <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                                        <Select value={licenseForm.kind} onValueChange={val => setLicenseForm({ ...licenseForm, kind: val })}>
                                            <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-slate-800 font-semibold shadow-sm">
                                                <SelectValue placeholder="Select Kind" />
                                            </SelectTrigger>
                                            <SelectContent>{firearmKinds.map(k => <SelectItem key={k.id} value={k.name}>{k.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Make */}
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Make</Label>
                                    <div className="relative group">
                                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                                        <Select value={licenseForm.make} onValueChange={val => setLicenseForm({ ...licenseForm, make: val })}>
                                            <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-slate-800 font-semibold shadow-sm">
                                                <SelectValue placeholder="Select Make" />
                                            </SelectTrigger>
                                            <SelectContent>{firearmMakes.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Caliber */}
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Caliber</Label>
                                    <div className="relative group">
                                        <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                                        <Select value={licenseForm.caliber} onValueChange={val => setLicenseForm({ ...licenseForm, caliber: val })}>
                                            <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-slate-800 font-semibold shadow-sm">
                                                <SelectValue placeholder="Select Caliber" />
                                            </SelectTrigger>
                                            <SelectContent>{firearmCalibers.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Model */}
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Model</Label>
                                    <div className="relative group">
                                        <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                                        <Select value={licenseForm.model} onValueChange={val => setLicenseForm({ ...licenseForm, model: val })}>
                                            <SelectTrigger className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-slate-800 font-semibold shadow-sm">
                                                <SelectValue placeholder="Select Model" />
                                            </SelectTrigger>
                                            <SelectContent>{firearmModels.map(mo => <SelectItem key={mo.id} value={mo.name}>{mo.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <Button onClick={handleSave} disabled={isSaving}
                                    className="h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 border-none">
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ── Stats Grid ─────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { 
                            label: 'Total Licenses', value: stats.total, color: 'blue', Icon: Shield,
                            cardCls: 'bg-blue-50/50 hover:bg-blue-50 border-blue-100/50',
                            iconCls: 'bg-blue-600 shadow-blue-200',
                            labelCls: 'text-blue-700/70',
                            indCls: 'bg-blue-500'
                        },
                        { 
                            label: 'Active Safe', value: stats.active - stats.expiringSoon, color: 'emerald', Icon: TrendingUp,
                            cardCls: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100/50',
                            iconCls: 'bg-emerald-600 shadow-emerald-200',
                            labelCls: 'text-emerald-700/70',
                            indCls: 'bg-emerald-500'
                        },
                        { 
                            label: 'Expiring Soon', value: stats.expiringSoon, color: 'amber', Icon: Clock, pulse: stats.expiringSoon > 0,
                            cardCls: 'bg-amber-50/50 hover:bg-amber-50 border-amber-100/50',
                            iconCls: 'bg-amber-600 shadow-amber-200',
                            labelCls: 'text-amber-700/70',
                            indCls: 'bg-amber-500'
                        },
                        { 
                            label: 'Expired', value: stats.expired, color: 'rose', Icon: XCircle,
                            cardCls: 'bg-rose-50/50 hover:bg-rose-50 border-rose-100/50',
                            iconCls: 'bg-rose-600 shadow-rose-200',
                            labelCls: 'text-rose-700/70',
                            indCls: 'bg-rose-500'
                        },
                    ].map(({ label, value, Icon, pulse, cardCls, iconCls, labelCls, indCls }) => (
                        <Card key={label} className={cn("border-none shadow-sm transition-all duration-300 rounded-3xl overflow-hidden group border", cardCls)}>
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300", iconCls)}>
                                    <Icon size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className={cn("text-[11px] font-black uppercase tracking-widest", labelCls)}>{label}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-black text-slate-800">{value}</p>
                                        {pulse && <span className={cn("w-2 h-2 rounded-full animate-pulse", indCls)} />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* ── License Table ──────────────────────────────────────────────────── */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="w-full max-h-[600px] overflow-auto scrollbar-hide">
                        <table className="w-full text-sm border-collapse min-w-[1100px]">
                            <thead className="sticky top-0 z-20 shadow-sm">
                                <tr className="bg-slate-800 border-b border-slate-700">
                                    {['Serial Number', 'Kind', 'Make', 'Model', 'Caliber', 'Registered', 'Validity Status', 'Action'].map(col => (
                                        <th key={col} className="px-5 py-5 text-center font-black text-[12px] text-slate-300 uppercase tracking-[0.2em]">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredLicenses.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-slate-400 font-medium text-sm">
                                            No license records found.
                                        </td>
                                    </tr>
                                )}
                                {filteredLicenses.map((rec, i) => {
                                    const today = new Date();
                                    const [m, d, y] = rec.dateExpiry.split('-').map(Number);
                                    const diff = Math.ceil((new Date(y, m - 1, d).getTime() - today.getTime()) / 86400000);
                                    const statusColor = diff < 0
                                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                                        : diff <= 60
                                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                                            : 'bg-emerald-100 text-emerald-700 ring-emerald-500/10';
                                    const statusText = diff < 0 ? 'Expired' : diff <= 60 ? 'Expiring Soon' : 'Active';
                                    return (
                                        <tr key={rec.id ?? i} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-5 py-4 text-center"><span className="text-sm font-black text-slate-700">{rec.serialNo}</span></td>
                                            <td className="px-4 py-4 text-center"><span className="text-[11px] font-extrabold text-slate-500 uppercase px-2 py-0.5 rounded-md bg-slate-100/50">{rec.kind}</span></td>
                                            <td className="px-4 py-4 text-center"><span className="text-sm font-bold text-slate-700">{rec.make}</span></td>
                                            <td className="px-4 py-4 text-center"><span className="text-sm font-bold text-slate-700">{rec.model}</span></td>
                                            <td className="px-4 py-4 text-center"><span className="text-xs font-bold text-slate-500">{rec.caliber}</span></td>
                                            <td className="px-5 py-4 text-center"><span className="text-xs font-bold text-slate-600">{rec.dateApproved}</span></td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border', statusColor)}>{statusText}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{rec.dateExpiry}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => handleArchive(rec.id)}
                                                    title="Archive license"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                                                >
                                                    <Archive size={12} />
                                                    Archive
                                                </button>
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
    );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { AlertCircle, Calendar } from 'lucide-react';
import { useLocation } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useHeader } from './components/Header';
import { useMasterData } from './MasterDataContext';

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
    const location = useLocation();

    // Extract the section from the URL path (defaults to 'model' if just /firearm-setup)
    const pathSegment = location.pathname.split('/').filter(Boolean).pop() || 'model';
    // Match the UI casing expectation
    const activeFirearmTab = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1).toLowerCase();

    const [licenseForm, setLicenseForm] = useState({
        serialNo: '',
        dateApproved: new Date().toISOString().split('T')[0],
        dateExpiry: new Date().toISOString().split('T')[0],
        kind: '',
        make: '',
        caliber: '',
        model: '',
    });

    const [licenseRecords, setLicenseRecords] = useState<LicenseRecord[]>([
        { serialNo: '43', kind: 'PISTL', make: 'COLT', caliber: '38', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '43524', kind: 'SHTGN', make: 'ARMSCOR', caliber: '38', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '32432', kind: 'RVLVR', make: 'COLT', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '1111111', kind: 'RVLVR', make: 'COLT', caliber: '38', model: 'PATROL', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '1234324', kind: 'SHTGN', make: 'COLT', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '425452452525', kind: 'PISTL', make: 'ARMSCOR', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2018', dateExpiry: '12-28-2018' },
        { serialNo: '3490958043', kind: 'RVLVR', make: 'COLT', caliber: '38', model: 'PATROL', dateApproved: '12-28-2016', dateExpiry: '12-28-2018' },
        { serialNo: '1055052', kind: 'PISTL', make: 'ARMSCOR', caliber: '12GA', model: 'M-30', dateApproved: '12-28-2013', dateExpiry: '12-28-2018' },
    ]);

    const {
        firearmModels, firearmCalibers, firearmMakes, firearmKinds,
        addFirearmModel, addFirearmCaliber, addFirearmMake, addFirearmKind
    } = useMasterData();

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
            showSearch: false,
        });
    }, [activeFirearmTab, setHeaderInfo]);

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
                            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                                {/* Entry Form */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Left: Form Fields */}
                                            <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[320px]">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <Label className="text-slate-700 font-semibold sm:w-32 shrink-0 sm:text-right">Serial Number:</Label>
                                                    <Input
                                                        id="serialNo"
                                                        value={licenseForm.serialNo}
                                                        onChange={(e) => setLicenseForm({ ...licenseForm, serialNo: e.target.value })}
                                                        className="h-9 sm:h-7 text-sm"
                                                    />
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <Label className="text-slate-700 font-semibold sm:w-32 shrink-0 sm:text-right">Date Approved:</Label>
                                                    <Input
                                                        type="date"
                                                        value={licenseForm.dateApproved}
                                                        onChange={(e) => setLicenseForm({ ...licenseForm, dateApproved: e.target.value })}
                                                        className="h-9 sm:h-7 text-sm"
                                                    />
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <Label className="text-slate-700 font-semibold sm:w-32 shrink-0 sm:text-right">Date Expiry:</Label>
                                                    <Input
                                                        type="date"
                                                        value={licenseForm.dateExpiry}
                                                        onChange={(e) => setLicenseForm({ ...licenseForm, dateExpiry: e.target.value })}
                                                        className="h-9 sm:h-7 text-sm"
                                                    />
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <Label className="text-slate-700 font-semibold sm:w-32 shrink-0 sm:text-right">Kind:</Label>
                                                    <Select value={licenseForm.kind} onValueChange={(val) => setLicenseForm({ ...licenseForm, kind: val })}>
                                                        <SelectTrigger className="h-9 sm:h-7 text-sm">
                                                            <SelectValue placeholder="" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {firearmKinds.map(k => (
                                                                <SelectItem key={k} value={k}>{k}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <Label className="text-slate-700 font-semibold sm:w-32 shrink-0 sm:text-right">Make:</Label>
                                                    <Select value={licenseForm.make} onValueChange={(val) => setLicenseForm({ ...licenseForm, make: val })}>
                                                        <SelectTrigger className="h-9 sm:h-7 text-sm">
                                                            <SelectValue placeholder="" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {firearmMakes.map(m => (
                                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <Label className="text-slate-700 font-semibold sm:w-32 shrink-0 sm:text-right">Caliber:</Label>
                                                    <Select value={licenseForm.caliber} onValueChange={(val) => setLicenseForm({ ...licenseForm, caliber: val })}>
                                                        <SelectTrigger className="h-9 sm:h-7 text-sm">
                                                            <SelectValue placeholder="" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {firearmCalibers.map(c => (
                                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <Label className="text-slate-700 font-semibold sm:w-32 shrink-0 sm:text-right">Model:</Label>
                                                    <Select value={licenseForm.model} onValueChange={(val) => setLicenseForm({ ...licenseForm, model: val })}>
                                                        <SelectTrigger className="h-9 sm:h-7 text-sm">
                                                            <SelectValue placeholder="" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {firearmModels.map(mo => (
                                                                <SelectItem key={mo} value={mo}>{mo}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex justify-end mt-2">
                                                    <Button size="sm" onClick={handleSaveLicense} className="w-full sm:w-auto">Save</Button>
                                                </div>
                                            </div>

                                            {/* Right: Table */}
                                            <div className="flex-1 overflow-x-auto">
                                                <table className="w-full text-sm border-collapse min-w-[600px]">
                                                    <thead>
                                                        <tr className="bg-slate-800 text-white">
                                                            <th className="border border-slate-700 px-3 py-2 text-center font-semibold whitespace-nowrap tracking-wide text-xs uppercase">SERIAL NO.</th>
                                                            <th className="border border-slate-700 px-3 py-2 text-center font-semibold whitespace-nowrap tracking-wide text-xs uppercase">KIND / MAKE / CALIBER / MODEL</th>
                                                            <th className="border border-slate-700 px-3 py-2 text-center font-semibold whitespace-nowrap tracking-wide text-xs uppercase">DATE APPROVED</th>
                                                            <th className="border border-slate-700 px-3 py-2 text-center font-semibold whitespace-nowrap tracking-wide text-xs uppercase">DATE EXPIRY</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {licenseRecords.map((rec, i) => (
                                                            <tr key={i} className={i % 2 === 0 ? 'bg-white text-slate-800 hover:bg-slate-50' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'}>
                                                                <td className="border border-slate-200 px-3 py-1.5 text-center text-sm">{rec.serialNo}</td>
                                                                <td className="border border-slate-200 px-3 py-1.5 text-center text-sm">
                                                                    {[rec.kind, rec.make, rec.caliber, rec.model].filter(Boolean).join(' / ')}
                                                                </td>
                                                                <td className="border border-slate-200 px-3 py-1.5 text-center text-sm">{rec.dateApproved}</td>
                                                                <td className="border border-slate-200 px-3 py-1.5 text-center text-sm">{rec.dateExpiry}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    }

                    const setupMap: Record<string, { label: string, data: string[], addFn: (n: string) => void }> = {
                        'Model': { label: 'Model', data: firearmModels, addFn: addFirearmModel },
                        'Caliber': { label: 'Caliber', data: firearmCalibers, addFn: addFirearmCaliber },
                        'Make': { label: 'Make', data: firearmMakes, addFn: addFirearmMake },
                        'Kind': { label: 'Kind', data: firearmKinds, addFn: addFirearmKind },
                    };
                    const config = setupMap[activeFirearmTab];

                    return (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Add {config.label}</CardTitle>
                                    <CardDescription>Setup new {config.label.toLowerCase()} in the system</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firearmInput">{config.label} Name</Label>
                                        <Input id="firearmInput" placeholder={`e.g., ${config.data[0] || '1911'}`} />
                                    </div>
                                    <Button className="w-full" onClick={() => {
                                        const val = (document.getElementById('firearmInput') as HTMLInputElement)?.value;
                                        if (val) { config.addFn(val); (document.getElementById('firearmInput') as HTMLInputElement).value = ''; }
                                    }}>Add {config.label}</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Existing {config.label}s</CardTitle>
                                    <CardDescription>All configured {config.label.toLowerCase()}s</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                        {config.data.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                                <p className="font-medium">{item}</p>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                                                </div>
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

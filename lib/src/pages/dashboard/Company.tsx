import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useHeader } from './components/Header';
import { supabase } from '../../lib/supabase';
import { Loader2, Save, UploadCloud, ImagePlus, X } from 'lucide-react';

export function Company() {
    const { setHeaderInfo } = useHeader();
    const location = useLocation();
    const isCustomerForm = location.pathname.includes('/customer');

    // --- Company State ---
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState<number | null>(null);
    const [companyData, setCompanyData] = useState({
        idno: undefined as number | undefined,
        CompanyName: '',
        CompanyAdd: '',
        Telephone: '',
        Mobile: '',
        EmailAdd: '',
        PreparedBy: '',
        ApprovedBy: '',
        NotedBy: '',
        SSS: '',
        PHIC: '',
        HDMF: '',
        TIN: '',
        RDOCode: '',
        Logo1: '',
        Logo2: '',
        Logo3: '',
    });

    useEffect(() => {
        setHeaderInfo({
            title: isCustomerForm ? 'CUSTOMER' : 'COMPANY',
            subtitle: isCustomerForm ? 'Manage individual customer records' : 'Organization & Customer Configuration',
            searchPlaceholder: 'Search...',
            showSearch: false
        });
    }, [isCustomerForm, setHeaderInfo]);

    // Fetch initial data
    useEffect(() => {
        if (isCustomerForm) return;

        const fetchCompanyData = async () => {
            setIsLoading(true);
            try {
                // Fetch the first company record (assuming single-tenant setup for the company profile)
                const { data, error } = await supabase
                    .from('COMPANY')
                    .select('*')
                    .order('idno', { ascending: true })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    // PGRST116 means no rows found, which is fine for initial empty state
                    console.error('Error fetching company data:', error);
                } else if (data) {
                    setCompanyData({
                        idno: data.idno,
                        CompanyName: data.CompanyName || '',
                        CompanyAdd: data.CompanyAdd || '',
                        Telephone: data.Telephone || '',
                        Mobile: data.Mobile || '',
                        EmailAdd: data.EmailAdd || '',
                        PreparedBy: data.PreparedBy || '',
                        ApprovedBy: data.ApprovedBy || '',
                        NotedBy: data.NotedBy || '',
                        SSS: data.SSS || '',
                        PHIC: data.PHIC || '',
                        HDMF: data.HDMF || '',
                        TIN: data.TIN || '',
                        RDOCode: data.RDOCode || '',
                        Logo1: data.Logo1 || '',
                        Logo2: data.Logo2 || '',
                        Logo3: data.Logo3 || '',
                    });
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyData();
    }, [isCustomerForm]);

    const handleChange = (field: keyof typeof companyData, value: string) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = async (file: File, logoNum: number) => {
        setIsUploadingLogo(logoNum);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `logo-${logoNum}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('company-logos')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('company-logos').getPublicUrl(filePath);

            handleChange(`Logo${logoNum}` as keyof typeof companyData, data.publicUrl);
            alert(`Logo ${logoNum} uploaded successfully! Scroll up and click "Save Changes" to commit this to the database.`);
        } catch (error) {
            console.error('Error uploading image: ', error);
            alert('Error uploading image. Make sure you created the "company-logos" bucket in Supabase and made it public!');
        } finally {
            setIsUploadingLogo(null);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const dataToSave = { ...companyData };
            // Remove idno if it's undefined to let Postgres auto-generate it on insert
            if (dataToSave.idno === undefined) {
                delete dataToSave.idno;
            }

            const { data, error } = await supabase
                .from('COMPANY')
                .upsert(dataToSave, { onConflict: 'idno' })
                .select()
                .single();

            if (error) {
                console.error("Error saving company data:", error);
                alert("Failed to save company details.\n\nReason: " + error.message + "\nCode: " + error.code);
            } else if (data) {
                // Update state with newly generated idno if it was an insert
                setCompanyData(prev => ({ ...prev, idno: data.idno }));
                alert("Company details saved successfully!");
            }
        } catch (err) {
            console.error("Exception during save:", err);
            alert("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {isCustomerForm ? (
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg font-bold uppercase tracking-tight">Customer Information Form</CardTitle>
                        <CardDescription>Manage individual customer records and contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-4 max-w-4xl">
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label htmlFor="customerName" className="text-right font-medium text-slate-600">Customer Name</Label>
                                <Input id="customerName" className="h-9 focus-visible:ring-slate-400" placeholder="Enter customer full name" />
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                                <Label htmlFor="houseNo" className="text-right font-medium text-slate-600 pt-2">House No./ Street</Label>
                                <Input id="houseNo" className="h-20 focus-visible:ring-slate-400" placeholder="Enter complete address" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <Label htmlFor="custTel" className="text-right font-medium text-slate-600 text-sm">Telephone No.</Label>
                                    <Input id="custTel" className="h-9 focus-visible:ring-slate-400" placeholder="0000-000" />
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <Label htmlFor="custMobile" className="text-right font-medium text-slate-600 text-sm">Mobile No.</Label>
                                    <Input id="custMobile" className="h-9 focus-visible:ring-slate-400" placeholder="09XX-XXX-XXXX" />
                                </div>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label htmlFor="custEmail" className="text-right font-medium text-slate-600">E-mail Address</Label>
                                <Input id="custEmail" className="h-9 focus-visible:ring-slate-400" placeholder="customer@example.com" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <Button variant="ghost" className="text-slate-500 hover:text-slate-900">Clear Form</Button>
                            <Button className="bg-slate-900 text-white hover:bg-slate-800 px-8 shadow-md">Add Customer</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold uppercase tracking-tight">Company Details</CardTitle>
                            <CardDescription>Configure your organization's primary information and identifiers.</CardDescription>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading || isSaving}
                            className="bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-md flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-xl">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            </div>
                        )}

                        {/* Top Section */}
                        <div className="space-y-4 max-w-4xl">
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label htmlFor="companyName" className="text-right font-medium text-slate-600">Company Name</Label>
                                <Input
                                    id="companyName"
                                    className="h-9 focus-visible:ring-slate-400"
                                    value={companyData.CompanyName}
                                    onChange={(e) => handleChange('CompanyName', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                                <Label htmlFor="companyAddress" className="text-right font-medium text-slate-600 pt-2">Complete Address</Label>
                                <Input
                                    id="companyAddress"
                                    className="h-20 focus-visible:ring-slate-400"
                                    value={companyData.CompanyAdd}
                                    onChange={(e) => handleChange('CompanyAdd', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <Label htmlFor="telNo" className="text-right font-medium text-slate-600 text-sm">Telephone No.</Label>
                                    <Input
                                        id="telNo"
                                        className="h-9 focus-visible:ring-slate-400"
                                        value={companyData.Telephone}
                                        onChange={(e) => handleChange('Telephone', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <Label htmlFor="mobileNo" className="text-right font-medium text-slate-600 text-sm">Mobile No.</Label>
                                    <Input
                                        id="mobileNo"
                                        className="h-9 focus-visible:ring-slate-400"
                                        value={companyData.Mobile}
                                        onChange={(e) => handleChange('Mobile', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label htmlFor="email" className="text-right font-medium text-slate-600">E-mail Address</Label>
                                <Input
                                    id="email"
                                    className="h-9 focus-visible:ring-slate-400"
                                    value={companyData.EmailAdd}
                                    onChange={(e) => handleChange('EmailAdd', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Bottom Sections Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                            {/* Personnel Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-4 border-slate-300 pl-2 mb-4">Personnel & Branding</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">Prepared By</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400"
                                            value={companyData.PreparedBy}
                                            onChange={(e) => handleChange('PreparedBy', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">Approved By</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400"
                                            value={companyData.ApprovedBy}
                                            onChange={(e) => handleChange('ApprovedBy', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">Noted By</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400"
                                            value={companyData.NotedBy}
                                            onChange={(e) => handleChange('NotedBy', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-slate-900 border-l-4 border-slate-300 pl-2">Company Logos</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((num) => {
                                            const logoKey = `Logo${num}` as keyof typeof companyData;
                                            const logoValue = companyData[logoKey] as string;
                                            const isUploading = isUploadingLogo === num;

                                            return (
                                                <div key={num} className="relative group">
                                                    <Label
                                                        htmlFor={`logo-upload-${num}`}
                                                        className={`
                                                            relative flex flex-col items-center justify-center w-full aspect-[4/3] 
                                                            border-2 border-dashed rounded-xl cursor-pointer overflow-hidden
                                                            transition-all duration-200 ease-in-out
                                                            ${logoValue ? 'border-slate-200 bg-white shadow-sm hover:border-slate-300' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
                                                            ${isUploading ? 'pointer-events-none opacity-80' : ''}
                                                        `}
                                                    >
                                                        {isUploading && (
                                                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-2">
                                                                <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
                                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600">Uploading</span>
                                                            </div>
                                                        )}

                                                        {logoValue ? (
                                                            <>
                                                                <img src={logoValue} alt={`Logo ${num}`} className="w-full h-full object-contain p-2" />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                                                    <div className="flex items-center gap-2 bg-white/95 text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                                                                        <UploadCloud className="w-4 h-4" />
                                                                        Change
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                                                                <div className="w-10 h-10 mb-3 rounded-full bg-slate-200 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-200">
                                                                    <ImagePlus className="w-5 h-5 text-slate-500" />
                                                                </div>
                                                                <span className="text-xs font-semibold text-slate-700 mb-1">Logo {num}</span>
                                                                <span className="text-[10px] text-slate-400 font-medium">Click to browse</span>
                                                            </div>
                                                        )}

                                                        <Input
                                                            id={`logo-upload-${num}`}
                                                            type="file"
                                                            accept="image/*"
                                                            disabled={isUploading}
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleLogoUpload(file, num);
                                                            }}
                                                        />
                                                    </Label>

                                                    {logoValue && !isUploading && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleChange(logoKey, '');
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full shadow-md border border-slate-100 transition-colors z-30 opacity-0 group-hover:opacity-100"
                                                            title="Remove Logo"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Government IDs Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-4 border-slate-300 pl-2 mb-4">Registration Numbers</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">SSS No</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400 font-mono"
                                            value={companyData.SSS}
                                            onChange={(e) => handleChange('SSS', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">PHIC No</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400 font-mono"
                                            value={companyData.PHIC}
                                            onChange={(e) => handleChange('PHIC', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">HDMF No</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400 font-mono"
                                            value={companyData.HDMF}
                                            onChange={(e) => handleChange('HDMF', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">TIN</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400 font-mono"
                                            value={companyData.TIN}
                                            onChange={(e) => handleChange('TIN', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">RDO Code</Label>
                                        <Input
                                            className="h-8 text-sm focus-visible:ring-slate-400 font-mono"
                                            value={companyData.RDOCode}
                                            onChange={(e) => handleChange('RDOCode', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

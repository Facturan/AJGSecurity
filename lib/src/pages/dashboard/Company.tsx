import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useHeader } from './components/Header';

export function Company() {
    const { setHeaderInfo } = useHeader();
    const location = useLocation();
    const isCustomerForm = location.pathname.includes('/customer');

    useEffect(() => {
        setHeaderInfo({
            title: isCustomerForm ? 'CUSTOMER' : 'COMPANY',
            subtitle: isCustomerForm ? 'Manage individual customer records' : 'Organization & Customer Configuration',
            searchPlaceholder: 'Search...',
            showSearch: false
        });
    }, [isCustomerForm]);

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
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg font-bold uppercase tracking-tight">Company Details</CardTitle>
                        <CardDescription>Configure your organization's primary information and identifiers.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        {/* Top Section */}
                        <div className="space-y-4 max-w-4xl">
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label htmlFor="companyName" className="text-right font-medium text-slate-600">Company Name</Label>
                                <Input id="companyName" className="h-9 focus-visible:ring-slate-400" defaultValue="AJGSecurity Agency" />
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                                <Label htmlFor="companyAddress" className="text-right font-medium text-slate-600 pt-2">Complete Address</Label>
                                <Input id="companyAddress" className="h-20 focus-visible:ring-slate-400" defaultValue="Balubal, Cagayan de Oro City" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <Label htmlFor="telNo" className="text-right font-medium text-slate-600 text-sm">Telephone No.</Label>
                                    <Input id="telNo" className="h-9 focus-visible:ring-slate-400" defaultValue="3423-234" />
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <Label htmlFor="mobileNo" className="text-right font-medium text-slate-600 text-sm">Mobile No.</Label>
                                    <Input id="mobileNo" className="h-9 focus-visible:ring-slate-400" defaultValue="09055343534" />
                                </div>
                            </div>
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label htmlFor="email" className="text-right font-medium text-slate-600">E-mail Address</Label>
                                <Input id="email" className="h-9 focus-visible:ring-slate-400" defaultValue="ajgsecurity@gmail.com" />
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
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400" defaultValue="JUAN DELA CRUZ" />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">Approved By</Label>
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400" defaultValue="JUAN DELA CRUZ" />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">Noted By</Label>
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400" defaultValue="JUAN DELA CRUZ" />
                                    </div>
                                </div>
                                <div className="space-y-1 mt-6 bg-slate-50 p-3 rounded-md border border-slate-100">
                                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 text-right">Logo 1</span>
                                        <span className="text-xs text-slate-500 truncate italic">X:\Logo\Logo AJG.jpg</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 text-right">Logo 2</span>
                                        <span className="text-xs text-slate-500 truncate italic">X:\Logo\Logo SOSIA.jpg</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 text-right">Logo 3</span>
                                        <span className="text-xs text-slate-500 truncate italic">X:\Logo\default1.jpg</span>
                                    </div>
                                </div>
                            </div>

                            {/* Government IDs Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 border-l-4 border-slate-300 pl-2 mb-4">Registration Numbers</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">SSS No</Label>
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400 font-mono" defaultValue="11" />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">PHIC No</Label>
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400 font-mono" defaultValue="22" />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">HDMF No</Label>
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400 font-mono" defaultValue="33" />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">TIN</Label>
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400 font-mono" defaultValue="44" />
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <Label className="text-right text-sm font-medium text-slate-500">RDO Code</Label>
                                        <Input className="h-8 text-sm focus-visible:ring-slate-400 font-mono" defaultValue="01" />
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

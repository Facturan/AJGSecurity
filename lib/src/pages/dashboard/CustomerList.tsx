import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useHeader } from './components/Header';
import { Edit, Trash2, Users, FileDown } from 'lucide-react';
import headerImg from '../../../../assets/pdf/header.jpg';
import footerImg from '../../../../assets/pdf/footer.jpg';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

export function CustomerList() {
    const { setHeaderInfo } = useHeader();

    useEffect(() => {
        setHeaderInfo({
            title: 'CUSTOMER LIST',
            subtitle: 'Overview of all registered customers',
            icon: Users,
            searchPlaceholder: 'Search customers...',
            showSearch: true
        });
    }, [setHeaderInfo]);

    const handleDownloadPDF = async (customerName: string, customerAddress: string) => {
        if (!(window as any).html2pdf) {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }

        const date = new Date();
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const currentDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

        const element = document.createElement('div');
        element.style.fontFamily = "'Times New Roman', Times, serif";
        element.style.color = "black";
        element.style.width = "8.5in";
        element.style.height = "11in";
        element.style.position = "relative";
        element.style.background = "white";
        element.style.boxSizing = "border-box";

        element.innerHTML = `
            <img src="${headerImg}" style="width: 100%; height: auto; margin-bottom: 40px;" />
            <div style="padding: 0 1in;">
                <table style="width: 100%; border: none; font-size: 13pt; margin-bottom: 30px; border-collapse: collapse;">
                    <tr>
                        <td style="width: 120px; font-weight: bold; vertical-align: top; padding-bottom: 10px;">TO</td>
                        <td style="vertical-align: top; padding-bottom: 10px;">: <span style="font-weight: bold;">THE MANAGER - ${customerName}</span></td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">FROM</td>
                        <td style="vertical-align: top; padding-bottom: 10px;">: AJG SECURITY AGENCY CORPORATION</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">SUBJECT</td>
                        <td style="vertical-align: top; padding-bottom: 10px;">: ENDORSEMENT LETTER</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">DATE</td>
                        <td style="vertical-align: top; padding-bottom: 10px;">: ${currentDate}</td>
                    </tr>
                </table>

                <p style="font-size: 13pt; margin-bottom: 20px;">Sir/ Madam,</p>
                <p style="font-size: 13pt; margin-bottom: 20px;">Greetings!</p>
                <p style="font-size: 13pt; line-height: 1.5; margin-bottom: 20px; text-align: justify;">
                    We are respectfully endorsing to your good office <strong>SG PATULOT, CHRISTIAN R.</strong> to render security service at <strong>${customerName}</strong> in <strong>${customerAddress}</strong>. He/she is a highly trained Security Guard from a Security Academy.
                </p>
                <p style="font-size: 13pt; line-height: 1.5; margin-bottom: 20px; text-align: justify;">
                    We are glad to inform you further that the said security guard has already been given appropriate briefing and instruction from our agency TO PROTECT LIVES AND PROPERTIES.
                </p>
                <p style="font-size: 13pt; margin-bottom: 60px;">Thank you and more power!</p>

                <p style="font-size: 13pt; margin-bottom: 20px;">Prepared by:</p>
                <p style="font-size: 13pt; font-weight: bold; text-decoration: underline; margin-bottom: 0;">ANTONIETO C. TABAÑAG</p>
                <p style="font-size: 13pt;">Operations Manager</p>
            </div>
            <img src="${footerImg}" style="width: 100%; height: auto; position: absolute; bottom: 0; left: 0;" />
        `;

        const opt = {
            margin: 0,
            filename: `Endorsement_${customerName.replace(/[^a-z0-9]/gi, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        (window as any).html2pdf().set(opt).from(element).save();
    };

    return (
        <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-lg font-bold uppercase tracking-tight text-foreground">Customer List</CardTitle>
                <CardDescription className="text-muted-foreground">View and manage all customer records.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-semibold">Customer Name</TableHead>
                                <TableHead className="font-semibold">Complete Address</TableHead>
                                <TableHead className="font-semibold">Telephone No.</TableHead>
                                <TableHead className="font-semibold">Mobile No.</TableHead>
                                <TableHead className="font-semibold">E-mail Address</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Acme Corp</TableCell>
                                <TableCell>123 Main St, Springfield</TableCell>
                                <TableCell>555-0100</TableCell>
                                <TableCell>0917-123-4567</TableCell>
                                <TableCell>contact@acmecorp.com</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleDownloadPDF('Acme Corp', '123 Main St, Springfield')} title="Download PDF">
                                        <FileDown className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Globex Inc.</TableCell>
                                <TableCell>456 Oak Avenue, Metropolis</TableCell>
                                <TableCell>555-0200</TableCell>
                                <TableCell>0918-987-6543</TableCell>
                                <TableCell>info@globex.com</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleDownloadPDF('Globex Inc.', '456 Oak Avenue, Metropolis')} title="Download PDF">
                                        <FileDown className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

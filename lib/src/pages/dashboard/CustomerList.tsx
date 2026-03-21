import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useHeader } from './components/Header';
import { Edit, Trash2, Users } from 'lucide-react';
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

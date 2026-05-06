import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const SAMPLE_LOCATIONS = [
  { name: 'Main Office',  address: 'Makati City',       employees: 120 },
  { name: 'Branch 1',    address: 'Quezon City',        employees: 65  },
  { name: 'Branch 2',    address: 'Mandaluyong City',   employees: 40  },
  { name: 'Branch 3',    address: 'Pasig City',         employees: 20  },
];

export function LocationSetup() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Location</CardTitle>
          <CardDescription>Add a new work location or branch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="locationName">Location Name</Label>
            <Input id="locationName" placeholder="e.g., Main Office, Branch 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationAddress">Address</Label>
            <Input id="locationAddress" placeholder="Full address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationContact">Contact Number</Label>
            <Input id="locationContact" placeholder="Phone number" />
          </div>
          <Button className="w-full">Add Location</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>All work locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {SAMPLE_LOCATIONS.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-bold text-foreground">{location.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {location.address} - {location.employees} employees
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-foreground/70">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 font-bold">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

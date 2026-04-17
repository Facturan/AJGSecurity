import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function ContributionRates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Government Contribution Rates</CardTitle>
        <CardDescription>Configure SSS, PHIC, and HDMF contribution rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* SSS */}
          <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
            <h3 className="font-bold text-foreground border-b border-border pb-2">SSS Contribution</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sssEmployee">Employee Contributions (%)</Label>
                <Input
                  id="sssEmployee"
                  type="number"
                  step="0.01"
                  defaultValue="4.50"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sssEmployer">Employer Share (%)</Label>
                <Input
                  id="sssEmployer"
                  type="number"
                  step="0.01"
                  defaultValue="9.50"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>

          {/* PhilHealth */}
          <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
            <h3 className="font-bold text-foreground border-b border-border pb-2">PhilHealth (PHIC)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phicEmployee">Employee Contributions (%)</Label>
                <Input
                  id="phicEmployee"
                  type="number"
                  step="0.01"
                  defaultValue="2.00"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phicEmployer">Employer Share (%)</Label>
                <Input
                  id="phicEmployer"
                  type="number"
                  step="0.01"
                  defaultValue="2.00"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>

          {/* HDMF */}
          <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
            <h3 className="font-bold text-foreground border-b border-border pb-2">HDMF (Pag-IBIG)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hdmfEmployee">Employee Contributions (%)</Label>
                <Input
                  id="hdmfEmployee"
                  type="number"
                  step="0.01"
                  defaultValue="2.00"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hdmfEmployer">Employer Share (%)</Label>
                <Input
                  id="hdmfEmployer"
                  type="number"
                  step="0.01"
                  defaultValue="2.00"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" className="border-border text-foreground">Reset to Default</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md shadow-primary/20">
            Save Contribution Rates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

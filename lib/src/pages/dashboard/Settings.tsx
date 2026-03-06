import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor, SlidersHorizontal, Info, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useHeader } from './components/Header';
import { useTheme } from './ThemeContext';

export function Settings() {
  const { setHeaderInfo } = useHeader();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderInfo({
      title: 'SETTINGS',
      subtitle: 'System preferences',
      searchPlaceholder: 'Search...',
      showSearch: false,
    });
  }, []);

  const handleLogout = () => {
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="space-y-6">

      {/* Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-destructive" />
            <CardTitle className="text-destructive">Account</CardTitle>
          </div>
          <CardDescription>Manage your account session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <CardTitle>Theme</CardTitle>
          </div>
          <CardDescription>Choose how the application looks. Dark mode reduces eye strain in low light.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Appearance</Label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
                  }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
                  }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${theme === 'system'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
                  }`}
              >
                <Monitor className="w-4 h-4" />
                <span>System</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              System uses your device&apos;s light/dark preference.
            </p>
          </div>
        </CardContent>
      </Card>


      {/* About HRIS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <CardTitle>About HRIS</CardTitle>
          </div>
          <CardDescription>Information about the HR Information System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Application</p>
              <p className="text-sm font-semibold">HRIS Payroll Software</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="text-sm font-semibold">2.1.7</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Developer</p>
              <p className="text-sm font-semibold">DreamTeam I.T. Solutions</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">Human Resources Information System for payroll management, employee registration, and master data configuration.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

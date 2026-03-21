import { NavLink, Outlet, useLocation } from 'react-router';
import {
    LayoutDashboard,
    UserPlus,
    Users,
    Settings,
    SlidersHorizontal,
    Target,
    PanelLeft,
    PanelLeftClose,
    Building2,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Users2,
    Briefcase,
    MapPin,
    Award,
    Clock,
    Database,
    Menu,
    X,
    Receipt,
    CreditCard,
    CalendarClock,
    BookOpen,
    FileText
} from 'lucide-react';
import { PesoIcon } from './icons/PesoIcon';
import React, { useState, useEffect } from 'react';
import { Header, HeaderProvider } from './components/Header';
import logo from '../../../../assets/image/logo-4.png';

interface ChildNavItem {
    to: string;
    label: string;
    icon: React.ElementType;
    end?: boolean;
}

interface NavItem {
    to?: string;
    label: string;
    icon: React.ElementType;
    children?: ChildNavItem[];
    end?: boolean;
}

const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    {
        label: 'Company',
        icon: Building2,
        children: [
            { to: '/company', label: 'Company', icon: Building2, end: true },
            { to: '/company/customer', label: 'Customer Form', icon: UserPlus },
            { to: '/company/customer-list', label: 'Customer List', icon: Users2 },
        ]
    },
    { to: '/payroll-entry', label: 'Payroll Data Entry', icon: PesoIcon },
    {
        label: 'Loans / Deduct',
        icon: PesoIcon,
        children: [
            { to: '/loan-processing', label: 'Loan Processing', icon: CreditCard },
            { to: '/borrow-data-list', label: 'Borrow Data List', icon: Users },
            { to: '/setup-type-loan', label: 'Setup Type of Loan', icon: SlidersHorizontal },
        ]
    },

    {
        label: 'Employee Master Data',
        icon: Database,
        children: [
            { to: '/master-data/employee-data-list', label: 'Employee Data List', icon: Users },
            { to: '/master-data/employee-registration', label: 'Employee Registration', icon: UserPlus },
            { to: '/master-data/position', label: 'Setup Position', icon: Briefcase },
            { to: '/master-data/department', label: 'Setup Department', icon: Users2 },
            { to: '/master-data/religion', label: 'Setup Religion', icon: Award },
            { to: '/master-data/overtime', label: 'Setup Overtime Rate', icon: Clock },
            { to: '/master-data/status', label: 'Setup Employee Status', icon: Users2 },
            { to: '/master-data/training-details', label: 'Training Details', icon: BookOpen },
        ]
    },
    {
        label: 'Firearm Master Data',
        icon: Target,
        children: [
            { to: '/master-data/firearm-setup/license', label: 'License Entry', icon: Award },
            { to: '/master-data/firearm-setup/model', label: 'Setup Model', icon: Target },
            { to: '/master-data/firearm-setup/caliber', label: 'Setup Caliber', icon: Target },
            { to: '/master-data/firearm-setup/make', label: 'Setup Make', icon: Building2 },
            { to: '/master-data/firearm-setup/kind', label: 'Setup Kind', icon: Target },
        ]
    },
    {
        label: 'Time & Attendance',
        icon: CalendarClock,
        children: [
            { to: '/time-attendance/time-logs', label: 'Time Logs', icon: Clock },
            { to: '/time-attendance/attendance-view', label: 'Attendance', icon: Users },
            { to: '/time-attendance/schedule-view', label: 'Schedule View', icon: CalendarClock },
            { to: '/time-attendance/leave-credit', label: 'Leave Credit', icon: CreditCard },
        ]
    },
    { to: '/settings', label: 'Settings', icon: Settings },
];

function useLiveDate() {
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const SIDEBAR_COLLAPSED_KEY = 'ajg-sidebar-collapsed';

function SidebarInner() {
    const liveDate = useLiveDate();
    const location = useLocation();
    const isDashboard = location.pathname === '/';
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
        } catch {
            return false;
        }
    });
    const [isHovered, setIsHovered] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isExpanded = !collapsed || isHovered;

    // Track which parent menus are open
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const initialStates: Record<string, boolean> = {};
        // Automatically open menus if current path starts with their prefix
        if (location.pathname.startsWith('/company')) {
            initialStates['Company'] = true;
        }
        if (location.pathname.startsWith('/master-data/firearm-setup')) {
            initialStates['Firearm Master Data'] = true;
        } else if (location.pathname.startsWith('/master-data')) {
            initialStates['Employee Master Data'] = true;
        }
        if (location.pathname.startsWith('/loan-ledger') || location.pathname.startsWith('/setup-type-loan') || location.pathname.startsWith('/loan-processing') || location.pathname.startsWith('/borrow-data-list')) {
            initialStates['Loans'] = true;
        }
        if (location.pathname.startsWith('/time-attendance')) {
            initialStates['Time & Attendance'] = true;
        }
        return initialStates;
    });

    const toggleSidebar = () => {
        setCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
            } catch { }
            return next;
        });
    };

    const toggleMenu = (label: string) => {
        if (!isExpanded) {
            setCollapsed(false);
            setOpenMenus({ [label]: true });
            return;
        }
        setOpenMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const sidebarWidth = isExpanded ? 256 : 72;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    flex flex-col shadow-2xl flex-shrink-0 z-40 bg-sidebar transition-all duration-300 ease-in-out overflow-hidden
                    fixed inset-y-0 left-0 lg:relative lg:translate-x-0
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
                style={{ width: mobileOpen ? 280 : sidebarWidth }}
            >
                <div
                    className={`flex items-center justify-center border-b border-sidebar-border flex-shrink-0 h-16 ${!isExpanded ? 'px-2' : 'justify-start px-4'}`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                            <img src={logo} alt="HRIS Logo" className="w-full h-full object-cover" />
                        </div>
                        {isExpanded && (
                            <div className="flex flex-col leading-tight min-w-0">
                                <span className="text-sidebar-foreground font-bold text-sm tracking-wide truncate">HRIS</span>
                                <span className="text-sidebar-foreground/70 text-[10px] font-medium leading-none">Payroll Software</span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-2 scrollbar-hide">
                    {navItems.map((item) => {
                        const { label, icon: Icon, children } = item;
                        const isOpen = openMenus[label];
                        const isChildActive = !!(children && children.some(child => {
                            return child.end
                                ? location.pathname === child.to
                                : location.pathname.startsWith(child.to);
                        }));

                        if (children && children.length > 0) {
                            return (
                                <div key={label} className="space-y-1">
                                    <button
                                        onClick={() => toggleMenu(label)}
                                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98] ${isOpen || isChildActive
                                            ? 'text-sidebar-foreground bg-sidebar-accent shadow-sm'
                                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                            } ${isChildActive ? 'ring-1 ring-sidebar-primary/30' : ''}`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Icon className="w-5 h-5 shrink-0" />
                                            {isExpanded && <span className="truncate">{label}</span>}
                                        </div>
                                        {isExpanded && (
                                            isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                                        )}
                                    </button>
                                    {isOpen && isExpanded && (
                                        <div className="ml-4 pl-4 border-l border-border space-y-1 mt-1">
                                            {children.map((child) => (
                                                <NavLink
                                                    key={child.to}
                                                    to={child.to}
                                                    end={child.end}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 active:scale-[0.97] ${isActive
                                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm border border-sidebar-primary/20'
                                                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                                        }`
                                                    }
                                                >
                                                    <child.icon className="w-4 h-4 shrink-0" />
                                                    <span className="truncate">{child.label}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to!}
                                end={item.end}
                                title={!isExpanded ? label : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98] ${isActive
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md transform'
                                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {isExpanded && <span className="truncate">{label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                <div
                    className={`flex flex-col border-t border-sidebar-border bg-sidebar-accent/30 py-4 ${!isExpanded ? 'px-2 items-center' : 'px-5'}`}
                >
                    {!isExpanded ? (
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50 mx-auto"
                                title="Expand sidebar"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <span className="text-sidebar-foreground/50 text-[10px] font-semibold">v2.1.7</span>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between w-full">
                            <div className="flex flex-col">
                                <p className="text-sidebar-foreground font-semibold text-xs truncate">DT I.T. Solutions & Consultancy</p>
                                <p className="text-sidebar-foreground/60 text-[10px] mt-0.5">Version 2.1.7</p>
                                <p className="text-sidebar-foreground/60 text-[10px] mt-0.5">{liveDate}</p>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50 flex-shrink-0 mb-0.5"
                                title="Collapse sidebar"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Section (Header + Content) */}
            <div className="flex flex-col flex-1 overflow-hidden w-full">
                {/* Mobile Top Nav */}
                <div className="lg:hidden h-16 flex items-center justify-between px-4 bg-sidebar border-b border-sidebar-border flex-shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md overflow-hidden">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-sidebar-foreground">HRIS</span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Unified Top Header (Desktop only or adjusted) */}
                <div className="hidden lg:block">
                    <Header />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <SidebarInner />
    );
}

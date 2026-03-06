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
    Database
} from 'lucide-react';
import { PesoIcon } from './icons/PesoIcon';
import React, { useState, useEffect } from 'react';
import { Header, HeaderProvider } from './components/Header';
import logo from '../../../../assets/image/logo.png';

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
            { to: '/company/customer', label: 'Customer', icon: Users2 },
        ]
    },
    { to: '/employee-registration', label: 'Employee Registration Form', icon: UserPlus },
    { to: '/payroll-entry', label: 'Payroll Data Entry', icon: PesoIcon },

    {
        label: 'Master Data',
        icon: Database,
        children: [
            { to: '/master-data/employee-data-list', label: 'Employee Data List', icon: Users },
            { to: '/master-data/position', label: 'Position', icon: Briefcase },
            { to: '/master-data/department', label: 'Department', icon: Users2 },
            { to: '/master-data/religion', label: 'Religion', icon: Award },
            { to: '/master-data/overtime', label: 'Overtime', icon: Clock },
            { to: '/master-data/rates', label: 'Rates', icon: PesoIcon },
            { to: '/master-data/location', label: 'Location', icon: MapPin },
            { to: '/master-data/status', label: 'Status', icon: Users2 },
            { to: '/master-data/firearm-setup', label: 'Firearm Setup', icon: Target },
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
    const isExpanded = !collapsed || isHovered;

    // Track which parent menus are open
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const initialStates: Record<string, boolean> = {};
        // Automatically open menus if current path starts with their prefix
        if (location.pathname.startsWith('/company')) {
            initialStates['Company'] = true;
        }
        if (location.pathname.startsWith('/master-data')) {
            initialStates['Master Data'] = true;
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

    const sidebarWidth = isExpanded ? 256 : 72;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex flex-col shadow-2xl flex-shrink-0 z-20 bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ width: sidebarWidth }}
            >
                <div
                    className={`flex items-center justify-center border-b border-slate-200 dark:border-slate-700 flex-shrink-0 h-16 ${!isExpanded ? 'px-2' : 'justify-start px-4'}`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                            <img src={logo} alt="HRIS Logo" className="w-full h-full object-cover" />
                        </div>
                        {isExpanded && (
                            <div className="flex flex-col leading-tight min-w-0">
                                <span className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-wide truncate">HRIS</span>
                                <span className="text-slate-600 dark:text-slate-400 text-[10px] font-medium leading-none">Payroll Software</span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-2">
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
                                            ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 shadow-sm'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                                            } ${isChildActive ? 'ring-1 ring-blue-400/30' : ''}`}
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
                                        <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-1 mt-1">
                                            {children.map((child) => (
                                                <NavLink
                                                    key={child.to}
                                                    to={child.to}
                                                    end={child.end}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 active:scale-[0.97] ${isActive
                                                            ? 'bg-blue-300 dark:bg-blue-600 text-slate-900 dark:text-slate-100 shadow-sm border border-blue-400/20'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
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
                                        ? 'bg-blue-300 dark:bg-blue-600 text-slate-900 dark:text-slate-100 shadow-md transform'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
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
                    className={`flex flex-col border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 py-4 ${!isExpanded ? 'px-2 items-center' : 'px-5'}`}
                >
                    {!isExpanded ? (
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 mx-auto"
                                title="Expand sidebar"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <span className="text-slate-600 dark:text-slate-400 text-[10px] font-semibold">v2.1.7</span>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between w-full">
                            <div className="flex flex-col">
                                <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold">DreamTeam I.T. Solutions</p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">Version 2.1.7</p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">{liveDate}</p>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0 mb-0.5"
                                title="Collapse sidebar"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Section (Header + Content) */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Unified Top Header - Hidden on Dashboard */}
                {!isDashboard && <Header />}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <HeaderProvider>
            <SidebarInner />
        </HeaderProvider>
    );
}

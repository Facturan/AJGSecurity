import { useState, useEffect } from 'react';
import { Search, Save, RefreshCw, Filter, Download, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { useHeader } from './HeaderContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useNavigate } from 'react-router';
import { cn } from '../../ui/utils';
import { supabase } from '../../../../lib/supabase';


export function Header() {
    const { headerInfo } = useHeader();
    const [searchValue, setSearchValue] = useState('');
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    useEffect(() => {
        setSearchValue('');
    }, [headerInfo.title]);

    useEffect(() => {
        const initUser = async () => {
            // getSession reads from local storage — fast and reliable
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session?.user) {
                setUser(sessionData.session.user);
            } else {
                // fallback: verify via network
                const { data: userData } = await supabase.auth.getUser();
                setUser(userData.user ?? null);
            }
        };
        initUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);



    if (headerInfo.hideHeader) return null;

    return (
        <header
            className="flex flex-col flex-shrink-0 bg-card border-b border-border relative z-10"
        >
            <div className="flex items-center h-16 px-6 gap-4">
                {headerInfo.icon && (
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0",
                        headerInfo.iconColor || "bg-gradient-to-br from-indigo-600 to-blue-500 shadow-indigo-100/50"
                    )}>
                        <headerInfo.icon size={20} className="text-white" />
                    </div>
                )}
                <div className="flex flex-col leading-tight shrink-0">
                    <span className="text-xl font-bold text-gray-800 tracking-tight uppercase truncate">
                        {headerInfo.title}
                    </span>
                    <span className="text-xs font-medium text-gray-500 truncate">
                        {headerInfo.subtitle}
                    </span>
                </div>

                {/* Left Actions */}
                {headerInfo.leftActions && (
                    <div className="flex items-center">
                        {headerInfo.leftActions}
                    </div>
                )}

                <div className="flex-1 flex items-center justify-end px-4">
                    {(headerInfo.showSearch !== false) && (
                        <div className="relative w-64 group max-w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchValue(val);
                                    if (headerInfo.onSearch) {
                                        headerInfo.onSearch(val);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && headerInfo.onSearch) {
                                        headerInfo.onSearch(searchValue);
                                    }
                                }}
                                placeholder={headerInfo.searchPlaceholder ?? 'Search...'}
                                className="w-full bg-black/[0.03] hover:bg-black/[0.05] border-none focus:bg-background text-foreground placeholder:text-muted-foreground/50 text-sm pl-10 pr-4 h-10 rounded-full outline-none transition-all focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Custom Actions */}
                    {headerInfo.customActions && (
                        <div className="flex items-center gap-2 mr-2">
                            {headerInfo.customActions}
                        </div>
                    )}

                    {/* Notification Bell */}
                    {headerInfo.showNotificationBell !== false && (
                        <div className="relative mr-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-muted/50 transition-all text-muted-foreground hover:text-primary active:scale-95"
                                onClick={headerInfo.onNotificationClick}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
                            </Button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {headerInfo.onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 gap-2 border-border bg-card hover:bg-muted/50 shadow-sm rounded-full px-5"
                            onClick={headerInfo.onRefresh}
                            disabled={headerInfo.isLoading}
                        >
                            <RefreshCw className={cn("w-4 h-4 text-muted-foreground", headerInfo.isLoading && "animate-spin")} />
                            <span className="text-xs font-bold text-foreground/80">Refresh</span>
                        </Button>
                    )}

                    {headerInfo.onFilter && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 gap-2 border-border bg-card hover:bg-muted/50 shadow-sm rounded-full px-5"
                            onClick={headerInfo.onFilter}
                        >
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-foreground/80">Filter</span>
                        </Button>
                    )}

                    {headerInfo.onExport && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 gap-2 border-border bg-card hover:bg-muted/50 shadow-sm rounded-full px-5"
                            onClick={headerInfo.onExport}
                        >
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-foreground/80">Export</span>
                        </Button>
                    )}

                    {headerInfo.showSecondaryAction && (
                        <Button
                            className="gap-2 h-10 px-6 text-xs font-bold tracking-wider shadow-md bg-white border border-border hover:bg-muted/50 text-foreground rounded-full"
                            onClick={headerInfo.onSecondaryAction}
                            disabled={headerInfo.isLoading}
                        >
                            {!headerInfo.isLoading && (() => {
                                const Icon = headerInfo.secondaryActionIcon || Save;
                                return <Icon className="w-4 h-4 text-muted-foreground" />;
                            })()}
                            {headerInfo.secondaryActionLabel ?? 'Action'}
                        </Button>
                    )}

                    {headerInfo.showPrimaryAction && (
                        <Button
                            className="gap-2 h-10 px-6 text-xs font-bold tracking-wider shadow-md bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                            onClick={headerInfo.onPrimaryAction}
                            disabled={headerInfo.isLoading}
                        >
                            {!headerInfo.isLoading && (() => {
                                const Icon = headerInfo.primaryActionIcon || Save;
                                return <Icon className="w-4 h-4" />;
                            })()}
                            {headerInfo.primaryActionLabel ?? 'Save'}
                        </Button>
                    )}

                    {/* User Profile Section — always rendered */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 ml-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer select-none group">
                                {/* Avatar */}
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                                    {user?.email?.charAt(0).toUpperCase() ?? 'A'}
                                </div>
                                {/* Name + role */}
                                <div className="flex flex-col leading-tight">
                                    <span className="text-xs font-bold text-slate-700 leading-none">
                                        {user?.email?.split('@')[0] ?? 'Administrator'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 leading-none mt-0.5">Admin</span>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 group-hover:text-slate-600 transition-colors" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 p-0 overflow-hidden bg-white border-slate-200/70 shadow-2xl rounded-2xl">
                            {/* Banner header */}
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 px-4 pt-4 pb-5">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold text-lg shrink-0 ring-2 ring-white/40">
                                        {user?.email?.charAt(0).toUpperCase() ?? 'A'}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-bold text-white leading-tight truncate">
                                            {user?.email?.split('@')[0] ?? 'Administrator'}
                                        </p>
                                        <p className="text-[11px] text-indigo-200 truncate leading-tight mt-0.5">
                                            {user?.email ?? 'admin@ajgsecurity.com'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Menu items */}
                            <div className="p-2">
                                <DropdownMenuItem
                                    onClick={() => navigate('/settings')}
                                    className="rounded-lg gap-3 py-2.5 px-3 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-xs font-bold text-slate-700">Profile Settings</span>
                                        <span className="text-[10px] text-slate-400">Manage your account</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100 my-1.5" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="rounded-lg gap-3 py-2.5 px-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-xs font-bold">Sign Out</span>
                                    </div>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tabs Section */}
            {headerInfo.tabs && headerInfo.tabs.length > 0 && (
                <div className="flex items-center px-6 bg-muted/10 border-t border-border">
                    <div className="flex gap-1 py-1">
                        {headerInfo.tabs?.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={tab.onClick}
                                className={cn(
                                    "px-4 py-2 text-xs font-bold tracking-wide transition-all rounded-md",
                                    tab.isActive
                                        ? "bg-primary/20 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

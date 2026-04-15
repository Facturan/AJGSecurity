import { useState, useEffect } from 'react';
import { Search, Save, RefreshCw, Filter, Download, Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { useHeader } from './HeaderContext';
import { cn } from '../../ui/utils';
import { supabase } from '../../../../lib/supabase';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export function Header() {
    const { headerInfo } = useHeader();
    const [searchValue, setSearchValue] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setSearchValue('');
    }, [headerInfo.title]);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

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

                    {/* Professional Profile Section */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group ml-2 active:scale-[0.98]">
                                    <Avatar className="h-9 w-9 rounded-xl overflow-hidden border-none ring-0 shadow-sm shrink-0 transition-transform group-hover:scale-105">
                                        <AvatarImage src={user.user_metadata?.avatar_url || ''} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white text-xs font-black rounded-none">
                                            {(user.user_metadata?.display_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col justify-center select-none min-w-[80px]">
                                        <span className="text-[13px] font-bold text-foreground tracking-tight leading-none mb-1">
                                            {user.user_metadata?.display_name || user.email?.split('@')[0] || 'Administrator'}
                                        </span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight leading-none opacity-70">
                                            Administrator
                                        </span>
                                    </div>
                                    <ChevronDown size={14} strokeWidth={3} className="text-muted-foreground group-hover:text-foreground transition-colors ml-1" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl shadow-2xl border-border/40 backdrop-blur-xl">
                                <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-2">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account</span>
                                    <span className="text-sm font-black text-foreground truncate">{user.email}</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/40 my-2" />
                                <DropdownMenuItem className="rounded-lg gap-3 py-2 cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                                    <User className="w-4 h-4 text-indigo-500" />
                                    <span className="font-bold">My Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg gap-3 py-2 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                    <Settings className="w-4 h-4 text-slate-500" />
                                    <span className="font-bold">Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border/40 my-2" />
                                <DropdownMenuItem 
                                    onClick={handleLogout}
                                    className="rounded-lg gap-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-all font-bold"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
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

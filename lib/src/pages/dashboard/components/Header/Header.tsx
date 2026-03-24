import React, { useState, useEffect } from 'react';
import { Search, Save, RefreshCw, Filter, Download } from 'lucide-react';
import { Button } from '../../ui/button';
import { useHeader } from './HeaderContext';
import { cn } from '../../ui/utils';

export function Header() {
    const { headerInfo } = useHeader();
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setSearchValue('');
    }, [headerInfo.title]);

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
                <div className="flex flex-col leading-tight min-w-[200px]">
                    <span className="text-xl font-bold text-gray-800 tracking-tight uppercase truncate">
                        {headerInfo.title}
                    </span>
                    <span className="text-xs font-medium text-gray-500 truncate">
                        {headerInfo.subtitle}
                    </span>
                </div>

                {/* Left Actions */}
                {headerInfo.leftActions && (
                    <div className="flex items-center gap-3 ml-2">
                        {headerInfo.leftActions}
                    </div>
                )}

                <div className="flex-1 flex items-center justify-center max-w-2xl px-4">
                    {(headerInfo.showSearch !== false) && (
                        <div className="relative w-full group">
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

                    {/* Action Buttons */}
                    {headerInfo.onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 border-border bg-card hover:bg-muted/50 shadow-sm"
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
                            className="h-9 gap-2 border-border bg-card hover:bg-muted/50 shadow-sm"
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
                            className="h-9 gap-2 border-border bg-card hover:bg-muted/50 shadow-sm"
                            onClick={headerInfo.onExport}
                        >
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-foreground/80">Export</span>
                        </Button>
                    )}

                    {headerInfo.showSecondaryAction && (
                        <Button
                            className="gap-2 h-9 px-4 text-xs font-bold tracking-wider shadow-md bg-white border border-border hover:bg-muted/50 text-foreground"
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
                            className="gap-2 h-9 px-4 text-xs font-bold tracking-wider shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
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

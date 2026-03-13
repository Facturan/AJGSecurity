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
            className="flex flex-col flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10"
        >
            <div className="flex items-center h-16 px-6 gap-6">
                <div className="flex flex-col leading-tight min-w-[200px]">
                    <span className="text-slate-900 dark:text-slate-100 font-extrabold text-lg tracking-widest uppercase truncate">
                        {headerInfo.title}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">
                        {headerInfo.subtitle}
                    </span>
                </div>

                <div className="flex-1 flex items-center justify-center max-w-2xl px-4">
                    {(headerInfo.showSearch !== false) && (
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && headerInfo.onSearch) {
                                        headerInfo.onSearch(searchValue);
                                    }
                                }}
                                placeholder={headerInfo.searchPlaceholder ?? 'Search...'}
                                className="w-full bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700 border-transparent focus:border-blue-400/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm pl-10 pr-4 h-10 rounded-xl outline-none transition-all shadow-sm focus:shadow-md"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Action Buttons */}
                    {headerInfo.onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                            onClick={headerInfo.onRefresh}
                            disabled={headerInfo.isLoading}
                        >
                            <RefreshCw className={cn("w-4 h-4 text-slate-500", headerInfo.isLoading && "animate-spin")} />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Refresh</span>
                        </Button>
                    )}

                    {headerInfo.onFilter && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                            onClick={headerInfo.onFilter}
                        >
                            <Filter className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter</span>
                        </Button>
                    )}

                    {headerInfo.onExport && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                            onClick={headerInfo.onExport}
                        >
                            <Download className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Export</span>
                        </Button>
                    )}

                    {headerInfo.showPrimaryAction && (
                        <Button
                            className="gap-2 h-9 px-4 text-xs font-bold tracking-wider shadow-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900"
                            onClick={headerInfo.onPrimaryAction}
                            disabled={headerInfo.isLoading}
                        >
                            {!headerInfo.isLoading && <Save className="w-4 h-4" />}
                            {headerInfo.primaryActionLabel ?? 'Save'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            {headerInfo.tabs && headerInfo.tabs.length > 0 && (
                <div className="flex items-center px-6 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex gap-1 py-1">
                        {headerInfo.tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={tab.onClick}
                                className={cn(
                                    "px-4 py-2 text-xs font-bold tracking-wide transition-all rounded-md",
                                    tab.isActive
                                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
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

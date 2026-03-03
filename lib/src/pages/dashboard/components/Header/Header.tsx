import React, { useState } from 'react';
import { Search, Save } from 'lucide-react';
import { Button } from '../../ui/button';
import { useHeader } from './HeaderContext';

export function Header() {
    const { headerInfo } = useHeader();
    const [searchValue, setSearchValue] = useState('');

    return (
        <header
            className="flex items-center flex-shrink-0 shadow-lg px-6 bg-white dark:bg-slate-800 h-16 border-b border-slate-200 dark:border-slate-700"
        >
            <div className="flex flex-col leading-tight">
                <span className="text-slate-900 dark:text-slate-100 font-extrabold text-lg tracking-widest uppercase">
                    {headerInfo.title}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                    {headerInfo.subtitle}
                </span>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
                {headerInfo.showPrimaryAction && (
                    <Button className="gap-2 h-9 px-4 text-xs font-bold tracking-wider">
                        <Save className="w-4 h-4" />
                        {headerInfo.primaryActionLabel ?? 'Save'}
                    </Button>
                )}

                {(headerInfo.showSearch !== false) && (
                    <div className="flex items-center gap-0 rounded overflow-hidden border border-slate-300 dark:border-slate-600">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 px-3 h-9 border-r border-slate-300 dark:border-slate-600">
                            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={headerInfo.searchPlaceholder ?? 'Search employee...'}
                            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm px-3 h-9 outline-none w-48"
                        />
                        <button
                            className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white transition-colors text-white dark:text-slate-900 text-xs font-bold px-4 h-9 tracking-wider"
                        >
                            SEARCH
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

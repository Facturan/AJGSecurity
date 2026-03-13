import * as React from 'react';
import { format, getYear, getMonth, setMonth, setYear } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerProps {
    value?: string; // ISO date string YYYY-MM-DD
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function DatePicker({ value, onChange, placeholder = 'MM/DD/YYYY', className, disabled }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const selected = value ? new Date(value + 'T00:00:00') : undefined;
    const [viewDate, setViewDate] = React.useState<Date>(selected ?? new Date());

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            onChange?.(format(date, 'yyyy-MM-dd'));
            setOpen(false);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.('');
    };

    const [inputValue, setInputValue] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);

    // Sync input value when selected date changes externally
    React.useEffect(() => {
        if (!isTyping) {
            if (value) {
                setInputValue(format(new Date(value + 'T00:00:00'), 'MM/dd/yyyy'));
            } else {
                setInputValue('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsTyping(true);
        let digits = e.target.value.replace(/\D/g, '');

        // Validation & Auto-correction
        if (digits.length >= 1) {
            const m1 = parseInt(digits[0]);
            if (m1 > 1) digits = '0' + digits; // e.g. typing '3' becomes '03'
        }
        if (digits.length >= 2) {
            const month = parseInt(digits.slice(0, 2));
            if (month > 12) digits = '12' + digits.slice(2);
            if (month === 0) digits = '01' + digits.slice(2);
        }
        if (digits.length >= 3) {
            const d1 = parseInt(digits[2]);
            if (d1 > 3) digits = digits.slice(0, 2) + '0' + digits[2]; // e.g. '125' becomes '12/05'
        }
        if (digits.length >= 4) {
            const day = parseInt(digits.slice(2, 4));
            if (day > 31) digits = digits.slice(0, 2) + '31' + digits.slice(4);
            if (day === 0) digits = digits.slice(0, 2) + '01' + digits.slice(4);
        }

        // Apply formatting MM/DD/YYYY
        let formatted = digits;
        if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
        if (digits.length > 4) formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);

        setInputValue(formatted);

        if (digits.length === 8) {
            const month = parseInt(digits.slice(0, 2)) - 1;
            const day = parseInt(digits.slice(2, 4));
            const year = parseInt(digits.slice(4, 8));
            const parsedDate = new Date(year, month, day);

            if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() === year) {
                setViewDate(parsedDate);
                onChange?.(format(parsedDate, 'yyyy-MM-dd'));
                setTimeout(() => setIsTyping(false), 100);
            }
        } else if (digits === '') {
            onChange?.('');
            setIsTyping(false);
        }
    };

    const handleBlur = () => {
        setIsTyping(false);
        // Only clear if the input is completely empty. Let them keep partially typed text.
        if (inputValue === '') {
            onChange?.('');
        }
    };

    const currentYear = getYear(viewDate);
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 80 + i).reverse().slice(0, 100);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div
                className={cn(
                    'group flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background',
                    'focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/40',
                    'transition-all duration-150',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                <div className="flex items-center gap-2 flex-1">
                    <input
                        type="text"
                        disabled={disabled}
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder:text-slate-400"
                        maxLength={10}
                    />
                    <PopoverTrigger asChild>
                        <button type="button" disabled={disabled} className="focus:outline-none flex items-center shrink-0">
                            <CalendarIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors cursor-pointer" />
                        </button>
                    </PopoverTrigger>
                </div>
                {selected && (
                    <span
                        onClick={handleClear}
                        className="ml-2 shrink-0 rounded-full p-0.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X className="h-3.5 w-3.5" />
                    </span>
                )}
            </div>

            <PopoverContent
                className="w-auto p-0 shadow-xl border-slate-200 rounded-xl overflow-hidden"
                align="start"
                sideOffset={6}
            >
                {/* Month / Year header selectors */}
                <div className="flex items-center gap-2 px-3 pt-3 pb-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <select
                        value={getMonth(viewDate)}
                        onChange={(e) => setViewDate(setMonth(viewDate, parseInt(e.target.value)))}
                        className="flex-1 rounded-md bg-white/20 text-white text-xs font-semibold px-2 py-1.5 border-0 outline-none cursor-pointer backdrop-blur-sm"
                    >
                        {MONTHS.map((m, i) => (
                            <option key={m} value={i} className="text-slate-800 bg-white">{m}</option>
                        ))}
                    </select>
                    <select
                        value={getYear(viewDate)}
                        onChange={(e) => setViewDate(setYear(viewDate, parseInt(e.target.value)))}
                        className="w-20 rounded-md bg-white/20 text-white text-xs font-semibold px-2 py-1.5 border-0 outline-none cursor-pointer backdrop-blur-sm"
                    >
                        {years.map((y) => (
                            <option key={y} value={y} className="text-slate-800 bg-white">{y}</option>
                        ))}
                    </select>
                </div>

                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={handleSelect}
                    month={viewDate}
                    onMonthChange={setViewDate}
                    initialFocus
                    classNames={{
                        months: 'flex flex-col',
                        month: 'flex flex-col gap-1',
                        caption: 'hidden',
                        nav: 'hidden',
                        table: 'w-full border-collapse',
                        head_row: 'flex px-2 pt-2',
                        head_cell: 'text-slate-400 rounded-md w-9 font-semibold text-[0.7rem] uppercase text-center',
                        row: 'flex w-full px-2 pb-1',
                        cell: 'relative p-0 text-center text-sm',
                        day: 'h-9 w-9 p-0 font-normal rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors aria-selected:opacity-100 text-sm',
                        day_selected: 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white font-semibold shadow-sm',
                        day_today: 'bg-indigo-50 text-indigo-600 font-bold',
                        day_outside: 'text-slate-300',
                        day_disabled: 'text-slate-300 cursor-not-allowed',
                        day_hidden: 'invisible',
                    }}
                />

                {/* Today shortcut */}
                <div className="px-3 pb-3 flex justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-3"
                        onClick={() => {
                            const today = new Date();
                            onChange?.(format(today, 'yyyy-MM-dd'));
                            setViewDate(today);
                            setOpen(false);
                        }}
                    >
                        Today
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

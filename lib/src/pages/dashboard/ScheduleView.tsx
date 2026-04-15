import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format, parseISO, startOfWeek, addDays, isSameDay } from "date-fns";
import { DatePicker } from "./ui/date-picker";
import {
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Bell,
  Calendar,
  Sparkles,
  ChevronDown,
  Check,
  MoreHorizontal,
  Trash2,
  Edit3,
  Filter,
} from "lucide-react";
import { useHeader } from "./components/Header";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  location: string;
  attendees: number;
  color: string;
  category: string;
  description?: string;
  date?: string;
}

interface Day {
  name: string;
  date: number;
  month: string;
  isToday: boolean;
  events: Event[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EVENT_COLORS = [
  { label: "Blue", value: "blue", bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", bar: "#3b82f6" },
  { label: "Green", value: "green", bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", bar: "#10b981" },
  { label: "Purple", value: "purple", bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", bar: "#8b5cf6" },
  { label: "Pink", value: "pink", bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-700", bar: "#ec4899" },
  { label: "Orange", value: "orange", bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-700", bar: "#f97316" },
  { label: "Teal", value: "teal", bg: "bg-teal-500", light: "bg-teal-50", text: "text-teal-700", bar: "#14b8a6" },
];

const CATEGORIES = ["Meeting", "Workshop", "Review", "Social", "Training", "Other"];

const getColor = (colorValue: string) =>
  EVENT_COLORS.find((c) => c.value === colorValue) ?? EVENT_COLORS[0];

// ─── Initial data ─────────────────────────────────────────────────────────────
const INITIAL_WEEKS: Day[][] = [
  [
    {
      name: "Monday", date: 16, month: "March", isToday: false, events: [
        { id: "e1", title: "Team Standup", time: "09:00 AM", duration: "30 min", location: "Conference Room A", attendees: 12, color: "blue", category: "Meeting", description: "Daily sync with the engineering team." },
        { id: "e2", title: "Design Review", time: "02:00 PM", duration: "1 hour", location: "Meeting Room 3", attendees: 6, color: "purple", category: "Review", description: "Review Q1 design deliverables." },
      ]
    },
    {
      name: "Tuesday", date: 17, month: "March", isToday: false, events: [
        { id: "e3", title: "Client Presentation", time: "10:00 AM", duration: "2 hours", location: "Board Room", attendees: 8, color: "green", category: "Meeting", description: "Present Q1 results to the client." },
        { id: "e4", title: "Training Session", time: "03:00 PM", duration: "1.5 hours", location: "Training Hall", attendees: 20, color: "orange", category: "Training", description: "New hire onboarding training." },
      ]
    },
    {
      name: "Wednesday", date: 18, month: "March", isToday: false, events: [
        { id: "e5", title: "Sprint Planning", time: "09:30 AM", duration: "2 hours", location: "Conference Room B", attendees: 15, color: "blue", category: "Meeting", description: "Plan the upcoming sprint tasks." },
      ]
    },
    {
      name: "Thursday", date: 19, month: "March", isToday: true, events: [
        { id: "e6", title: "One-on-One Reviews", time: "01:00 PM", duration: "3 hours", location: "Office 205", attendees: 6, color: "pink", category: "Review", description: "Quarterly performance check-ins." },
      ]
    },
    {
      name: "Friday", date: 20, month: "March", isToday: false, events: [
        { id: "e7", title: "Team Lunch", time: "12:00 PM", duration: "1 hour", location: "Cafeteria", attendees: 25, color: "green", category: "Social", description: "Weekly team bonding lunch." },
        { id: "e8", title: "Weekly Wrap-up", time: "04:00 PM", duration: "45 min", location: "Conference Room A", attendees: 12, color: "blue", category: "Meeting", description: "End of week retrospective." },
      ]
    },
  ],
  [
    {
      name: "Monday", date: 23, month: "March", isToday: false, events: [
        { id: "e9", title: "Product Roadmap", time: "10:00 AM", duration: "2 hours", location: "Board Room", attendees: 10, color: "teal", category: "Meeting", description: "Q2 roadmap planning session." },
      ]
    },
    {
      name: "Tuesday", date: 24, month: "March", isToday: false, events: [
        { id: "e10", title: "Code Review", time: "11:00 AM", duration: "1 hour", location: "Meeting Room 2", attendees: 5, color: "purple", category: "Review", description: "Review PRs for release." },
        { id: "e11", title: "Lunch & Learn", time: "12:30 PM", duration: "1 hour", location: "Cafeteria", attendees: 18, color: "orange", category: "Social", description: "Tech talk by the platform team." },
      ]
    },
    {
      name: "Wednesday", date: 25, month: "March", isToday: false, events: [
        { id: "e12", title: "UX Workshop", time: "09:00 AM", duration: "3 hours", location: "Design Studio", attendees: 8, color: "pink", category: "Workshop", description: "User research synthesis workshop." },
      ]
    },
    {
      name: "Thursday", date: 26, month: "March", isToday: false, events: [
        { id: "e13", title: "Investor Update", time: "02:00 PM", duration: "1.5 hours", location: "Executive Suite", attendees: 4, color: "blue", category: "Meeting", description: "Monthly investor briefing." },
      ]
    },
    {
      name: "Friday", date: 27, month: "March", isToday: false, events: [
        { id: "e14", title: "Team Happy Hour", time: "05:00 PM", duration: "2 hours", location: "Rooftop", attendees: 30, color: "green", category: "Social", description: "Casual end-of-week celebration." },
      ]
    },
  ],
];

// ─── Category Dropdown ────────────────────────────────────────────────────────
function CategoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = ["All", ...CATEGORIES];
  const isFiltered = value !== "All";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 h-10 px-4 rounded-full border transition-all ${isFiltered
            ? "border-indigo-500/30 bg-indigo-50/50"
            : "border-border/50 bg-white shadow-sm hover:bg-gray-50"
          }`}
      >
        <div className="flex items-center justify-center flex-shrink-0">
          {isFiltered ? (
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          ) : (
            <Filter size={14} className="text-muted-foreground/70" />
          )}
        </div>
        <span className={`text-sm font-medium whitespace-nowrap ${isFiltered ? "text-indigo-600" : "text-foreground/80"
          }`}>
          {isFiltered ? value : "Filter"}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={14} className="text-muted-foreground/70" />
        </motion.div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-[calc(100%+8px)] z-[100] w-48 rounded-2xl overflow-hidden bg-card border border-border shadow-xl"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Header */}
            <div className="px-3.5 pt-3 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Filter by category
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border mx-3" />

            {/* Options */}
            <div className="py-1.5">
              {options.map((opt) => {
                const isActive = value === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2 transition-colors ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted/50"
                      }`}
                  >
                    <span className="text-xs">{opt}</span>
                    {isActive && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check size={12} className="text-indigo-400" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Clear filter footer */}
            {isFiltered && (
              <>
                <div className="h-px bg-border mx-3" />
                <div className="p-1.5">
                  <button
                    onClick={() => { onChange("All"); setOpen(false); }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    <X size={10} />
                    Clear filter
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
const EventCard = forwardRef<HTMLDivElement, {
  event: Event;
  onDelete: (id: string) => void;
  onEdit: (event: Event) => void;
}>(({
  event,
  onDelete,
  onEdit,
}, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = getColor(event.color);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer select-none"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3.5px] rounded-l-xl" style={{ background: c.bar }} />
      <div className="pl-4 pr-3 py-3">
        <div className="flex items-start justify-between gap-1 mb-2">
          <span className="text-sm font-semibold text-gray-800 leading-tight">{event.title}</span>
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-md hover:bg-gray-100 text-gray-400"
            >
              <MoreHorizontal size={14} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-6 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[130px]"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(event); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Edit3 size={12} /> Edit event
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(event.id); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={12} /> Delete event
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium mb-2 ${c.light} ${c.text}`}>
          {event.category}
        </span>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <Clock size={10} className="flex-shrink-0 text-gray-400" />
            <span>{event.time}</span>
            <span className="text-gray-300">·</span>
            <span>{event.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <MapPin size={10} className="flex-shrink-0 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <Users size={10} className="flex-shrink-0 text-gray-400" />
            <span>{event.attendees} attendees</span>
          </div>
        </div>


      </div>
    </motion.div>
  );
});

// ─── Day Column ───────────────────────────────────────────────────────────────
function DayColumn({ day, onDelete, onEdit }: { day: Day; onDelete: (id: string) => void; onEdit: (event: Event) => void }) {
  return (
    <motion.div
      layout
      className={`flex-1 min-w-0 rounded-2xl p-4 flex flex-col gap-3 border transition-colors ${day.isToday
        ? "bg-gradient-to-b from-indigo-50 to-blue-50/50 border-indigo-200 shadow-md shadow-indigo-100/60"
        : "bg-white border-gray-100 shadow-sm"
        }`}
    >
      <div className="mb-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold ${day.isToday ? "text-indigo-700" : "text-gray-800"}`}>{day.name}</h3>
            <p className={`text-xs mt-0.5 ${day.isToday ? "text-indigo-500 font-semibold" : "text-gray-400"}`}>
              {day.isToday ? "Today" : `${day.month} ${day.date}`}
            </p>
          </div>
          {day.isToday && (
            <div className="flex items-center gap-1 bg-indigo-600 text-white rounded-full px-2 py-0.5">
              <Sparkles size={9} />
              <span className="text-[9px] font-semibold">Now</span>
            </div>
          )}
        </div>
        {day.events.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className={`h-0.5 flex-1 rounded-full ${day.isToday ? "bg-indigo-200" : "bg-gray-100"}`} />
            <span className={`text-[10px] font-medium ${day.isToday ? "text-indigo-400" : "text-gray-400"}`}>
              {day.events.length} event{day.events.length !== 1 ? "s" : ""}
            </span>
            <div className={`h-0.5 flex-1 rounded-full ${day.isToday ? "bg-indigo-200" : "bg-gray-100"}`} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <AnimatePresence mode="popLayout">
          {day.events.map((ev) => (
            <EventCard key={ev.id} event={ev} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </AnimatePresence>
        {day.events.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Calendar size={14} className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-300">No events</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function EventModal({ open, onClose, onSave, initial, editingId }: {
  open: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, "id">, day: string, editingId?: string) => void;
  initial?: Partial<Event>;
  editingId?: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd")); // NEW DATE FIELD
  const [time, setTime] = useState(initial?.time ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [attendees, setAttendees] = useState(String(initial?.attendees ?? ""));
  const [color, setColor] = useState(initial?.color ?? "blue");
  const [category, setCategory] = useState(initial?.category ?? "Meeting");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [day, setDay] = useState("Monday");

  // Sync day when date changes
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (newDate) {
      try {
        const d = parseISO(newDate);
        const dayName = format(d, "EEEE");
        if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(dayName)) {
          setDay(dayName);
        }
      } catch (err) {
        console.error("Invalid date", err);
      }
    }
  };

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setTime(initial?.time ?? "");
      setDuration(initial?.duration ?? "");
      setLocation(initial?.location ?? "");
      setAttendees(String(initial?.attendees ?? ""));
      setColor(initial?.color ?? "blue");
      setCategory(initial?.category ?? "Meeting");
      setDescription(initial?.description ?? "");
      setDate(initial?.date ?? format(new Date(), "yyyy-MM-dd"));
    }
  }, [open, initial]);

  const valid = title.trim() && time.trim() && duration.trim();

  const handleSubmit = () => {
    if (!valid) return;
    onSave({ title: title.trim(), time, duration, location, attendees: parseInt(attendees) || 0, color, category, description, date }, day, editingId);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/40 z-40 transition-opacity" onClick={onClose} />
          <motion.div key="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-500">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar size={14} className="text-white" />
                  </div>
                  <span className="font-semibold text-white">{editingId ? "Edit Event" : "New Event"}</span>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Title *</label>
                  <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                    placeholder="Event title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Date *</label>
                    <DatePicker value={date} onChange={handleDateChange} className="h-9 rounded-xl border-gray-200 bg-gray-50 text-sm" />
                  </div>
                  {!editingId && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Day</label>
                      <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={day} onChange={(e) => setDay(e.target.value)}>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Time *</label>
                    <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="10:00 AM" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Duration *</label>
                    <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="1 hour" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Location</label>
                    <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="Room / URL" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Attendees</label>
                    <input type="number" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="0" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${category === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-indigo-300"
                          }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Color</label>
                  <div className="flex gap-2">
                    {EVENT_COLORS.map((c) => (
                      <button key={c.value} onClick={() => setColor(c.value)}
                        className={`w-6 h-6 rounded-full transition-all ${c.bg} ${color === c.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-60 hover:opacity-90"}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Notes</label>
                  <textarea rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    placeholder="Optional notes..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                <button disabled={!valid} onClick={handleSubmit}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-40 disabled:shadow-none transition-all">
                  {editingId ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export function ScheduleView() {
  const [weekIndex, setWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState<Day[][]>(INITIAL_WEEKS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCat] = useState<string>("All");
  const [notifOpen, setNotifOpen] = useState(false);
  const { setHeaderInfo } = useHeader();

  const currentWeek = weeks[weekIndex] ?? weeks[0];
  const totalEvents = currentWeek.reduce((s, d) => s + d.events.length, 0);
  const totalAttendees = currentWeek.reduce((s, d) => d.events.reduce((ss, e) => ss + e.attendees, s), 0);
  const uniqueCategories = Array.from(new Set(currentWeek.flatMap((d) => d.events.map((e) => e.category))));

  const filteredWeek = currentWeek.map((day) => ({
    ...day,
    events: day.events.filter((e) => {
      const matchSearch = !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === "All" || e.category === filterCategory;
      return matchSearch && matchCat;
    }),
  }));

  const firstDay = currentWeek[0];
  const lastDay = currentWeek[4];
  const weekLabel = `${firstDay.month} ${firstDay.date} – ${lastDay.date}, 2026`;
  const isCurrentWeek = weekIndex === 0;

  useEffect(() => {
    setHeaderInfo({
      title: 'SCHEDULE',
      subtitle: 'Weekly Planner',
      icon: Calendar,
      iconColor: "rounded-full bg-[#5260ff] shadow-sm",
      hideHeader: false,
      showSearch: true,
      onSearch: setSearch,
      searchPlaceholder: 'Search...',
      showNotificationBell: true,
      notificationCount: currentWeek.find(d => d.isToday)?.events.length,
      onNotificationClick: () => setNotifOpen(!notifOpen),

      leftActions: (
        <div className="flex items-center ml-2 flex-shrink-0">
          <div className="w-px h-6 bg-border/60 mx-3" />

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
              disabled={weekIndex === 0}
              className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted/30 hover:border-border transition-all flex-shrink-0"
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex flex-col items-center justify-center px-5 py-[5px] mx-0.5 rounded-[20px] border border-border/50 bg-white shadow-sm min-w-[170px] flex-shrink-0">
              <span className="text-foreground font-bold text-[13px] leading-tight tracking-tight whitespace-nowrap">
                {weekLabel}
              </span>
              <span className="text-muted-foreground/60 text-[10px] leading-tight font-medium mt-[2px] whitespace-nowrap uppercase">
                {isCurrentWeek ? "Current Week" : `Week ${weekIndex + 1}`}
              </span>
            </div>

            <button
              onClick={() => setWeekIndex((i) => Math.min(weeks.length - 1, i + 1))}
              disabled={weekIndex === weeks.length - 1}
              className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted/30 hover:border-border transition-all flex-shrink-0"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ),

      customActions: (
        <div className="flex items-center gap-2">
          <CategoryDropdown value={filterCategory} onChange={setFilterCat} />
        </div>
      )
    });
  }, [
    setHeaderInfo,
    weekIndex,
    weekLabel,
    isCurrentWeek,
    totalEvents,
    totalAttendees,
    filterCategory,
    notifOpen,
    currentWeek
  ]);

  const handleAddEvent = (event: Omit<Event, "id">, dayName: string) => {
    const id = `e_${Date.now()}`;
    setWeeks((prev) => prev.map((week, wi) => wi !== weekIndex ? week :
      week.map((day) => day.name === dayName ? { ...day, events: [...day.events, { ...event, id }] } : day)
    ));
  };

  const handleEditEvent = (updated: Omit<Event, "id">, _day: string, editingId?: string) => {
    setWeeks((prev) => prev.map((week, wi) => wi !== weekIndex ? week :
      week.map((day) => ({ ...day, events: day.events.map((e) => e.id === editingId ? { ...e, ...updated } : e) }))
    ));
  };

  const handleDeleteEvent = (id: string) => {
    setWeeks((prev) => prev.map((week) =>
      week.map((day) => ({ ...day, events: day.events.filter((e) => e.id !== id) }))
    ));
  };

  const openEdit = (event: Event) => { setEditEvent(event); setModalOpen(true); };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50/30 to-indigo-50/40 flex flex-col overflow-hidden">
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-6 top-16 z-50 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-600">Upcoming today</span>
            </div>
            {currentWeek.find((d) => d.isToday)?.events.map((ev) => {
              const c = getColor(ev.color);
              return (
                <div key={ev.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.bar }} />
                  <div>
                    <p className="text-xs font-medium text-gray-800">{ev.title}</p>
                    <p className="text-[10px] text-gray-400">{ev.time} · {ev.duration}</p>
                  </div>
                </div>
              );
            })}
            {!currentWeek.find((d) => d.isToday)?.events.length && (
              <div className="px-4 py-4 text-center text-xs text-gray-400">No events today</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Week Grid ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto w-full mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-white shadow-sm flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)] flex-shrink-0" />
              <span className="text-foreground/80 text-[11px] font-medium whitespace-nowrap">{totalEvents} events</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-white shadow-sm flex-shrink-0">
              <Users size={12} className="text-indigo-400 flex-shrink-0" />
              <span className="text-foreground/80 text-[11px] font-medium whitespace-nowrap">{totalAttendees} attendees</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setEditEvent(undefined); setModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#5260ff] to-indigo-600 text-white text-[11px] font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={14} strokeWidth={3} />
            <span>ADD EVENT</span>
          </motion.button>
        </div>

        <div className="max-w-screen-2xl mx-auto h-full w-full flex flex-col lg:flex-row gap-4">
          {filteredWeek.map((day) => (
            <DayColumn key={day.name} day={day} onDelete={handleDeleteEvent} onEdit={openEdit} />
          ))}
        </div>
      </main>


      {/* ── Modal ────────────────────────────────────────────────────── */}
      <EventModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditEvent(undefined); }}
        onSave={editEvent ? handleEditEvent : handleAddEvent}
        initial={editEvent}
        editingId={editEvent?.id}
      />
    </div>
  );
}


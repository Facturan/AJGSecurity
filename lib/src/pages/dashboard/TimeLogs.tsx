import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Send, X } from 'lucide-react';
import { useHeader } from './components/Header';

export function TimeLogs() {
  const { setHeaderInfo } = useHeader();
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('In');

  useEffect(() => {
    setHeaderInfo({
      title: 'Time Logs',
      subtitle: 'Manage and review employee time logs',
      icon: Clock,
      searchPlaceholder: 'Search time logs...',
      showSearch: false
    });
  }, [setHeaderInfo]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 w-full max-w-md relative">

        <h2 className="text-center text-lg font-semibold text-slate-600 mb-6">Time Logs</h2>

        <div className="space-y-4">
          <fieldset className="border border-slate-300 rounded-lg px-3 pb-2 pt-1 focus-within:border-slate-400 transition-colors">
            <legend className="px-1 text-xs text-slate-400 font-medium">Date</legend>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                defaultValue="03/09/2026"
                className="w-full text-[15px] font-semibold text-slate-800 focus:outline-none bg-transparent"
              />
            </div>
          </fieldset>

          <fieldset className="border border-slate-300 rounded-lg px-3 pb-2 pt-1 focus-within:border-slate-400 transition-colors">
            <legend className="px-1 text-xs text-slate-400 font-medium">Time</legend>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                defaultValue="05:02"
                className="w-full text-[15px] font-semibold text-slate-800 focus:outline-none bg-transparent"
              />
              <span className="text-[15px] font-bold text-slate-400 ml-2">PM</span>
            </div>
          </fieldset>

          <div className="relative">
            <fieldset
              onClick={() => setIsModeOpen(!isModeOpen)}
              className={`border rounded-lg px-3 pb-2 pt-1 transition-colors relative group cursor-pointer ${isModeOpen ? 'border-slate-400' : 'border-slate-300'} hover:border-slate-400`}
            >
              <legend className={`px-1 text-xs font-medium transition-colors ${isModeOpen ? 'text-slate-600' : 'text-slate-400'}`}>Mode</legend>
              <div className="flex items-center justify-between w-full relative h-[22px]">
                <span className="text-[15px] font-semibold text-slate-800 select-none">{selectedMode}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isModeOpen ? 'rotate-180' : ''}`} />
              </div>
            </fieldset>

            {isModeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsModeOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {['In', 'Out'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setSelectedMode(mode);
                        setIsModeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[15px] font-semibold hover:bg-slate-50 transition-colors ${selectedMode === mode ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="pt-2">
            <textarea
              placeholder="Remarks"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-[15px] text-slate-800 focus:outline-none focus:border-slate-400 transition-colors min-h-[100px] resize-none placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              <Send className="w-4 h-4" />
              Submit
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-500 text-slate-500 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

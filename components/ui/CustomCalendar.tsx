'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
}

export function CustomCalendar({ selectedDate, onChange, label = 'Select Date' }: CustomCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Format to YYYY-MM-DD
    const offset = newDate.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(newDate.getTime() - offset)).toISOString().split('T')[0];
    
    onChange(localISOTime);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none flex items-center justify-between transition-colors"
      >
        <span>
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select a date'}
        </span>
        <CalendarIcon className="w-4 h-4 text-slate-400" />
      </button>

      {/* Calendar Popup */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 w-64 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button 
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>
              <button 
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[9px] font-bold text-slate-400 uppercase">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = 
                  selectedDateObj.getDate() === day && 
                  selectedDateObj.getMonth() === currentMonth.getMonth() &&
                  selectedDateObj.getFullYear() === currentMonth.getFullYear();
                  
                const isToday = 
                  new Date().getDate() === day && 
                  new Date().getMonth() === currentMonth.getMonth() &&
                  new Date().getFullYear() === currentMonth.getFullYear();

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    className={`
                      w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-all text-xs font-medium
                      ${isSelected 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                        : isToday
                        ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

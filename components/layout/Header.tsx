'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Plus, 
  LogOut,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ui/theme-provider';
import { useAuth } from '../ui/AuthProvider';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { session, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'New Quotation Request', desc: 'Vance Heights requested 6 Casement Windows', time: '10m ago' },
    { id: 2, title: 'Production Completed', desc: 'Project PRJ-2026-003 is ready for delivery', time: '1h ago' },
    { id: 3, title: 'Settings Updated', desc: 'New company signature uploaded', time: '3h ago' },
  ];

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 transition-colors">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Hamburger Menu Button */}
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients, projects, RAL codes..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div ref={dropdownRef} className="flex items-center gap-2 sm:gap-3 ml-2">
        {/* Quick Action Button */}
        <Link
          href="/projects/new"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-sm hover:shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Quote</span>
        </Link>


        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 sm:p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notifications</h4>
                <span className="text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full font-semibold">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-100">{n.title}</h5>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 sm:pl-2 sm:pr-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden shrink-0">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold leading-none">{session?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">ADL UPVC</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Administrator</p>
                <p className="text-[11px] text-slate-400 truncate">{session?.email || 'info@adlupvc.com'}</p>
              </div>
              <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <User className="w-3.5 h-3.5" /> Profile & Settings
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


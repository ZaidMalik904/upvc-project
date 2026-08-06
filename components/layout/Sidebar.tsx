'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderPlus, 
  Users, 
  Settings, 
  FileText, 
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../ui/AuthProvider';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Project', href: '/projects/new', icon: FolderPlus, badge: 'Quote' },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects & Quotes', href: '/projects', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ 
  isCollapsed = false, 
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose 
}: SidebarProps) {
  const pathname = usePathname();
  const { session } = useAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onMobileClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Desktop & Mobile Container */}
      <aside 
        className={cn(
          "bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 border-r border-slate-800 shadow-2xl transition-all duration-300 ease-in-out",
          // Width based on collapse state for desktop
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile state drawer sliding
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header with Toggle Arrow at top */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-800 bg-slate-950/60 transition-all duration-300",
          isCollapsed && !isMobileOpen ? "px-2 justify-center" : "px-4 justify-between"
        )}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden shrink-0">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md shrink-0 overflow-hidden">
              <img src="/logo.png" alt="ADL UPVC Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="transition-opacity duration-200 whitespace-nowrap">
                <h1 className="font-bold text-white tracking-wide text-base leading-none">ADL UPVC</h1>
                <span className="text-[10px] text-sky-400 font-medium tracking-wider uppercase">Doors & Windows</span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Arrow Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                "hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors shrink-0",
                isCollapsed && !isMobileOpen ? "p-1.5 ml-1" : "p-2"
              )}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}


          {/* Mobile Close Button */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {(!isCollapsed || isMobileOpen) && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          )}

          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-100',
                  isCollapsed && !isMobileOpen && 'justify-center px-0'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-5 h-5 shrink-0 transition-colors', isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400')} />
                  {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}
                </div>

                {(!isCollapsed || isMobileOpen) && (
                  item.badge ? (
                    <span className={cn(
                      'px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider',
                      isActive ? 'bg-white/20 text-white' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    )}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={cn('w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity', isActive && 'opacity-0')} />
                  )
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Info Card */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="p-4 m-3 rounded-xl bg-slate-850 border border-slate-800/80 bg-gradient-to-b from-slate-800/50 to-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">{session?.name || 'Commercial Mode'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              UPVC Profile Estimator & Live Fabrication System
            </p>
          </div>
        ) : (
          <div className="p-3 text-center border-t border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mx-auto" title="Commercial Mode Active" />
          </div>
        )}
      </aside>
    </>
  );
}


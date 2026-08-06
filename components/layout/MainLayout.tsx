'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useAuth } from '../ui/AuthProvider';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      <div className="print:hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
      </div>

      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out print:!ml-0",
          isCollapsed ? "lg:ml-20" : "lg:ml-64",
          "ml-0"
        )}
      >
        <div className="print:hidden">
          <Header onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />
        </div>
        {children}
      </div>
    </div>
  );
}

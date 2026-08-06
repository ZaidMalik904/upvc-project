'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Users, 
  FolderCheck, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  Eye, 
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/ui/AuthProvider';
import { getStoredClients, getStoredProjects } from '@/lib/store';
import { Project } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { session } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientsCount, setClientsCount] = useState(0);

  useEffect(() => {
    getStoredProjects().then(setProjects);
    getStoredClients().then(clients => setClientsCount(clients.length));
  }, []);

  const pendingQuotes = projects.filter((p) => p.status === 'Pending');
  const completedQuotes = projects.filter((p) => p.status === 'Completed' || p.status === 'In Production');
  const totalValuation = projects.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <MainLayout>
        <main className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 flex-1">

          {/* Welcome Card Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                  Live Operations Overview
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Welcome Back, {session?.name || 'Commercial Admin'} 👋
                </h1>
                <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
                  Here is your real-time summary for UPVC window & door quotations, manufacturing pipelines, and active client orders.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/projects/new"
                  className="px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 group whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  <span>Create Quotation</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 3 Core Metric Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total Clients */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Clients</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{clientsCount}</h3>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Active client portfolio</p>
            </div>

            {/* Total Projects */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Projects</span>
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <FolderCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-3 mb-1">{projects.length}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Total orders placed</p>
            </div>
            </div>



            {/* Completed Quotations */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed / Orders</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{completedQuotes.length}</h3>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  94% Approved
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">In fabrication / Delivered</p>
            </div>
          </div>

          {/* Recent Projects Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Projects & Quotations</h3>
                <p className="text-xs text-slate-400">Manage client fabrication specs and order statuses</p>
              </div>
              <Link
                href="/projects"
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 sm:ml-auto"
              >
                View All Projects <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[900px] whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Project Ref</th>
                    <th className="py-3.5 px-4">Client Name</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-center">Products</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {project.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{project.client?.name || 'Unknown Client'}</p>
                        <p className="text-[10px] text-slate-400">{project.projectName}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(project.projectDate)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-slate-700 dark:text-slate-300">
                          {project.products.length} Units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
    </MainLayout>
  );
}


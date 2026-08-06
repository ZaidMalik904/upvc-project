'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { getStoredProjects } from '@/lib/store';
import { Project } from '@/types';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    getStoredProjects().then(setProjects);
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      String(p.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
        <main className="p-4 sm:p-6 md:p-8 space-y-6 flex-1">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Projects & Quotations ({projects.length})
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Commercial UPVC orders, glass specifications, and live pricing statuses
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/projects/new"
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Quotation
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ref, project, or client..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/40 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[900px] whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Ref Code</th>
                    <th className="py-3.5 px-4">Project Name</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Issue Date</th>
                    <th className="py-3.5 px-4 text-center">Items</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-sky-600 dark:text-sky-400">
                        {project.id}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                        {project.projectName}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{project.client?.name || 'Unknown Client'}</p>
                        <p className="text-[10px] text-slate-400">{project.client?.email || 'No Email'}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {formatDate(project.projectDate)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-slate-700 dark:text-slate-300">
                          {project.products.length} UPVC Specs
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
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


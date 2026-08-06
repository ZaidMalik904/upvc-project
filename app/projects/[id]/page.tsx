'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuotationPDFView } from '@/components/ui/QuotationPDFView';
import { WindowDoorGraphic } from '@/components/ui/WindowDoorGraphic';
import { getStoredProjects, getStoredSettings } from '@/lib/store';
import { Project, CompanySettings } from '@/types';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Calendar, 
  User, 
  Layers, 
  CheckCircle2,
  Printer,
  Download
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const id = params?.id as string;
    getStoredSettings().then(setSettings);
    getStoredProjects().then(all => {
      const found = all.find((p) => p.id === id) || all[0];
      if (found) {
        setProject(found);
        // Expand all by default
        const initial: Record<string, boolean> = {};
        found.products.forEach((p, idx) => {
          initial[p.id || idx] = true;
        });
        setExpandedCards(initial);
      }
    });
  }, [params?.id]);

  const toggleExpand = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!project) return null;

  return (
    <MainLayout>
        <main className="p-4 sm:p-6 md:p-8 space-y-8 flex-1 max-w-6xl mx-auto w-full">

          {/* Back Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/projects')}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Projects List
            </button>

          </div>

          {/* Project Summary Banner Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Project Reference</span>
              <h1 className="text-xl font-black text-slate-900 dark:text-white mt-1">{project.projectName}</h1>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-mono font-bold mt-0.5">{project.id}</p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Details</span>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">{project.client?.name || 'Unknown Client'}</p>
              <p className="text-xs text-slate-500">{project.client?.email || 'No Email'} • {project.client?.phone || 'No Phone'}</p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Items</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {project.products.length} Units
              </h2>
              <p className="text-xs text-slate-400">Issued Date: {formatDate(project.projectDate)}</p>
            </div>
          </div>

          {/* Expandable Product Cards List */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-500" /> Fabricated Products ({project.products.length} Items)
            </h3>

            {project.products.map((item, idx) => {
              const cardKey = String(item.id || `${idx}`);
              const isExpanded = expandedCards[cardKey];

              return (
                <div
                  key={cardKey}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(cardKey)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.type}</h4>
                        <p className="text-xs text-slate-400">
                          {item.width} × {item.height} mm • Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm text-sky-600 dark:text-sky-400">
                        {formatCurrency((item.unitPrice || 0) * item.quantity)}
                      </span>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-in fade-in">
                      <div className="md:col-span-4">
                        <WindowDoorGraphic type={item.type} className="w-full h-40" />
                      </div>

                      <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Dimensions</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.width}mm × {item.height}mm</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Frame RAL Color</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.frameColor}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Glass Type</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.glassType}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl sm:col-span-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Hardware Set</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.hardware}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Unit Price</span>
                          <p className="font-bold text-sky-600 dark:text-sky-400 mt-0.5">{formatCurrency(item.unitPrice || 0)}</p>
                        </div>
                        {item.remarks && (
                          <div className="col-span-2 sm:col-span-3 bg-sky-50 dark:bg-sky-950/40 p-3 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
                            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase">Custom Remarks</span>
                            <p className="text-slate-700 dark:text-slate-300 mt-0.5 italic">{item.remarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quotation PDF Preview Section */}
          {settings && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Commercial Invoice Layout</h3>
              <QuotationPDFView project={project} settings={settings} />
            </div>
          )}
        </main>
    </MainLayout>
  );
}


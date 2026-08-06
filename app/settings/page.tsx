'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/toast';
import { getStoredSettings, saveSettings } from '@/lib/store';
import { CompanySettings } from '@/types';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Upload, 
  Save, 
  FileText, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettingsState] = useState<CompanySettings | null>(null);

  useEffect(() => {
    getStoredSettings().then(setSettingsState);
  }, []);

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setSettingsState((prev) => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      await saveSettings(settings);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        description: 'Company branding and PDF options updated',
      });
    }
  };

  if (!settings) return null;

  return (
    <MainLayout>
        <main className="p-4 sm:p-6 md:p-8 space-y-8 flex-1 max-w-5xl mx-auto w-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Company & Quotation Settings
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize company branding, address, logo, and footer disclaimer for PDFs
              </p>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Company Info Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-500" /> Commercial Profile Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GST Number</label>
                    <input
                      type="text"
                      value={settings.gstNumber || ''}
                      onChange={(e) => handleChange('gstNumber', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none uppercase"
                      placeholder="e.g. 09AAACC1234D1Z5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Office & Factory Address</label>
                    <textarea
                      rows={2}
                      value={settings.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quotation Disclaimer Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-500" /> Terms & Quotation Footer Text
                </h3>

                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">PDF Footer Disclaimer</label>
                  <textarea
                    rows={3}
                    value={settings.footerText}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>


            </div>

            {/* Right Branding Preview Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Logo Upload Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-center">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Company Logo</h4>
                
                <div className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden group">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="max-h-full object-contain relative z-10" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400" />
                  )}
                  {/* File Upload Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer">
                    <span className="text-white text-xs font-bold">Click to Upload</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-30"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleChange('logoUrl', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Or paste Logo URL</label>
                  <input
                    type="text"
                    value={settings.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </form>
        </main>
    </MainLayout>
  );
}


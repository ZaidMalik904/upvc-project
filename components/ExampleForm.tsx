'use client';

import React, { useState } from 'react';
import { SubmissionData, SubmissionResponse } from '@/types/submission';

export default function ExampleForm() {
  const [formData, setFormData] = useState<SubmissionData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SubmissionResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data: SubmissionResponse = await res.json();
      setResponse(data);
      if (data.success) {
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      }
    } catch (error: any) {
      setResponse({ success: false, message: '', error: 'An error occurred during submission.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-xl shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Submit Information</h2>
      
      {response && (
        <div className={`p-4 mb-6 rounded-lg ${response.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' : 'bg-red-50 text-red-800 border border-red-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900'}`}>
          <p className="font-medium text-sm">{response.message || response.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message *</label>
          <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white"></textarea>
        </div>
        
        <button disabled={loading} type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-50 flex justify-center items-center gap-2">
          {loading ? (
             <>
               <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
               Processing...
             </>
          ) : 'Submit & Generate PDF'}
        </button>
      </form>
    </div>
  );
}

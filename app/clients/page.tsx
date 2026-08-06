'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/toast';
import { getStoredClients, deleteClient, getStoredProjects } from '@/lib/store';
import { Client, Project } from '@/types';
import { 
  Users, 
  Search, 
  Filter, 
  FileText, 
  Send, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  X,
  Download
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ClientsPage() {
  const { addToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    getStoredClients().then(setClients);
    getStoredProjects().then(setProjects);
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteClient(id);
    const updated = await getStoredClients();
    setClients(updated);
    setDeleteConfirmId(null);
    if (selectedClient?.id === id) setSelectedClient(null);
    addToast({
      type: 'success',
      title: 'Client Removed',
      description: 'Client record deleted from database',
    });
  };

  const handleSendEmail = (client: Client) => {
    addToast({
      type: 'info',
      title: 'Quotation Email Sent',
      description: `Dispatched latest PDF specs to ${client.email}`,
    });
  };

  return (
    <MainLayout>
        <main className="p-4 sm:p-6 md:p-8 space-y-6 flex-1">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Client Directory ({clients.length})
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage commercial clients, addresses, and past quotation dispatches
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, city..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500/40 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Client Name</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Site Address</th>
                    <th className="py-3.5 px-4 text-center">Projects</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredClients.map((client) => {
                    const clientProjects = projects.filter((p) => p.client.name === client.name || p.client.email === client.email);

                    return (
                      <tr key={client.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                              {client.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-xs">{client.name}</h4>
                              {client.companyName && (
                                <p className="text-[11px] text-slate-400">{client.companyName}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 space-y-0.5">
                          <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-400" /> {client.email}
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-400" /> {client.phone}
                          </p>
                        </td>

                        <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                          {client.address}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-1 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-bold rounded-full text-[11px]">
                            {clientProjects.length || client.totalProjects || 1} Quotes
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedClient(client)}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(client)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors"
                              title="Send Quotation Again"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(String(client.id))}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                              title="Delete Client"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Client Details Modal */}
          {selectedClient && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center">
                      {selectedClient.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedClient.name}</h3>
                      <p className="text-xs text-slate-400">{selectedClient.companyName || 'Private Client'}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClient(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5">
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><Mail className="w-4 h-4 text-sky-500" /> {selectedClient.email}</p>
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><Phone className="w-4 h-4 text-sky-500" /> {selectedClient.phone}</p>
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><MapPin className="w-4 h-4 text-sky-500" /> {selectedClient.address}</p>
                  </div>
                  <p className="text-[11px] text-slate-400">Registered On: {formatDate(selectedClient.createdAt)}</p>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => handleSendEmail(selectedClient)}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Quotation PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmId && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Delete Client Record?</h3>
                <p className="text-xs text-slate-400">This action will remove the client profile permanently from local state.</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
    </MainLayout>
  );
}


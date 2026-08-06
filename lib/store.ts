import { Client, Project, CompanySettings } from '@/types';
import { INITIAL_CLIENTS, INITIAL_PROJECTS, INITIAL_COMPANY_SETTINGS } from './mockData';

// We have migrated from localStorage to a MySQL backend via API routes.
// These functions are now async wrappers around the API endpoints.

export async function getStoredClients(): Promise<Client[]> {
  try {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error('Failed to fetch clients');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function saveClient(client: Partial<Client>): Promise<any> {
  try {
    const exists = client.id;
    if (exists && typeof client.id === 'string' && client.id.startsWith('cli-')) {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      return await res.json();
    } else {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      return await res.json();
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    await fetch(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getStoredProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function saveProject(project: Project): Promise<void> {
  try {
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getStoredSettings(): Promise<CompanySettings> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (error) {
    console.error(error);
    return INITIAL_COMPANY_SETTINGS;
  }
}

export async function saveSettings(settings: CompanySettings): Promise<void> {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  } catch (error) {
    console.error(error);
  }
}

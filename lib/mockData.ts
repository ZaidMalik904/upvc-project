import { Client, Project, CompanySettings } from '@/types';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  name: '',
  logoUrl: '/logo.png',
  email: '',
  phone: '',
  address: '',
  footerText: '',
  signatureUrl: '',
  currencySymbol: '₹',
};

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_PROJECTS: Project[] = [];

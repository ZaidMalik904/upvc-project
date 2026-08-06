export type ProductType = 
  | ''
  | 'Sliding Window'
  | 'Casement Window'
  | 'Fixed Window'
  | 'French Window'
  | 'Sliding Door'
  | 'Casement Door'
  | 'Main Gate'
  | 'Folding Door'
  | 'Custom Product';

export type GlassType = 
  | ''
  | 'Single Clear (5mm)'
  | 'Double Glazed (5+12A+5mm)'
  | 'Toughened Glass (6mm)'
  | 'Frosted/Obscure (5mm)'
  | 'Low-E Double Glazed'
  | 'Laminated Safety Glass';

export type HardwareOption = 
  | ''
  | 'Standard Silver Handles & Multi-point Lock'
  | 'Premium Black Anodized Fittings'
  | 'Keyed Security Lockset'
  | 'Heavy Duty Stainless Hinge & Handle Set'
  | 'Flush Pull & Pop-up Lock';

export interface ProductItem {
  id: string | number;
  type: ProductType;
  width: number; // in mm
  height: number; // in mm
  quantity: number;
  glassType: GlassType;
  frameColor: string; // RAL code e.g. "RAL 9016 White"
  hardware: HardwareOption;
  remarks?: string;
  unitPrice?: number;
}

export interface Client {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  companyName?: string;
  gstNumber?: string;
  createdAt: string;
  totalProjects?: number;
}

export type ProjectStatus = 'Pending' | 'In Production' | 'Completed' | 'Cancelled';

export interface Project {
  id: string | number;
  projectName: string;
  projectDate: string;
  client: Client;
  products: ProductItem[];
  status: ProjectStatus;
  totalAmount: number;
  discountPercent?: number;
  taxPercent?: number;
  createdAt: string;
}

export interface CompanySettings {
  name: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  footerText: string;
  signatureUrl: string;
  currencySymbol: string;
}

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { MultiStepProgressBar } from '@/components/ui/MultiStepProgressBar';
import { CustomCalendar } from '@/components/ui/CustomCalendar';
import { ProductCard } from '@/components/ui/ProductCard';
import { QuotationPDFView } from '@/components/ui/QuotationPDFView';
import { useToast } from '@/components/ui/toast';
import { getStoredSettings, saveProject, getStoredClients, saveClient } from '@/lib/store';

import { Client, ProductItem, Project, CompanySettings } from '@/types';
import { Plus, ArrowRight, ArrowLeft, Save, CheckCircle2, UserPlus } from 'lucide-react';



const STEPS = [
  { id: 1, title: 'Client Details', subtitle: 'Contact & Reference' },
  { id: 2, title: 'Product Details', subtitle: 'Dynamic UPVC Items' },
  { id: 3, title: 'Preview & PDF', subtitle: 'Quotation Generation' },
];

const DEFAULT_PRODUCT: ProductItem = {
  id: 'prod-new-1',
  type: 'Sliding Window',
  width: 1500,
  height: 1200,
  quantity: 1,
  glassType: 'Single Clear (5mm)',
  frameColor: 'RAL 9016 White',
  hardware: 'Standard Silver Handles & Multi-point Lock',
  remarks: '',
  unitPrice: 1250,
};

export default function NewProjectPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [clientData, setClientData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    altPhone: '',
    gstNumber: '',
    address: '',
    projectDate: new Date().toISOString().split('T')[0],
  });

  // Step 2 Products Array State
  const [products, setProducts] = useState<ProductItem[]>([
    { ...DEFAULT_PRODUCT, id: `prod-${Date.now()}` }
  ]);


  useEffect(() => {
    getStoredSettings().then(setSettings);
    const savedDraft = localStorage.getItem('draftQuotation_v2');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.clientData) setClientData(parsed.clientData);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      } catch (e) {
        console.error("Failed to parse draft quotation", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save to draftQuotation_v2 on change
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('draftQuotation_v2', JSON.stringify({
      clientData,
      products,
      currentStep
    }));
  }, [clientData, products, currentStep, isMounted]);

  if (!isMounted) {
    return null; // Prevent SSR hydration mismatch
  }

  const validateStep1 = () => {
    if (!clientData.name || !clientData.email || !clientData.phone || !clientData.address) {
      addToast({
        type: 'error',
        title: 'Missing Information',
        description: 'Please fill all required fields marked with a star (*).',
      });
      return false;
    }
    return true;
  };

  // Product actions
  const handleAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    setProducts((prev) => [
      ...prev,
      { ...DEFAULT_PRODUCT, id: newId, type: 'Casement Window' },
    ]);
    addToast({
      type: 'info',
      title: 'Product Added',
      description: 'New UPVC card added to quotation builder',
    });
  };

  const handleUpdateProduct = (index: number, updated: ProductItem) => {
    setProducts((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length <= 1) {
      addToast({
        type: 'error',
        title: 'Cannot Remove',
        description: 'Quotation must include at least 1 UPVC item',
      });
      return;
    }
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDuplicateProduct = (index: number) => {
    const item = products[index];
    const duplicated: ProductItem = {
      ...item,
      id: `prod-dup-${Date.now()}`,
    };
    setProducts((prev) => [...prev, duplicated]);
    addToast({
      type: 'success',
      title: 'Item Duplicated',
      description: `Copied ${item.type} specifications`,
    });
  };

  // Final submission logic
  const handleFinalSave = async () => {
    // Basic data validation
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (!products.length) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please add at least one UPVC product item.',
      });
      setCurrentStep(2);
      return;
    }

    const newClient: Partial<Client> = {
      name: clientData.name,
      companyName: clientData.companyName,
      email: clientData.email,
      phone: clientData.phone,
      altPhone: clientData.altPhone,
      gstNumber: clientData.gstNumber,
      address: clientData.address,
      createdAt: new Date().toISOString().split('T')[0],
      totalProjects: 1,
    };

    const clientRes = await saveClient(newClient);
    const dbClientId = clientRes?.id;

    const calculatedTotal = products.reduce(
      (sum, p) => sum + (p.unitPrice || 0) * p.quantity,
      0
    );

    const newProject: Project = {
      id: `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      projectName: clientData.name,
      projectDate: clientData.projectDate,
      client: { ...newClient, id: dbClientId } as Client,
      products,
      status: 'Pending',
      totalAmount: calculatedTotal,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Generate exact PDF from UI
    let pdfBase64 = null;
    try {
      const element = document.getElementById('quotation-pdf-document');
      if (element) {
        // add toast to notify user
        addToast({ type: 'info', title: 'Processing', description: 'Generating PDF and sending email...' });
        
        // dynamically import to avoid SSR issues
        const { toJpeg } = await import('html-to-image');
        const { jsPDF } = await import('jspdf');
        
        // Temporarily force dimensions on the element to avoid mobile responsive issues during capture
        const originalMaxWidth = element.style.maxWidth;
        const originalWidth = element.style.width;
        element.style.maxWidth = 'none';
        element.style.width = '850px';

        // Wait a tiny bit for the browser to apply the forced width layout
        await new Promise(resolve => setTimeout(resolve, 50));

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const chunks = Array.from(element.querySelectorAll('.pdf-chunk')) as HTMLElement[];
        
        let currentY = 0;

        for (const chunk of chunks) {
            // Use html-to-image for each individual chunk
            const dataUrl = await toJpeg(chunk, { 
              quality: 0.98, 
              pixelRatio: 2,
              backgroundColor: '#ffffff',
              width: 850,
              style: {
                transform: 'scale(1)',
                transformOrigin: 'top left',
                borderRadius: '0',
                boxShadow: 'none',
                margin: '0'
              }
            });

            const chunkHeightMM = (chunk.offsetHeight * pdfWidth) / 850;

            // If chunk exceeds remaining page height, add a new page!
            // (Only if we aren't already at the top of a page to prevent empty pages)
            if (currentY + chunkHeightMM > pageHeight - 5 && currentY > 0) {
                pdf.addPage();
                currentY = 0;
            }

            pdf.addImage(dataUrl, 'JPEG', 0, currentY, pdfWidth, chunkHeightMM);
            currentY += chunkHeightMM;
        }
        
        // Restore original styles
        element.style.maxWidth = originalMaxWidth;
        element.style.width = originalWidth;

        pdfBase64 = pdf.output('datauristring');
      }
    } catch (err) {
      console.error('Failed to generate PDF locally', err);
    }

    await saveProject({ ...newProject, pdfBase64 } as any);

    // Clear local storage draft upon success
    localStorage.removeItem('draftQuotation_v2');

    addToast({
      type: 'success',
      title: 'Quotation Created!',
      description: `Project ${newProject.id} saved locally`,
    });
    router.push('/projects');
  };



  // Construct temporary preview object
  const currentPreviewProject: Project = {
    id: `QUOTE-DRAFT`,
    projectName: clientData.name,
    projectDate: clientData.projectDate,
    client: {
      id: 'draft-cli',
      name: clientData.name,
      companyName: clientData.companyName,
      email: clientData.email,
      phone: clientData.phone,
      altPhone: clientData.altPhone,
      gstNumber: clientData.gstNumber,
      address: clientData.address,
      createdAt: clientData.projectDate,
    },
    products,
    status: 'Pending',
    totalAmount: products.reduce((sum, p) => sum + (p.unitPrice || 0) * p.quantity, 0),
    createdAt: clientData.projectDate,
  };

  return (
    <MainLayout>
        <main className="p-4 sm:p-6 md:p-8 space-y-8 flex-1 max-w-6xl mx-auto w-full print:p-0">

          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:hidden">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                New Project Quotation
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                3-Step multi-step wizard for dynamic UPVC specs & invoice creation
              </p>
            </div>

            <MultiStepProgressBar
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={(s) => {
                if (s > 1 && !validateStep1()) return;
                setCurrentStep(s);
              }}
            />
          </div>

          {/* STEP 1: CLIENT DETAILS */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-sky-500" /> Step 1: Client & Project Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Enter contact information and project dates</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    placeholder="e.g. Harrison Ford"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Client Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    placeholder="client@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={clientData.companyName}
                    onChange={(e) => setClientData({ ...clientData, companyName: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    placeholder="e.g. Apex Builders"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Alternative Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={clientData.altPhone}
                    onChange={(e) => setClientData({ ...clientData, altPhone: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    placeholder="+1 (555) 000-0001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={clientData.gstNumber}
                    onChange={(e) => setClientData({ ...clientData, gstNumber: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Site Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={clientData.address}
                    onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                    placeholder="Full street address, city, state"
                  />
                </div>

                <div className="relative">
                  <CustomCalendar 
                    label="Quotation Date" 
                    selectedDate={clientData.projectDate} 
                    onChange={(date) => setClientData({ ...clientData, projectDate: date })} 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  Proceed to Product Specs <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DYNAMIC PRODUCT DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Step 2: Add UPVC Windows & Doors ({products.length} Items)
                  </h3>
                  <p className="text-xs text-slate-400">Configure dimensions, RAL colors, glass, and hardware</p>
                </div>

                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" /> Add Product Card
                </button>
              </div>

              {/* Dynamic Product Cards */}
              <div className="space-y-4">
                {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onUpdate={(updated) => handleUpdateProduct(index, updated)}
                  onRemove={() => handleRemoveProduct(index)}
                  onDuplicate={() => handleDuplicateProduct(index)}
                />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Client Info
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Preview Quotation & PDF <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & FINAL SAVE */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Step 3: Quotation Preview & Confirmation
                  </h3>
                  <p className="text-xs text-slate-400">Review layout before saving project to database</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit Specs
                  </button>

                  <button
                  type="button"
                  onClick={handleFinalSave}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Save className="w-4 h-4" /> Save & Create Project
                </button>
                </div>
              </div>

              {/* PDF Invoice Live View */}
              {settings && (
                <QuotationPDFView
                  project={currentPreviewProject}
                  settings={settings}
                  onDownloadPDF={() => {
                    addToast({
                      type: 'success',
                      title: 'Generating PDF',
                      description: 'Invoice layout prepared for printing/download',
                    });
                    window.print();
                  }}
                />
              )}
            </div>
          )}
        </main>
    </MainLayout>
  );
}

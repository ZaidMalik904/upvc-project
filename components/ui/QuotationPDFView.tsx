'use client';

import React from 'react';
import { Project, CompanySettings } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { WindowDoorGraphic } from './WindowDoorGraphic';
import { Download, FileText, Printer, Building2, Phone, Mail, MapPin } from 'lucide-react';

interface QuotationPDFViewProps {
  project: Project;
  settings: CompanySettings;
  onDownloadPDF?: () => void;
}

export function QuotationPDFView({ project, settings, onDownloadPDF }: QuotationPDFViewProps) {
  const totalArea = 1112;
  const ratePerSqFt = 500;

  // Use Area * Rate instead of itemized unit prices for subtotal
  const subtotal = totalArea * ratePerSqFt;
  const tax = subtotal * (project.taxPercent ? project.taxPercent / 100 : 0.08);
  const grandTotal = subtotal + tax;

  const totalQuantity = project.products.reduce((sum, item) => sum + item.quantity, 0);
  const advance = grandTotal * 0.6;
  const balance = grandTotal * 0.4;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Print / Export Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-lg print:hidden gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-sky-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold">Official Quotation Document</h3>
            <p className="text-xs text-slate-400">Ready for print, download, or presentation</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md transition-colors"
            >
              <Download className="w-4 h-4" /> Generate PDF
            </button>
          )}
        </div>
      </div>

      {/* Print Styles Configuration */}
      <style type="text/css" media="print, screen">
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @page { margin: 15mm; size: auto; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}
      </style>

      {/* Actual Printable Invoice Layout (PDF Style) */}
      <div id="quotation-pdf-document" className="bg-white text-slate-900 rounded-2xl shadow-xl max-w-[850px] mx-auto print:shadow-none print:border-none font-sans relative z-0 overflow-hidden">

        {/* Watermark Logo */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-10 print:opacity-15 z-0">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Watermark" className="w-[70%] max-w-2xl object-contain grayscale" />
          ) : (
            <Building2 className="w-[50%] h-auto text-slate-900" />
          )}
        </div>

        <div className="pdf-chunk px-8 sm:px-10 pt-8 sm:pt-10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-6 border-b-2 border-slate-200 relative z-10 gap-6 print:flex-row print:items-end">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 print:flex-row print:items-center">
              {/* Logo */}
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-16 sm:h-20 w-auto object-contain" />
              ) : (
                <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#185FA4]" />
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{settings.name || "ADL UPVC Doors & Windows"}</h1>
                <p className="mt-1 text-[13px] sm:text-[15px] text-slate-500 capitalize">noida sector 122 , paarthala khanjarpur, UP</p>
              </div>
            </div>
            <div className="text-left sm:text-right print:text-right">
              <p className="text-[13px] sm:text-[14px] text-slate-600">Generated: <span className="font-semibold text-slate-900">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span></p>
              <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1">Ref: <span className="font-semibold text-slate-900">{project.projectName || project.id}</span></p>
            </div>
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-8 sm:gap-10 mb-10 relative z-10 mt-6">
            {/* Vendor */}
            <div>
              <h3 className="text-[#185FA4] font-bold text-[15px] mb-3 tracking-wide uppercase">VENDOR DETAILS</h3>
              <div className="h-0.5 bg-[#185FA4]/20 w-full mb-4"></div>
              <div className="grid grid-cols-[100px_1fr] gap-y-3 text-[14px]">
                <span className="text-slate-500 font-medium">Company:</span>
                <span className="font-bold text-slate-800">{settings.name || "ADL UPVC Doors & Windows"}</span>

                <span className="text-slate-500 font-medium">GST No:</span>
                <span className="font-bold text-slate-800 uppercase">{settings.gstNumber || "09AAACC1234D1Z5"}</span>

                <span className="text-slate-500 font-medium">Phone:</span>
                <span className="font-bold text-slate-800">{settings.phone || "+91 63984 71124"}</span>

                <span className="text-slate-500 font-medium">Service:</span>
                <span className="font-bold text-slate-800 leading-tight">UPVC Doors & Windows<br />Fabrication & Installation</span>
              </div>
            </div>

            {/* Client */}
            <div>
              <h3 className="text-[#185FA4] font-bold text-[15px] mb-3 tracking-wide uppercase">CLIENT DETAILS</h3>
              <div className="h-0.5 bg-[#185FA4]/20 w-full mb-4"></div>
              <div className="grid grid-cols-[100px_1fr] gap-y-3 text-[14px]">
                <span className="text-slate-500 font-medium">Name:</span>
                <span className="font-bold text-slate-800">{project.client.name}</span>

                {project.client.companyName && (
                  <>
                    <span className="text-slate-500 font-medium">Company:</span>
                    <span className="font-bold text-slate-800">{project.client.companyName}</span>
                  </>
                )}

                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-bold text-slate-800">{project.client.email || '-'}</span>

                <span className="text-slate-500 font-medium">Phone:</span>
                <span className="font-bold text-slate-800">{project.client.phone || '-'}</span>

                {project.client.altPhone && (
                  <>
                    <span className="text-slate-500 font-medium">Alt Phone:</span>
                    <span className="font-bold text-slate-800">{project.client.altPhone}</span>
                  </>
                )}

                {project.client.gstNumber && (
                  <>
                    <span className="text-slate-500 font-medium">GST No:</span>
                    <span className="font-bold text-slate-800 uppercase">{project.client.gstNumber}</span>
                  </>
                )}

                <span className="text-slate-500 font-medium">Address:</span>
                <span className="font-bold text-slate-800 leading-tight">{project.client.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fabrication Details & Drawings (PDF & Screen) */}
        <div className="mb-10 space-y-8 block relative z-10 bg-white">
          <div className="pdf-chunk px-8 sm:px-10">
            <h3 className="text-[#185FA4] font-bold text-[15px] mb-4 uppercase tracking-wide border-b border-slate-200 pb-2">1. FABRICATION SPECIFICATIONS & DRAWINGS</h3>
          </div>
          <div className="space-y-12">
            {project.products.map((p, i) => (
              <div key={i} className="pdf-chunk px-8 sm:px-10 flex flex-row items-stretch bg-white/80 backdrop-blur-sm shadow-sm" style={{ pageBreakInside: 'avoid' }}>
                
                <div className="w-full flex flex-row items-stretch border border-slate-200 rounded-xl p-8 bg-white">

                {/* Left 50% - Image with sizes */}
                <div className="w-1/2 flex items-center justify-center shrink-0 pr-8">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <WindowDoorGraphic type={p.type} className="w-48 h-48" />

                    {/* Width Label */}
                    <div className="absolute -top-6 left-0 right-0 flex items-center justify-center">
                      <div className="w-full border-t border-dashed border-sky-400 absolute top-1/2"></div>
                      <span className="bg-slate-50 px-2 text-[13px] font-mono font-bold text-sky-700 relative z-10">W: {p.width} mm</span>
                    </div>

                    {/* Height Label */}
                    <div className="absolute top-0 bottom-0 -right-6 flex flex-col items-center justify-center">
                      <div className="h-full border-l border-dashed border-sky-400 absolute left-1/2"></div>
                      <span
                        className="bg-slate-50 py-2 text-[13px] font-mono font-bold text-sky-700 relative z-10"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        H: {p.height} mm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right 50% - Details List */}
                <div className="w-1/2 pl-8 border-l border-slate-200 flex flex-col justify-center">
                  <h4 className="text-[18px] font-bold text-slate-800 mb-5 uppercase tracking-wide">{p.type}</h4>
                  <div className="grid grid-cols-[110px_1fr] gap-y-3 text-[14px]">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="font-semibold text-slate-900">{p.width} × {p.height} mm</span>

                    <span className="text-slate-500">Color:</span>
                    <span className="font-semibold text-slate-900">{p.frameColor}</span>

                    <span className="text-slate-500">Glass:</span>
                    <span className="font-semibold text-slate-900">{p.glassType}</span>

                    <span className="text-slate-500">Hardware:</span>
                    <span className="font-semibold text-slate-900">{p.hardware}</span>

                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-semibold text-slate-900">{p.quantity} Nos</span>

                    <span className="text-slate-500">Unit Price:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(p.unitPrice || 0, settings.currencySymbol)}</span>

                    <div className="col-span-2 h-px bg-slate-200 my-2 w-full"></div>
                    <span className="text-[#185FA4] font-bold text-[16px] mt-1">Total:</span>
                    <span className="font-black text-[#185FA4] text-[16px] mt-1">{formatCurrency((p.unitPrice || 0) * p.quantity, settings.currencySymbol)}</span>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>

        {/* Costing & Payment */}
        <div className="pdf-chunk px-8 sm:px-10 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-8 mb-16 bg-white" style={{ pageBreakInside: 'avoid' }}>
          <div className="space-y-6">
            <div className="border-2 border-[#185FA4]/10 rounded-xl p-5 shadow-sm">
              <h3 className="text-[#185FA4] font-bold text-[15px] mb-4 uppercase tracking-wide">2. RATE & COSTING</h3>
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Area (Sq.Ft):</span>
                  <span className="font-bold text-slate-900">{totalArea} sq ft</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Rate per Sq.Ft:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(ratePerSqFt, settings.currencySymbol)}</span>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotal, settings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Tax ({project.taxPercent || 8}%):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(tax, settings.currencySymbol)}</span>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="flex justify-between items-center text-[#185FA4] text-lg">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-black">{formatCurrency(grandTotal, settings.currencySymbol)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 shadow-sm">
              <h3 className="text-[#16A34A] font-bold text-[13px] mb-3 uppercase tracking-wide">PAYMENT SCHEDULE</h3>
              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#16A34A] font-bold">Advance Required (60%):</span>
                  <span className="text-[#16A34A] font-bold">{formatCurrency(advance, settings.currencySymbol)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Balance Payment (40%):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(balance, settings.currencySymbol)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pt-10 pb-6 flex flex-col justify-end min-h-[200px]">
            {/* Signature Block */}
            <div className="absolute right-0 bottom-4 w-56 text-center">
              <div
                className="h-16 mb-2 flex items-center justify-center text-[#185FA4]"
                style={{ fontFamily: '"Dancing Script", "Brush Script MT", cursive', fontSize: '34px', lineHeight: '1', transform: 'rotate(-2deg)' }}
              >
                ADL UPVC
              </div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-800 text-[13px]">Authorized Signatory</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{settings.name || "ADL UPVC Doors & Windows"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pdf-chunk px-8 sm:px-10 pb-8 sm:pb-10 border-t border-slate-200 pt-6 text-center bg-white">
          <p className="text-[12px] text-slate-500">
            {settings.footerText || `Thank you for your business! For any queries regarding this quotation, please call ${settings.phone || '+91 63984 71124'}.`}
          </p>
        </div>

      </div>
    </div>
  );
}

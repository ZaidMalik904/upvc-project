'use client';

import React from 'react';
import { ProductItem, ProductType, GlassType, HardwareOption } from '@/types';
import { Trash2, Copy, Layers, Sliders, Palette, Shield } from 'lucide-react';
import { WindowDoorGraphic } from './WindowDoorGraphic';

const PRODUCT_TYPES: ProductType[] = [
  'Sliding Window',
  'Casement Window',
  'Fixed Window',
  'French Window',
  'Sliding Door',
  'Casement Door',
  'Main Gate',
  'Folding Door',
  'Custom Product',
];

const GLASS_TYPES: GlassType[] = [
  'Single Clear (5mm)',
  'Double Glazed (5+12A+5mm)',
  'Toughened Glass (6mm)',
  'Frosted/Obscure (5mm)',
  'Low-E Double Glazed',
  'Laminated Safety Glass',
];

const HARDWARE_OPTIONS: HardwareOption[] = [
  'Standard Silver Handles & Multi-point Lock',
  'Premium Black Anodized Fittings',
  'Keyed Security Lockset',
  'Heavy Duty Stainless Hinge & Handle Set',
  'Flush Pull & Pop-up Lock',
];

const RAL_COLORS = [
  { label: 'White (RAL 9016)', value: 'RAL 9016 White', hex: '#FFFFFF' },
  { label: 'Anthracite Grey (RAL 7016)', value: 'RAL 7016 Anthracite Grey', hex: '#383E42' },
  { label: 'Jet Black (RAL 9005)', value: 'RAL 9005 Jet Black', hex: '#0A0A0A' },
  { label: 'Chocolate Brown (RAL 8017)', value: 'RAL 8017 Chocolate Brown', hex: '#442F29' },
  { label: 'Golden Oak Woodgrain', value: 'Golden Oak Woodgrain', hex: '#9E6432' },
  { label: 'Silver Grey (RAL 7001)', value: 'RAL 7001 Silver Grey', hex: '#8F999F' },
];

interface ProductCardProps {
  product: ProductItem;
  index: number;
  onUpdate: (updated: ProductItem) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export function ProductCard({ product, index, onUpdate, onRemove, onDuplicate }: ProductCardProps) {
  const handleChange = (field: keyof ProductItem, value: any) => {
    onUpdate({ ...product, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group">
      {/* Card Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/20">
            #{index + 1}
          </span>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              {product.type || 'Select Product Type'}
            </h3>
            <p className="text-xs text-slate-400">UPVC Specification Specification</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDuplicate}
            className="p-2 text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Duplicate Item"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
            title="Remove Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Visual Preview */}
        <div className="lg:col-span-3">
          <WindowDoorGraphic type={product.type} />
        </div>

        {/* Form Controls */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Product Type Dropdown */}
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              Product Type *
            </label>
            <select
              value={product.type}
              onChange={(e) => handleChange('type', e.target.value as ProductType)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Width */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Width (mm) *
            </label>
            <input
              type="number"
              value={product.width || ''}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              placeholder="e.g. 1500"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Height (mm) *
            </label>
            <input
              type="number"
              value={product.height || ''}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              placeholder="e.g. 1200"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              value={product.quantity || 1}
              onChange={(e) => handleChange('quantity', Math.max(1, Number(e.target.value)))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            />
          </div>

          {/* Glass Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-500" />
              Glass Type
            </label>
            <select
              value={product.glassType}
              onChange={(e) => handleChange('glassType', e.target.value as GlassType)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            >
              {GLASS_TYPES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Frame Color (RAL) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-500" />
              Frame Color (RAL Code)
            </label>
            <select
              value={product.frameColor}
              onChange={(e) => handleChange('frameColor', e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            >
              {RAL_COLORS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Hardware Options */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-500" />
              Hardware & Fittings
            </label>
            <select
              value={product.hardware}
              onChange={(e) => handleChange('hardware', e.target.value as HardwareOption)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            >
              {HARDWARE_OPTIONS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Estimated Unit Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Est. Unit Price ($)
            </label>
            <input
              type="number"
              value={product.unitPrice || ''}
              onChange={(e) => handleChange('unitPrice', Number(e.target.value))}
              placeholder="e.g. 1250"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none font-semibold text-sky-600 dark:text-sky-400"
            />
          </div>

          {/* Remarks */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Remarks & Custom Instructions
            </label>
            <input
              type="text"
              value={product.remarks || ''}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="e.g. Bug mesh track required, 3-track frame layout..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

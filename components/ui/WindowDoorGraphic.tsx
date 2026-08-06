'use client';

import React from 'react';
import { ProductType } from '@/types';

interface WindowDoorGraphicProps {
  type: ProductType;
  color?: string;
  className?: string;
}

export function WindowDoorGraphic({ type, className = 'w-full h-32' }: WindowDoorGraphicProps) {
  const getImagePath = (productType: ProductType) => {
    switch (productType) {
      case 'Sliding Window':
      case 'Casement Window':
      case 'Fixed Window':
      case 'French Window':
        return '/assets/windows/sliding-window.png';
      case 'Sliding Door':
      case 'Casement Door':
      case 'Folding Door':
        return '/assets/windows/casement-door.png';
      case 'Main Gate':
        return '/assets/windows/main-gate.png';
      default:
        return '/assets/windows/sliding-window.png'; // Fallback
    }
  };

  return (
    <div className={`relative bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700/60 overflow-hidden group p-2 ${className}`}>
      <div className="w-full h-full relative flex items-center justify-center">
        <img 
          src={getImagePath(type)} 
          alt={type}
          className="w-full h-full object-contain rounded-lg drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
}

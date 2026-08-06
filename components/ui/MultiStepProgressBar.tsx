'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface MultiStepProgressBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export function MultiStepProgressBar({ steps, currentStep, onStepClick }: MultiStepProgressBarProps) {
  return (
    <div className="w-full py-6 px-6 sm:px-0 overflow-x-hidden sm:overflow-visible">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto">
        {/* Connection Bar Background */}
        <div className="absolute top-5 left-0 right-0 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 -translate-y-1/2 z-0" />
        
        {/* Connection Bar Fill */}
        <div 
          className="absolute top-5 left-0 h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 dark:from-sky-500 dark:to-indigo-600 -translate-y-1/2 z-0 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(56,189,248,0.4)]"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          // Step IDs that we are allowed to click
          const isClickable = onStepClick && step.id < currentStep;

          return (
            <div 
              key={step.id} 
              className={cn(
                "relative z-10 flex flex-col items-center group",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              {/* Node */}
              <div className="bg-white dark:bg-[#020817] p-1.5 rounded-full z-10 transition-all duration-300">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500',
                    isCompleted
                      ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-transparent scale-100'
                      : isCurrent
                      ? 'bg-white dark:bg-slate-900 border-[3px] border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/20 scale-110 ring-4 ring-indigo-50 dark:ring-indigo-900/30'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 text-slate-400 scale-95 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3px] animate-in zoom-in" /> : step.id}
                </div>
              </div>
              
              {/* Text */}
              <div className="text-center mt-3 w-32 -ml-11 -mr-11 sm:ml-0 sm:mr-0 absolute top-12">
                <p className={cn(
                  'text-xs font-bold tracking-tight transition-colors duration-300',
                  isCurrent ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                )}>
                  {step.title}
                </p>
                <p className={cn(
                  "text-[10px] font-medium mt-0.5 transition-colors duration-300 hidden sm:block",
                  isCurrent ? 'text-indigo-500/70 dark:text-indigo-400/70' : 'text-slate-400/80 dark:text-slate-500'
                )}>
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

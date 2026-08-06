import React from 'react';
import ExampleForm from '@/components/ExampleForm';
import { MainLayout } from '@/components/layout/MainLayout';

export default function TestEmailPage() {
  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Test Email & PDF Functionality</h1>
        <p className="text-center text-slate-500 mb-8">
          Fill out this form to test the PDF generation and automatic email sending.
        </p>
        <ExampleForm />
      </div>
    </MainLayout>
  );
}

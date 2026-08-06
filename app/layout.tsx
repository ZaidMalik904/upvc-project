import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/components/ui/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ADL UPVC Doors & Windows | Commercial Windows & Doors Management',
  description: 'Fabrication pricing, quotation builder, and client ERP system for UPVC manufacturers',
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-sky-500 selection:text-white`}>
        <NextTopLoader color="#0EA5E9" height={4} showSpinner={false} shadow="0 0 10px #0EA5E9,0 0 5px #0EA5E9" />
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

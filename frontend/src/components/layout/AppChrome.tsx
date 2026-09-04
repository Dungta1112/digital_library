'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAiRoute = pathname === '/ai' || pathname.startsWith('/ai/');
  const isGroupWorkspaceRoute = pathname.startsWith('/groups/') && pathname !== '/groups';

  if (isAiRoute) {
    return <div className="h-screen w-screen overflow-hidden bg-slate-900">{children}</div>;
  }

  if (isGroupWorkspaceRoute) {
    return <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

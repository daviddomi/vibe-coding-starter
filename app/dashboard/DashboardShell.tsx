'use client';

import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';

export const DashboardShell = ({ children }: { children: React.ReactNode }) => (
  <div className="dark min-h-screen w-full bg-primary-surface font-sans text-primary-foreground transition-colors">
    <DashboardTopNav />
    <main className="flex-1 overflow-auto pb-20 md:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 md:px-5 lg:px-6">
        {children}
      </div>
    </main>
  </div>
);

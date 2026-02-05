'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { MenuIcon, RefreshCwIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { DashboardSidebar } from '@/components/dashboard';
import { lastUpdated } from '@/data/dashboard/portfolioSampleData';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-stocktrac',
});

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/holdings': 'Holdings',
  '/dashboard/ai': 'Insights',
  '/dashboard/settings': 'Settings',
};

function getPageTitle(pathname: string) {
  if (pathname in PAGE_TITLES) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/dashboard/holdings')) return 'Holdings';
  if (pathname.startsWith('/dashboard/ai')) return 'AI Analysis';
  if (pathname.startsWith('/dashboard/settings')) return 'Settings';
  return 'Dashboard';
}

function formatLastUpdated(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() ?? '/dashboard';
  const title = getPageTitle(pathname);
  const showAddStock = pathname.startsWith('/dashboard/holdings');

  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`dark min-h-screen w-full bg-primary-surface font-stocktrac text-primary-foreground transition-colors ${inter.variable}`}
    >
      <div className="flex min-h-screen w-full">
        <DashboardSidebar
          currentPath={pathname}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-primary-surface px-4 transition-colors md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-primary-card text-primary-foreground hover:bg-white/5 md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div className="flex flex-col gap-0.5">
                <h1 className="text-lg font-semibold text-primary-foreground md:text-xl">
                  {title}
                </h1>
                {title === 'Overview' ? (
                  <span className="text-xs text-secondary-muted">
                    Last updated {mounted ? formatLastUpdated(lastUpdated) : '—'}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-primary-card px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-white/5"
                aria-label="Refresh data"
              >
                <RefreshCwIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {showAddStock && (
                <Link
                  href="/dashboard/holdings?add=1"
                  className="flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
                >
                  Add holding
                </Link>
              )}
              <ThemeSwitch />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

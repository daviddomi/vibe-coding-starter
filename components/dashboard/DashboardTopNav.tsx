'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS_RIGHT = [
  { href: '/dashboard', label: 'Portfolio' },
  { href: '/dashboard/account', label: 'Account' },
];

export interface DashboardTopNavProps {
  children?: React.ReactNode;
}

export const DashboardTopNav = ({ children }: DashboardTopNavProps) => {
  const pathname = usePathname() ?? '/dashboard';
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const path = href.replace(/#.*/, '');
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="flex h-14 min-h-14 items-center justify-between gap-4 border-b border-white/5 bg-primary-surface px-4 md:px-6">
      <div className="flex min-w-0 shrink items-center">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/static/images/logo.png"
            alt="StockTrac"
            width={120}
            height={32}
            className="h-8 w-auto object-contain object-left"
          />
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS_RIGHT.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-white/10 text-primary-foreground'
                  : 'text-secondary-muted hover:bg-white/5 hover:text-primary-foreground',
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        {children}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground hover:bg-white/10 md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-14 z-40 flex flex-col gap-1 border-b border-white/10 bg-primary-surface p-4 md:hidden">
          {NAV_ITEMS_RIGHT.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'rounded-lg px-3 py-2.5 text-sm font-medium',
                isActive(href) ? 'bg-white/10 text-primary-foreground' : 'text-secondary-muted',
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

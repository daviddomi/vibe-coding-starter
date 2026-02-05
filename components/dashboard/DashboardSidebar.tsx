'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboardIcon,
  SparklesIcon,
  SettingsIcon,
  XIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboardIcon, label: 'Overview' },
  { href: '/dashboard/ai', icon: SparklesIcon, label: 'Insights' },
];

const bottomItems = [
  { href: '/dashboard/settings', icon: SettingsIcon, label: 'Settings' },
];

export interface DashboardSidebarProps {
  currentPath?: string;
  open?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar = ({
  currentPath = '/dashboard',
  open = false,
  onClose,
}: DashboardSidebarProps) => (
  <>
    {/* Overlay */}
    {open && onClose && (
      <button
        type="button"
        aria-label="Close overlay"
        className="fixed inset-0 z-50 bg-black/50 md:hidden"
        onClick={onClose}
      />
    )}

    {/* Sidebar: bottom nav on mobile, slim on md, full on xl */}
      <aside
        className={cn(
          'flex flex-col border-r border-white/10 bg-primary-card transition-all duration-300',
          'fixed inset-y-0 left-0 z-50 md:relative md:z-auto',
          'w-20 md:w-20 xl:w-64',
          'md:rounded-r-xl',
          'translate-x-0',
          (open && onClose) ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 xl:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-primary-foreground"
          >
            <Image
              src="/static/images/logo.png"
              alt="StockTrac"
              width={120}
              height={32}
              className="h-8 w-auto object-contain object-left"
            />
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/10 text-primary-foreground md:hidden"
              aria-label="Close menu"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2 xl:p-4">
          <div className="flex flex-1 flex-col gap-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active =
                currentPath === href ||
                (href !== '/dashboard' && currentPath.startsWith(href));
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => onClose?.()}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-500/20 text-primary-500 border border-primary-500/30'
                      : 'text-secondary-muted hover:bg-white/5 hover:text-primary-foreground',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="hidden xl:inline">{label}</span>
                </Link>
              );
            })}
          </div>
          <div className="border-t border-white/10 pt-2 xl:pt-4">
            {bottomItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                onClick={() => onClose?.()}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-muted hover:bg-white/5 hover:text-primary-foreground"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden xl:inline">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/10 bg-primary-card p-2 md:hidden"
        aria-label="Bottom navigation"
      >
        {[...navItems, ...bottomItems].map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium text-secondary-muted hover:text-primary-500"
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );

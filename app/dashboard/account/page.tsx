'use client';

import Link from 'next/link';
import {
  ArrowLeftIcon,
  UserIcon,
  ShieldIcon,
  BellIcon,
  Link2Icon,
  CreditCardIcon,
  DownloadIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import { GlassCard } from '@/components/dashboard';
import { Button } from '@/components/shared/ui/button';
import { Switch } from '@/components/shared/ui/switch';
import { Label } from '@/components/shared/ui/label';
import { Avatar, AvatarFallback } from '@/components/shared/ui/avatar';

export default function AccountPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-400"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-primary-foreground md:text-2xl">
          Account
        </h1>
        <p className="text-sm text-secondary-muted">
          Manage your profile, security, and preferences.
        </p>
      </div>

      {/* Profile */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <UserIcon className="h-5 w-5 text-secondary-muted" aria-hidden />
          <h2 className="text-base font-medium text-primary-foreground">
            Profile
          </h2>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Avatar className="h-16 w-16 rounded-xl border border-white/10">
            <AvatarFallback className="rounded-xl bg-primary-500/20 text-lg font-medium text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-3 min-w-0">
            <div>
              <Label className="text-xs text-secondary-muted">Name</Label>
              <p className="mt-0.5 text-sm font-medium text-primary-foreground">
                Jane Doe
              </p>
            </div>
            <div>
              <Label className="text-xs text-secondary-muted">Email</Label>
              <p className="mt-0.5 text-sm font-medium text-primary-foreground">
                jane@example.com
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-fit border-white/10">
              Edit profile
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Security */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <ShieldIcon className="h-5 w-5 text-secondary-muted" aria-hidden />
          <h2 className="text-base font-medium text-primary-foreground">
            Security
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-primary-foreground">
              Password
            </Label>
            <p className="text-sm text-secondary-muted">
              Last changed 30 days ago. Use a strong, unique password.
            </p>
            <Button variant="outline" size="sm" className="w-fit border-white/10">
              Change password
            </Button>
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-primary-foreground">
                Two-factor authentication
              </Label>
              <p className="text-sm text-secondary-muted">
                Add an extra layer of security to your account.
              </p>
              <Button variant="outline" size="sm" className="w-fit border-white/10">
                Set up 2FA
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <BellIcon className="h-5 w-5 text-secondary-muted" aria-hidden />
          <h2 className="text-base font-medium text-primary-foreground">
            Notifications
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm text-primary-foreground">
                Portfolio alerts
              </Label>
              <p className="text-xs text-secondary-muted mt-0.5">
                Email when holdings cross price or % targets
              </p>
            </div>
            <Switch defaultChecked aria-label="Toggle portfolio alerts" />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <Label className="text-sm text-primary-foreground">
                Weekly summary
              </Label>
              <p className="text-xs text-secondary-muted mt-0.5">
                Performance and allocation digest
              </p>
            </div>
            <Switch defaultChecked aria-label="Toggle weekly summary" />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <Label className="text-sm text-primary-foreground">
                Product updates
              </Label>
              <p className="text-xs text-secondary-muted mt-0.5">
                New features and tips
              </p>
            </div>
            <Switch aria-label="Toggle product updates" />
          </div>
        </div>
      </GlassCard>

      {/* Connected accounts */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Link2Icon className="h-5 w-5 text-secondary-muted" aria-hidden />
          <h2 className="text-base font-medium text-primary-foreground">
            Connected accounts
          </h2>
        </div>
        <p className="text-sm text-secondary-muted mb-4">
          Link brokers or import data via API. Connections are read-only for
          security.
        </p>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-secondary-muted">
            No connected accounts yet.
          </p>
          <Button variant="outline" size="sm" className="mt-3 border-white/10">
            Connect broker
          </Button>
        </div>
      </GlassCard>

      {/* Billing & plan */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <CreditCardIcon className="h-5 w-5 text-secondary-muted" aria-hidden />
          <h2 className="text-base font-medium text-primary-foreground">
            Billing & plan
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground">
              Current plan: Free
            </p>
            <p className="text-xs text-secondary-muted mt-0.5">
              Upgrade for deeper analysis, alerts, and tax-loss harvesting.
            </p>
          </div>
          <Button asChild size="sm" className="w-fit bg-primary-500 hover:bg-primary-600">
            <Link href="/dashboard/pricing">View plans</Link>
          </Button>
        </div>
      </GlassCard>

      {/* Data & privacy */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <DownloadIcon className="h-5 w-5 text-secondary-muted" aria-hidden />
          <h2 className="text-base font-medium text-primary-foreground">
            Data & privacy
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm text-primary-foreground">
              Export your data
            </Label>
            <p className="text-sm text-secondary-muted mt-1">
              Download your holdings and performance history (CSV).
            </p>
            <Button variant="outline" size="sm" className="mt-2 border-white/10">
              Export data
            </Button>
          </div>
          <div className="border-t border-white/10 pt-4">
            <Label className="text-sm text-primary-foreground">
              Privacy
            </Label>
            <p className="text-sm text-secondary-muted mt-1">
              We don’t sell your data. Manage preferences in our privacy policy.
            </p>
            <Button variant="ghost" size="sm" className="mt-2 text-primary-500">
              Privacy policy
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Danger zone */}
      <GlassCard className="border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangleIcon className="h-5 w-5 text-red-500" aria-hidden />
          <h2 className="text-base font-medium text-primary-foreground">
            Danger zone
          </h2>
        </div>
        <p className="text-sm text-secondary-muted mb-4">
          Permanently delete your account and all portfolio data. This cannot be
          undone.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-fit border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
        >
          Delete account
        </Button>
      </GlassCard>
    </div>
  );
}

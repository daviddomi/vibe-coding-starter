import { genPageMetadata } from '@/app/seo';
import { DashboardShell } from './DashboardShell';

export const metadata = genPageMetadata({
  title: 'Dashboard',
  description: 'Monitor and analyze your investment portfolio with StockTrac.',
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}

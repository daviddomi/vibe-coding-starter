import { genPageMetadata } from '@/app/seo';

export const metadata = genPageMetadata({
  title: 'Account',
  description: 'Manage your profile, security, and preferences.',
});

export default function DashboardAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

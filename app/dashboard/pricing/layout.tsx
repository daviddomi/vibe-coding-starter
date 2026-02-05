import { genPageMetadata } from '@/app/seo';

export const metadata = genPageMetadata({
  title: 'Pricing',
  description: 'Choose the plan that fits your portfolio tracking needs.',
});

export default function DashboardPricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

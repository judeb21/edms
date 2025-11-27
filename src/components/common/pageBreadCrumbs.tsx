'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  /**
   * Custom breadcrumb items (for complex breadcrumbs)
   * If provided, currentPage will be ignored
   */
  items?: BreadcrumbItem[];
  /**
   * Current page title (for simple Dashboard > Page breadcrumbs)
   * Will automatically add RoleBased Dashboard link
   */
  currentPage?: string;
  /**
   * Additional breadcrumb items between Dashboard and current page
   * Only used with currentPage
   */
  middleItems?: BreadcrumbItem[];
}

export function PageBreadcrumb({
  items,
  currentPage,
  middleItems = [],
}: PageBreadcrumbProps) {

  // If items provided, use them (backward compatibility)
  if (items) {
    if (items.length === 0) return null;
    return renderBreadcrumb(items);
  }

  // If currentPage provided, build simple breadcrumb with role-aware dashboard
  if (currentPage) {
    const dashboardItems: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        href: `/dashboard/overview}`,
      },
      ...middleItems,
      {
        label: currentPage,
      },
    ];
    return renderBreadcrumb(dashboardItems);
  }

  return null;
}

function renderBreadcrumb(items: BreadcrumbItem[]) {
  const breadcrumbElements: React.ReactNode[] = [];

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;

    // Add the breadcrumb item
    breadcrumbElements.push(
      <BreadcrumbItem key={`item-${index}`}>
        {isLast ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : item.href ? (
          <BreadcrumbLink asChild>
            <Link href={item.href}>{item.label}</Link>
          </BreadcrumbLink>
        ) : (
          <span>{item.label}</span>
        )}
      </BreadcrumbItem>
    );

    // Add separator if not the last item
    if (!isLast) {
      breadcrumbElements.push(
        <BreadcrumbSeparator key={`separator-${index}`} />
      );
    }
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbElements}</BreadcrumbList>
    </Breadcrumb>
  );
}

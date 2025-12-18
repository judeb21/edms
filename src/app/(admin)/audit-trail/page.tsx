import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import {
  AuditTrailDataTable,
  AuditTrailType,
} from "@/components/tables/auditTrailTable";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

const trails: AuditTrailType[] = [
  {
    id: "1",
    name: "Adebisi Adeola",
    email: "adebisideola@gmail.com",
    createdAt: "02/04/2025",
    documentTitle: "Policy",
    actions: "edit",
  },
  {
    id: "2",
    name: "Adebisi Adeola",
    email: "adebisideola@gmail.com",
    createdAt: "02/04/2025",
    documentTitle: "Q2 Budget Report",
    actions: "edit",
  },
  {
    id: "2",
    name: "Adebisi Adeola",
    email: "adebisideola@gmail.com",
    createdAt: "02/04/2025",
    documentTitle: "Training Guide",
    actions: "edit",
  },
];

export default function DocumentsPage() {
  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Audit Trail" },
  ];

  return (
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="flex justify-between items-center py-[20px] px-[40px] bg-white">
        <PageBreadcrumb items={breadcrumbItems} />

        <Button className="bg-brand-blue hover:bg-brand-blue">
          <Plus />
          Export as CSV
        </Button>
      </div>

      <div className="bg-white mt-1 p-8 min-h-screen">
        {!trails ? (
          <div className="h-120 flex flex-col justify-center items-center w-80 mx-auto text-center">
            <FileText size={64} color="#A9A9A9" strokeWidth={1} />
            <h6 className="mt-[24px] text-[18px] text-primary-gray font-medium">
              No Audit Trail Yet
            </h6>
          </div>
        ) : (
          <div>
            <AuditTrailDataTable data={trails} showPagination={false} />
          </div>
        )}
      </div>
    </div>
  );
}

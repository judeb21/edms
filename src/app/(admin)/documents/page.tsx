"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import {
  DocumentsTable,
  DocumentType,
} from "@/components/tables/documentTable";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();
  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Document" },
  ];

  const goToNewDocument = () => router.push("/documents/new");

  const documents: DocumentType[] = [
    {
      id: "1",
      title: "Staff Survey",
      category: "Reports",
      department: "HR",
      dateModified: "02/04/2024",
      status: "Submitted",
    },
    {
      id: "1",
      title: "Sales Contract",
      category: "Policies",
      department: "HR",
      dateModified: "02/04/2024",
      status: "Submitted",
    },
  ];

  return (
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="flex justify-between items-center py-[20px] px-[40px] bg-white">
        <PageBreadcrumb items={breadcrumbItems} />

        <Button
          className="bg-brand-blue hover:bg-brand-blue"
          onClick={goToNewDocument}
        >
          <Plus />
          Upload Document
        </Button>
      </div>

      <div className="bg-white mt-1 p-8 min-h-screen">
        {!documents?.length ? (
          <div className="h-120 flex flex-col justify-center items-center w-80 mx-auto text-center">
            <FileText size={64} color="#A9A9A9" strokeWidth={1} />
            <h6 className="mt-[24px] text-[18px] text-primary-gray font-medium">
              No Documents Uploaded Yet
            </h6>
            <p className="mt-[8px] font-medium text-primary-gray">
              Click the button below to upload your first document and start
              organizing your files.
            </p>

            <Button
              className="bg-brand-blue hover:bg-brand-blue mt-[38px]"
              onClick={goToNewDocument}
            >
              <Plus />
              Upload Document
            </Button>
          </div>
        ) : (
          <div>
            <DocumentsTable
              data={documents as DocumentType[]}
              showPagination={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

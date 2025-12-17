"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { DocumentsTable } from "@/components/tables/documentTable";
import { Button } from "@/components/ui/button";
import { useGetDocuments } from "@/hooks/api/useDocumentQuery";
import { DocumentResponse, FetchDocumentObject } from "@/types/documents";
import { FileText, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Document" },
  ];
  const [payloadParams, setPayloadParams] = useState<FetchDocumentObject>({
    page: 1,
    pageSize: 10,
    department: "",
    category: "",
    keyword: "",
  });

  // Get documents
  const { data, isLoading } = useGetDocuments(payloadParams);

  const getNext = () => {
    const nextPayload = {
      page: payloadParams.page + 1,
      pageSize: payloadParams.pageSize,
      department: payloadParams.department,
      category: payloadParams.category,
      keyword: payloadParams.keyword,
    };
    setPayloadParams(nextPayload);
  };

  const getPrev = () => {
    const prevPayload = {
      page: payloadParams.page - 1,
      pageSize: payloadParams.pageSize,
      department: payloadParams.department,
      category: payloadParams.category,
      keyword: payloadParams.keyword,
    };
    setPayloadParams(prevPayload);
  };

  const documentData = useMemo(() => {
    const docData = data as DocumentResponse;

    return docData;
  }, [data]);

  const goToNewDocument = () => router.push("/documents/new");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

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
        {!documentData?.items ? (
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
              data={documentData}
              showPagination={true}
              previousTable={() => getPrev()}
              nextTable={() => getNext()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { Button } from "@/components/ui/button";
import WorkflowTemplateCard from "@/components/workflow/workflow-card";
import { useGetAllTemplatesWorkflows } from "@/hooks/api/useWorkflowQuery";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Templates" },
  ];

  const { data, isLoading } = useGetAllTemplatesWorkflows();

  const templates = useMemo(() => {
    return data;
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  const goBack = () => {
    router.back();
  };

  return (
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="flex justify-between items-center py-[20px] px-[40px] bg-white">
        <PageBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="bg-white mt-1 p-8 min-h-screen">
        <div className="px-[12px]">
          <Button
            variant="ghost"
            className="group relative cursor-pointer !px-0 hover:bg-inherit"
            onClick={goBack}
          >
            <ArrowLeft
              color="#464646"
              className="translate-x-0 transition-all duration-500 ease-in-out group-hover:-translate-x-[0.9px]"
            />
            <span className="font-[family-name:var(--font-dm)] text-[#A9A9A9]">
              Back to workflow list
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-[24px] mt-3">
          {templates?.map((template) => {
            return (
              <WorkflowTemplateCard
                key={template.id}
                title={template.templateName}
                isNew={false}
                createdAt={template.createdAt}
                link={`/template/${template.id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

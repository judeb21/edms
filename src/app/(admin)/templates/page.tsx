"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { Button } from "@/components/ui/button";
import WorkflowTemplateCard from "@/components/workflow/workflow-card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();
  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Templates" },
  ];

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
          {[1, 2, 3, 4].map((_, index) => {
            return (
              <WorkflowTemplateCard
                key={index}
                title="Contract Review"
                isNew={false}
                link="/workflow-editor/5298737c-7d06-4050-8c92-4278408207f9"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

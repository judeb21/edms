"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { Button } from "@/components/ui/button";
import WorkflowTemplateCard from "@/components/workflow/workflow-card";
import { useGetWorkflows } from "@/hooks/api/useWorkflowQuery";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useMemo } from "react";

export default function WorkFlowPage() {
  const router = useRouter();
  const breadcrumbItems = [
    { label: "Approval Workflow", href: "/workflow" },
    { label: "Create New Workflow" },
  ];

  const { isLoading } = useGetWorkflows();

  // const workflows = useMemo(() => {
  //   return data;
  // }, [data]);

  // const goToNewWorkflow = () => {
  //   router.push("/workflow/new");
  // };

  const goBack = () => {
    router.back();
  };

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

          <div className="mt-[24px]">
            <h4 className="font-semibold text-[20px] text-primary-gray">
              Start a New Workflow
            </h4>

            <WorkflowTemplateCard
              title="Blank Workflow"
              isNew={true}
              link="/workflow/new"
            />
          </div>
        </div>

        <div className="mt-[60px] px-[12px]">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] font-semibold text-primary-gray">
              Saved Templates
            </h2>

            <Link href="/templates" className="text-brand-blue font-semibold">
              See all
            </Link>
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
    </div>
  );
}

"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { Button } from "@/components/ui/button";
import GenericModal from "@/components/workflow/generic-modal";
import SuccessModal from "@/components/workflow/modal-successful";
import WorkflowTemplateCard from "@/components/workflow/workflow-card";
import {
  useDeleteTemplate,
  useGetAllTemplatesWorkflows,
} from "@/hooks/api/useWorkflowQuery";
import { AxiosError } from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
// import { useMemo } from "react";

export default function WorkFlowPage() {
  const router = useRouter();
  const breadcrumbItems = [
    { label: "Approval Workflow", href: "/workflow" },
    { label: "Create New Workflow" },
  ];
  const [templateId, setTemplateId] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const { data, isLoading, refetch } = useGetAllTemplatesWorkflows();

  const deleteWorkflow = useDeleteTemplate();

  const templates = useMemo(() => {
    return data?.splice(0, 8);
  }, [data, isLoading]);

  const goBack = () => {
    router.back();
  };

  const onDelete = (id: string) => {
    setTemplateId(id);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    // setDeleteSuccessful(false);
    setDeleteLoader(true);
    deleteWorkflow.mutate(templateId, {
      onSuccess: (response) => {
        // setDeleteSuccessful(true);
        setDeleteLoader(false);
        setTemplateId("");
        setDeleteModal(false);
        setSuccessModal(true);
        refetch();
        toast.success(response?.message, {
          unstyled: false,
          position: "top-right",
          classNames: {
            toast:
              "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
            title: "text-[#E71D36]",
          },
        });
      },
      onError: (error: Error) => {
        setDeleteLoader(false);
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message
            : "Failed to delete template",
          {
            unstyled: true,
            position: "top-right",
            classNames: {
              toast:
                "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
              title: "text-[#E71D36]",
            },
          }
        );
      },
    });
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

          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] !gap-[24px] mt-3">
            {templates?.map((template) => {
              return (
                <WorkflowTemplateCard
                  key={template.id}
                  title={template.templateName}
                  isNew={false}
                  createdAt={template.createdAt}
                  link={`/template/${template.id}`}
                  onDelete={() => onDelete(template.id)}
                />
              );
            })}
          </div>

          <GenericModal
            isOpen={deleteModal}
            subTitle="Delete Template"
            description="Are you sure you want to delete this template?"
          >
            <div className="w-full">
              <div className="mt-6 gap-[16px] flex justify-center items-center">
                <Button
                  className="bg-[#FC5A5A] py-[24px] hover:bg-[#FC5A5A]"
                  onClick={() => {
                    setTemplateId("");
                    setDeleteModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-brand-blue py-[24px] hover:bg-brand-blue"
                  onClick={() => handleDelete()}
                  disabled={deleteLoader}
                >
                  {deleteLoader && <Loader2 className="animate-spin" />}
                  Delete
                </Button>
              </div>
            </div>
          </GenericModal>

          {/* Template successfully deleted */}
          <SuccessModal
            isOpen={successModal}
            description="Template Deleted Successully"
            buttonText="Done"
            buttonClass="-translate-y-[20px]"
            handleClick={() => setSuccessModal(false)}
          />
        </div>
      </div>
    </div>
  );
}

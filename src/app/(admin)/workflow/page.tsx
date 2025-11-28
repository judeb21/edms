"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { WorkFlowDataTable } from "@/components/tables/workflowTable";
import { Button } from "@/components/ui/button";
import {
  useDeleteWorkflow,
  useGetWorkflows,
} from "@/hooks/api/useWorkflowQuery";
import { WorkflowTypes } from "@/types/workflow";
import { AxiosError } from "axios";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function WorkFlowPage() {
  const [deleteLoader, setLoader] = useState(false);
  const [onSuccess, setDeleteSuccessful] = useState(false);
  const router = useRouter();
  const breadcrumbItems = [{ label: "Approval Workflow" }];

  const { data, isLoading } = useGetWorkflows();

  //Delete workflow mutation
  const deleteWorkflow = useDeleteWorkflow();

  const workflows = useMemo(() => {
    return data;
  }, [data]);

  const goToNewWorkflow = () => {
    router.push("/workflow/workflows");
  };

  const handleDelete = (id: string) => {
    setDeleteSuccessful(false);
    setLoader(true);
    deleteWorkflow.mutate(id, {
      onSuccess: (response) => {
        setDeleteSuccessful(true);
        setLoader(false);
        toast.success(response?.message, {
          unstyled: true,
          position: "top-right",
          classNames: {
            toast:
              "capitalize bg-white z-10 flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
          },
        });
      },
      onError: (error: Error) => {
        setLoader(false);
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message
            : "Failed to delete workflow",
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

        <Button
          className="bg-brand-blue cursor-pointer hover:bg-brand-blue"
          onClick={goToNewWorkflow}
        >
          <Plus />
          Create New Workflow
        </Button>
      </div>

      <div className="bg-white mt-1 p-8">
        <WorkFlowDataTable
          data={workflows as WorkflowTypes[]}
          showPagination={false}
          deleteLoader={deleteLoader}
          onDelete={handleDelete}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}

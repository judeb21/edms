"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { WorkFlowDataTable } from "@/components/tables/workflowTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeleteWorkflow,
  useGetAllWorkflows,
} from "@/hooks/api/useWorkflowQuery";
import { FetchWorkflowObject, WorkflowTypes } from "@/types/workflow";
import { AxiosError } from "axios";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function WorkFlowPage() {
  const [deleteLoader, setLoader] = useState(false);
  const [onSuccess, setDeleteSuccessful] = useState(false);
  const router = useRouter();
  const breadcrumbItems = [{ label: "Workflow" }];
  const [payloadParams, setPayloadParams] = useState<FetchWorkflowObject>({
    workflowName: "",
  });

  const { data, isFetching } = useGetAllWorkflows(payloadParams);

  //Delete workflow mutation
  const deleteWorkflow = useDeleteWorkflow();

  const workflows = useMemo(() => {
    return data;
  }, [data, isFetching]);

  const goToNewWorkflow = () => {
    router.push("/workflow/workflows");
  };

  const handleSearch = (value: string) => {
    setPayloadParams({ ...payloadParams, workflowName: value });
  };

  const onClear = () => {
    setPayloadParams({ ...payloadParams, workflowName: "" });
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

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <div className="text-center">
  //         <Loader2 className="animate-spin" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="py-[20px] px-[40px] bg-white w-full">
        <div className="flex justify-between items-center">
          <PageBreadcrumb items={breadcrumbItems} />

          <Button
            className="bg-brand-blue cursor-pointer hover:bg-brand-blue"
            onClick={goToNewWorkflow}
          >
            <Plus />
            Create New Workflow
          </Button>
        </div>

        <div className="flex items-center gap-[20px] md:flex-row flex-col w-full mt-4">
          <div className="md:max-w-[300px] w-full">
            <div className="relative mt-1">
              <Search
                className="text-[#A9A9A9] absolute top-[15px] left-2"
                size={20}
              />
              <Input
                id="keyword"
                placeholder="Search with Workflow Name"
                className="max-w-[300px] w-full md:w-[300px] h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-dm)] pl-[35px] text-[#101828] font-[500] pr-[35px]"
                value={payloadParams.workflowName}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {payloadParams?.workflowName && (
                <X
                  className="cursor-pointer absolute top-4 right-2 text-[#BFBFBF]"
                  size={20}
                  onClick={onClear}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white mt-1 p-8 min-h-screen">
        <div>
          {isFetching ? (
            <div className="flex items-center justify-center py-2">
              <div className="text-center">
                <Loader2 className="animate-spin" />
              </div>
            </div>
          ) : (
            <>
              {workflows?.length && (
                <WorkFlowDataTable
                  data={workflows as WorkflowTypes[]}
                  showPagination={false}
                  deleteLoader={deleteLoader}
                  onDelete={handleDelete}
                  onSuccess={onSuccess}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

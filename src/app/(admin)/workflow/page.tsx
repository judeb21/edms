"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import {
  WorkFlowDataTable,
} from "@/components/tables/workflowTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useDeleteWorkflow,
  useGetAllWorkflows,
} from "@/hooks/api/useWorkflowQuery";
import { FetchWorkflowObject, WorkflowTypes } from "@/types/workflow";
import { AxiosError } from "axios";
import { ChevronDown, Loader2, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const statusType = [
  {
    name: "Active",
    value: "Active",
  },
  {
    name: "Archived",
    value: "Archived",
  },
  {
    name: "Configured",
    value: "Configured",
  },
  {
    name: "Draft",
    value: "Draft",
  },
  {
    name: "Inactive",
    value: "Inactive",
  },
];

export default function WorkFlowPage() {
  const [deleteLoader, setLoader] = useState(false);
  const [onSuccess, setDeleteSuccessful] = useState(false);
  const router = useRouter();
  const breadcrumbItems = [{ label: "Workflow" }];
  const [payloadParams, setPayloadParams] = useState<FetchWorkflowObject>({
    workflowName: "",
    status: "Active",
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

  const handleStatus = (value: string) => {
    setPayloadParams({ ...payloadParams, status: value });
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
            <Label
              htmlFor="keyword"
              className="text-left block text-[13px] text-[#464646] font-[family-name:var(--font-dm)]"
            >
              Keyword
            </Label>
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

          {/* Department filter */}
          <div className="col-span-1 grid items-center w-full md:w-[150px]">
            <Label
              htmlFor="channel"
              className="text-left block text-[13px] text-[#464646] font-[family-name:var(--font-dm)]"
            >
              Status
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="md:w-[200px] mt-1 w-full h-[50px] sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-dm)] text-[#3D4F5C] truncate"
                >
                  <span>{payloadParams.status || "All"}</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="font-[family-name:var(--font-poppins)] text-[12px] md:min-w-[200px] w-full h-40 overflow-auto"
              >
                <DropdownMenuRadioGroup
                  value={payloadParams.status}
                  onValueChange={(e) => handleStatus(e)}
                >
                  <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                  {statusType?.map((status) => {
                    return (
                      <DropdownMenuRadioItem
                        value={status.value}
                        key={status.name}
                      >
                        {status.name}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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

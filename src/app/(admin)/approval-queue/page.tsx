"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { ApprovalQueueTable } from "@/components/tables/approvalQueueTable";
import SuccessModal from "@/components/workflow/modal-successful";
import { useAuthUser } from "@/context/auth-context";
import {
  useApproveQueueMutation,
  useGetApprovalQueueQuery,
  useRejectQueueMutation,
  useRequestChangeQueueMutation,
} from "@/hooks/api/useApprovalsQuery";
import {
  ApprovalQueueResponse,
  FetchApprovalQueueObject,
  QueueActions,
} from "@/types/documents";
import { Loader2 } from "lucide-react";
// import { useDeleteWorkflow } from "@/hooks/api/useWorkflowQuery";
// import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { toast } from "sonner";
// import { toast } from "sonner";

export default function ApprovalQueuePage() {
  const { user } = useAuthUser();
  const [message, setSuccessMessage] = useState("");
  const [deleteLoader, setLoader] = useState(false);
  const [onSuccess, setDeleteSuccessful] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  // eslint-disable-next-line
  const [payload, setPayload] = useState<FetchApprovalQueueObject>({
    page: 1,
    pageSize: 10,
  });
  const [formData, setFormData] = useState<QueueActions>({
    approverEmail: user?.email || "",
    comment: "",
  });

  const breadcrumbItems = [
    { label: "Overview", href: "/overview" },
    { label: "Approval Queue" },
  ];

  const { data, refetch, isLoading } = useGetApprovalQueueQuery(payload);

  //Approve Queue
  const approveQueue = useApproveQueueMutation();

  //Reject Queue
  const rejectQueue = useRejectQueueMutation();

  //Request change Queue
  const requestChangeQueue = useRequestChangeQueueMutation();

  //Delete workflow mutation
  //   const deleteWorkflow = useDeleteWorkflow();

  const handleApproval = (id: string) => {
    setDeleteSuccessful(false);
    setLoader(true);

    const payload: QueueActions = {
      approverEmail: user?.email || "",
      comment: "Approved",
    };

    approveQueue.mutate(
      { id, payload },
      {
        onSuccess: () => {
          setDeleteSuccessful(true);
          setLoader(false);
          setSuccessMessage("Document Approved Successfully");
          setSuccessModal(true);
          refetch();
        },
        onError: (error) => {
          setLoader(false);
          setDeleteSuccessful(false);
          toast.error(
            error instanceof Error ? error.message : "Failed to approve queue",
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
      }
    );
  };

  const handleRejection = (id: string) => {
    setDeleteSuccessful(false);
    setLoader(true);

    const payload: QueueActions = {
      approverEmail: user?.email || "",
      comment: formData.comment,
    };

    rejectQueue.mutate(
      { id, payload },
      {
        onSuccess: () => {
          setDeleteSuccessful(true);
          setLoader(false);
          setSuccessMessage("This Document has been Rejected");
          setSuccessModal(true);
          setFormData({ ...formData, comment: "" });
          refetch();
        },
        onError: (error) => {
          setLoader(false);
          setDeleteSuccessful(false);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to reject workflow",
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
      }
    );
  };

  const handleChangeRequest = (id: string) => {
    setDeleteSuccessful(false);
    setLoader(true);

    const payload: QueueActions = {
      approverEmail: user?.email || "",
      comment: formData.comment,
    };

    requestChangeQueue.mutate(
      { id, payload },
      {
        onSuccess: () => {
          setDeleteSuccessful(true);
          setLoader(false);
          setSuccessMessage("Your request has been sent");
          setSuccessModal(true);
          setFormData({ ...formData, comment: "" });
          refetch();
        },
        onError: (error) => {
          setLoader(false);
          setDeleteSuccessful(false);
          toast.error(
            error instanceof Error ? error.message : "Failed to send changes",
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
      }
    );
  };

  const queueData = useMemo(() => {
    const docData = data as ApprovalQueueResponse;

    return docData;
  }, [data]);

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

      <div className="bg-white mt-1 p-8">
        <ApprovalQueueTable
          data={queueData}
          showPagination={false}
          deleteLoader={deleteLoader}
          onDelete={handleApproval}
          onRejection={handleRejection}
          onRequestChange={handleChangeRequest}
          onChange={setFormData}
          formData={formData}
          onSuccess={onSuccess}
        />

        {/* Successfully approved document */}
        <SuccessModal
          isOpen={showSuccessModal}
          description={message}
          buttonText="Done"
          buttonClass="-translate-y-[20px]"
          handleClick={() => setSuccessModal(false)}
        />
      </div>
    </div>
  );
}

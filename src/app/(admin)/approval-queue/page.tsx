"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import {
  ApprovalQueueTable,
  ApprovalQueueType,
} from "@/components/tables/approvalQueueTable";
import SuccessModal from "@/components/workflow/modal-successful";
// import { useDeleteWorkflow } from "@/hooks/api/useWorkflowQuery";
// import { AxiosError } from "axios";
import { useState } from "react";
// import { toast } from "sonner";

export default function ApprovalQueuePage() {
  const [message, setSuccessMessage] = useState("");
  const [deleteLoader, setLoader] = useState(false);
  const [onSuccess, setDeleteSuccessful] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);

  const breadcrumbItems = [
    { label: "Overview", href: "/overview" },
    { label: "Approval Queue" },
  ];

  //Delete workflow mutation
  //   const deleteWorkflow = useDeleteWorkflow();

  const queues: ApprovalQueueType[] = [
    {
      id: "1",
      documentName: "National Identification Number",
      contributor: "John Smith",
      dateSubmitted: "02/04/2024",
      status: "Pending",
    },
    {
      id: "2",
      documentName: "International Passport",
      contributor: "John Smith",
      dateSubmitted: "02/04/2024",
      status: "Pending",
    },
  ];

  const handleApproval = () => {
    setDeleteSuccessful(false);
    setLoader(true);
    setTimeout(() => {
      setDeleteSuccessful(true);
      setLoader(false);
      setSuccessMessage("Document Approved Successfully");
      setSuccessModal(true);
    }, 500);
  };

  const handleRejection = () => {
    setDeleteSuccessful(false);
    setLoader(true);
    setTimeout(() => {
      setDeleteSuccessful(true);
      setLoader(false);
      setSuccessMessage("This Document has been Rejected");
      setSuccessModal(true);
    }, 500);
  };

  const handleChangeRequest = () => {
    setDeleteSuccessful(false);
    setLoader(true);
    setTimeout(() => {
      setDeleteSuccessful(true);
      setLoader(false);
      setSuccessMessage("Your request has been sent");
      setSuccessModal(true);
    }, 500);
  };

  //   if (isLoading) {
  //     return (
  //       <div className="flex items-center justify-center py-12">
  //         <div className="text-center">
  //           <Loader2 className="animate-spin" />
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="flex justify-between items-center py-[20px] px-[40px] bg-white">
        <PageBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="bg-white mt-1 p-8">
        <ApprovalQueueTable
          data={queues as ApprovalQueueType[]}
          showPagination={false}
          deleteLoader={deleteLoader}
          onDelete={handleApproval}
          onRejection={handleRejection}
          onRequestChange={handleChangeRequest}
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

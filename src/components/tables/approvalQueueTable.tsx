/* eslint-disable */
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
// import Link from "next/link";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { FileText, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import GenericModal from "../workflow/generic-modal";
import { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  ApprovalQueueDetails,
  ApprovalQueueResponse,
  QueueActions,
} from "@/types/documents";
import { useGetApprovalQueuesIdQuery } from "@/hooks/api/useApprovalsQuery";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/formatFileSize";
import Image from "next/image";

export type ApprovalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Escalated"
  | "Completed"
  | "Cancelled"
  | "PendingChanges";

export enum Status {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Escalated = 4,
  Completed = 5,
  Cancelled = 6,
  PendingChanges = 7,
}

interface DataTableProps {
  data: ApprovalQueueResponse;
  showPagination?: boolean;
  deleteLoader?: boolean;
  onSuccess?: boolean;
  previousTable?: () => void;
  nextTable?: () => void;
  onDelete: (id: string) => void;
  onRejection: (id: string) => void;
  onRequestChange: (id: string) => void;
  onChange: (data: any) => void;
  formData?: QueueActions;
}

export function ApprovalQueueTable(props: DataTableProps) {
  const [deleteId, setDeleteId] = useState("");
  const [approveModal, setModal] = useState(false);
  const [rejectModal, setRejectionModal] = useState(false);
  const [requestchangeModal, setRequestChangeModal] = useState(false);
  const [openRowModal, setOpenRowModal] = useState(false);
  const [queueId, setQueueId] = useState("");
  const toastId = useRef<string | number | null>(null);
  const hasOpenedModalRef = useRef(false);
  const [previewModal, setPreviewModal] = useState(false);

  const {
    data,
    deleteLoader,
    showPagination = false,
    previousTable,
    nextTable,
    onDelete,
    onRejection,
    onSuccess,
    onRequestChange,
    formData,
    onChange,
  } = props;

  const {
    data: queueData,
    isSuccess,
    refetch,
    isFetching,
  } = useGetApprovalQueuesIdQuery(queueId);

  //   const deleteItem = (id: string) => {
  //     setDeleteId(id);
  //     setModal(true);
  //   };
  useEffect(() => {
    if (isFetching && !toastId.current) {
      toastId.current = toast.loading("Working on it, please wait...", {
        position: "top-right",
      });
    }

    if (isSuccess && !hasOpenedModalRef.current) {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }

      toast.success("Done!", { position: "top-right" });
      setOpenRowModal(true);

      //Mark modal as already opened
      hasOpenedModalRef.current = true;
    }

    if (!isFetching && toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }
  }, [isFetching, isSuccess]);

  useEffect(() => {
    if (onSuccess) {
      setOpenRowModal(false);
      setModal(false);
      setRejectionModal(false);
      setRequestChangeModal(false);
    }
  }, [onSuccess]);

  const handleModalClose = () => {
    setOpenRowModal(false);

    hasOpenedModalRef.current = false;
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const styles = {
      Approved: "border-0 text-[#36C58C]",
      Inactive: "border-0 text-[#FC5A5A]",
      Cancelled: "border-0 text-[#FC5A5A]",
      Rejected: "border-0 text-[#FC5A5A]",
      Escalated: "border-0 text-yellow-700",
      PendingChanges: "border-0 text-blue-700",
      Pending: "border-0 text-[#D37C17]",
      Completed: "border-0 text-gray-700",
    };

    const getStatus = (value: string) => {
      const status: ApprovalStatus = Status[Number(value)] as ApprovalStatus;

      return styles[status];
    };

    return (
      <Badge variant="outline" className={getStatus(status)}>
        {Status[Number(status)]}
      </Badge>
    );
  };

  const columns: ColumnDef<ApprovalQueueDetails>[] = [
    {
      accessorKey: "document",
      header: () => {
        return <div className="p-[10px]">Document</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{document?.documentTitle}</p>
            {/* <span className="text-[#A9A9A9] text-[12px]">
              PDF | 5MB
            </span> */}
          </div>
        );
      },
    },
    {
      accessorKey: "contributor",
      header: () => {
        return <div className="p-[10px]">Contributor</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <span className="p-[10px]">
              {document.assignedApprovers.map((item) => item.name).join(",")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Date Submitted",
      header: () => {
        return <div className="p-[10px]">Date Submitted</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{dayjs(document?.submittedAt).format("MMM DD, YYYY")}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="p-[10px]">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as ApprovalStatus;
        return (
          <div className={`w-[100px] ml-[10px]`}>
            <p
              className={`inline-block text-[12px] font-semibold capitalize`}
            ></p>
            {getStatusBadge(status)}
          </div>
        );
      },
    },
  ];

  function getShortDocumentType(contentType?: string) {
    if (!contentType) return "—";

    const parts = contentType.split("/");
    if (parts.length !== 2) return "—";

    return parts[1].toUpperCase();
  }

  const documentIsImage = (type: string) => {
    return type.startsWith("image/");
  };

  const table = useReactTable({
    data: data?.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  //   const canNext = data?.page < data?.meta?.totalPages;
  //   const canPrevious = data?.meta?.page > 1;

  return (
    <div className="w-full min-h-[80vh]">
      <div className="rounded-0 border-0">
        <Table className="border-0 rounded-0">
          <TableHeader className="border-t-[1px] border-[#C4C4C466]/40 rounded-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 hover:!bg-[#F0FCFF] bg-[#F0FCFF]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-[20px] py-[10px] text-[14px] font-[family-name:var(--font-dm)] text-[#667085]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows?.map((row) => (
                <TableRow
                  key={row.id}
                  className="odd:bg-[#F9FAFB] w-full border-0 cursor-pointer"
                  onClick={() => {
                    // setSelectedRow(row.original);
                    setQueueId(row.original.stepInstanceId);
                    setOpenRowModal(false);
                    hasOpenedModalRef.current = false;

                    refetch();
                  }}
                  data-state={row?.getIsSelected() && "selected"}
                >
                  {row?.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-[20px] py-[10px] text-[#464646] font-[family-name:var(--font-dm)] font-[500]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-[family-name:var(--font-dm)]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between space-x-2 py-4 px-[24px]">
          <div className="space-x-2">
            <span className="font-[family-name:var(--font-dm)] text-[#344054] text-[12px]">
              Page {1} of {1}
            </span>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousTable}
              disabled={false}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextTable}
              disabled={false}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      <GenericModal
        isOpen={openRowModal}
        showClose={true}
        handleClose={() => handleModalClose()}
        title="Approval Queue"
      >
        {queueData && (
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 w-full font-[family-name:var(--font-dm)]">
            {/* FILE PREVIEW CARD */}
            <div className="border rounded-md p-4 flex items-center gap-4 bg-[#F9FAFB] shadow-sm">
              <div className="p-3 rounded-md w-1/2">
                {documentIsImage(queueData.document.contentType) ? (
                  <Image
                    src={queueData.document.blobPath}
                    alt="document preview"
                    width={32}
                    height={32}
                    className="w-[80%] mx-auto h-[200px] object-contain rounded"
                  />
                ) : (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(queueData.document.blobPath)}&embedded=true`}
                    className="w-[80%] mx-auto h-[400px] border rounded"
                    title={queueData.document.title}
                  />
                )}
              </div>

              <div>
                <p className="font-medium text-[15px] capitalize">
                  {queueData.activeStep.documentTitle}
                </p>
                <p className="text-[12px] text-[#A9A9A9]">
                  {getShortDocumentType(queueData.document.contentType)} |{" "}
                  {formatFileSize(queueData.document.fileSize)}
                </p>
                <Button
                  className="mt-1 bg-[#F4E4C6] text-[#AD8434] hover:bg-[#F4E4C6] hover:text-[#AD8434] font-medium text-[14px]"
                  onClick={() => setPreviewModal(true)}
                >
                  View Document
                </Button>
              </div>
            </div>

            <h4 className="font-semibold text-[15px] text-primary-gray">
              Document Details
            </h4>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Contributor */}
              <div>
                <p className="text-[14px] text-primary-gray font-semibold">
                  Contributor
                </p>
                <p className="text-[13px] font-medium text-[#464646]">
                  {queueData.activeStep.assignedApprovers
                    .map((item) => item.name)
                    .join(",")}
                </p>
              </div>

              {/* Departmnet */}
              <div className="text-right">
                <p className="text-[14px] text-primary-gray font-semibold">
                  Department
                </p>
                <div className="text-[13px] font-medium text-[#464646]">
                  {queueData.activeStep.department}
                </div>
              </div>

              {/* Document Type */}
              <div>
                <p className="text-[14px] text-primary-gray font-semibold">
                  Document Type
                </p>
                <div className="text-[13px] font-medium text-[#464646]">
                  {queueData.activeStep.documentType}
                </div>
              </div>

              {/* Date Submitted */}
              <div className="text-right">
                <p className="text-[14px] text-primary-gray font-semibold">
                  Submission Date
                </p>
                <p className="text-[13px] font-medium text-[#464646]">
                  {dayjs(queueData.activeStep.submittedAt).format(
                    "MMMM DD, YYYY"
                  )}
                </p>
              </div>

              {/* Workflow Step */}
              <div>
                <p className="text-[14px] text-primary-gray font-semibold">
                  Workflow Step
                </p>
                <p className="text-[13px] font-medium text-[#464646]">
                  {queueData.activeStep.stepName}
                </p>
              </div>

              {/* Status */}
              <div className="text-right">
                <p className="text-[14px] text-primary-gray font-semibold">
                  Status
                </p>
                <div className="text-[13px] font-medium text-[#464646]">
                  {Status[queueData.activeStep.status]}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* APPROVE BUTTON */}
              {queueData.activeStep.canApprove && (
                <Button
                  className="bg-brand-blue w-full py-[20px] hover:bg-brand-blue mt-4"
                  onClick={() => setModal(true)}
                >
                  Approve
                </Button>
              )}

              {/* REJECT BUTTON */}
              {queueData.activeStep.canReject && (
                <Button
                  className="bg-[#DD6A57] w-full py-[20px] hover:bg-[#DD6A57] mt-4"
                  onClick={() => setRejectionModal(true)}
                >
                  Reject
                </Button>
              )}

              {/* REQUEST CHANGE BUTTON */}
              {queueData.activeStep.canRequestChanges && (
                <Button
                  className="bg-[#DD9B4F] w-full py-[20px] hover:bg-[#DD9B4F] mt-4"
                  onClick={() => setRequestChangeModal(true)}
                >
                  Request Change
                </Button>
              )}
            </div>
          </div>
        )}
      </GenericModal>

      {/* Document Approval Modal */}
      <GenericModal
        isOpen={approveModal}
        subTitle="Approve Document"
        description="Are you sure you want to approve this document?"
      >
        <div className="w-full">
          <div className="mt-6 gap-[16px] flex justify-center items-center">
            <Button
              className="bg-[#FC5A5A] py-[24px] hover:bg-[#FC5A5A]"
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-brand-blue py-[24px] hover:bg-brand-blue"
              onClick={() => onDelete(queueId)}
              disabled={deleteLoader}
            >
              {deleteLoader && <Loader2 className="animate-spin" />}
              Approve
            </Button>
          </div>
        </div>
      </GenericModal>

      {/* Document Rejection Modal */}
      <GenericModal
        isOpen={rejectModal}
        subTitle="Reject Document"
        description="Are you sure you want to reject this document?"
      >
        <div className="w-full">
          <Label className="text-primary-gray text-[15px] font-semibold mb-1">
            Reason for Rejecting
          </Label>
          <Textarea
            className="resize-none h-25 w-full focus-visible:ring-0"
            placeholder="Kindly state reason for rejecting"
            onChange={(e) => {
              onChange({
                ...formData,
                comment: e.target.value,
              });
            }}
          />

          <div className="mt-6 gap-[16px] flex justify-center items-center">
            <Button
              className="bg-[#FC5A5A] py-[24px] hover:bg-[#FC5A5A]"
              onClick={() => setRejectionModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-brand-blue py-[24px] hover:bg-brand-blue"
              onClick={() => onRejection(queueId)}
              disabled={deleteLoader}
            >
              {deleteLoader && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </div>
        </div>
      </GenericModal>

      {/* Document Request Change Modal */}
      <GenericModal isOpen={requestchangeModal} subTitle="Request Change">
        <div className="w-full">
          <Label className="text-primary-gray text-[15px] font-semibold mb-1">
            Request change
          </Label>
          <Textarea
            className="resize-none h-25 w-full focus-visible:ring-0"
            placeholder="Kindly state your comments here"
            onChange={(e) => {
              onChange({
                ...formData,
                comment: e.target.value,
              });
            }}
          />

          <div className="mt-6 gap-[16px] flex justify-center items-center">
            <Button
              className="bg-[#FC5A5A] py-[24px] hover:bg-[#FC5A5A]"
              onClick={() => setRequestChangeModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-brand-blue py-[24px] hover:bg-brand-blue"
              onClick={() => onRequestChange(queueId)}
              disabled={deleteLoader}
            >
              {deleteLoader && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </div>
        </div>
      </GenericModal>

      {/* Preview Document upload */}
      <GenericModal
        isOpen={previewModal}
        title="Document Preview"
        showClose={true}
        handleClose={() => setPreviewModal(false)}
        className="!max-w-[600px] h-[600px] overflow-auto"
      >
        <div className="w-full -translate-y-25">
          {/* Document preview */}
          <div className="my-[30px] translate-y-8">
            {queueData && (
              <div>
                {documentIsImage(queueData.document.contentType) ? (
                  <Image
                    src={queueData.document.blobPath}
                    alt="Document"
                    width={32}
                    height={32}
                    className="w-[80%] mx-auto h-[250px] object-cover rounded"
                  />
                ) : (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(queueData.document.blobPath)}&embedded=true`}
                    className="w-[80%] mx-auto h-[400px] border rounded"
                    title={queueData.document.blobPath}
                  />
                )}
              </div>
            )}

            {/* multiple file uploads */}
            {/* {files.length > 1 && (
              <div className="w-[80%] mx-auto">
                <SwiperCard files={files} />
              </div>
            )} */}
          </div>
        </div>
      </GenericModal>
    </div>
  );
}

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
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export type ApprovalQueueType = {
  id: string;
  documentName: string;
  contributor: string;
  dateSubmitted: string;
  status: string;
};

export type ApprovalStatus =
  | "Draft"
  | "Active"
  | "Configured"
  | "Pending"
  | "Closed";

interface DataTableProps {
  data: ApprovalQueueType[];
  showPagination?: boolean;
  deleteLoader?: boolean;
  onSuccess?: boolean;
  previousTable?: () => void;
  nextTable?: () => void;
  onDelete: (id: string) => void;
  onRejection: (id: string) => void;
  onRequestChange: (id: string) => void;
}

export function ApprovalQueueTable(props: DataTableProps) {
  const [deleteId, setDeleteId] = useState("");
  const [approveModal, setModal] = useState(false);
  const [rejectModal, setRejectionModal] = useState(false);
  const [requestchangeModal, setRequestChangeModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ApprovalQueueType | null>(
    null
  );
  const [openRowModal, setOpenRowModal] = useState(false);

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
  } = props;

  //   const deleteItem = (id: string) => {
  //     setDeleteId(id);
  //     setModal(true);
  //   };

  useEffect(() => {
    if (onSuccess) {
      setOpenRowModal(false);
      setModal(false);
      setRejectionModal(false);
      setRequestChangeModal(false);
    }
  }, [onSuccess]);

  const getStatusBadge = (status: ApprovalStatus) => {
    const styles = {
      Active: "border-0 text-[#36C58C]",
      Inactive: "border-0 text-[#FC5A5A]",
      Archived: "border-0 text-yellow-700",
      Configured: "border-0 text-blue-700",
      Pending: "border-0 text-[#D37C17]",
      Draft: "border-0 text-primary-gray",
      Closed: "border-0 text-gray-700",
    };

    return (
      <Badge variant="outline" className={styles[status] || styles["Draft"]}>
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<ApprovalQueueType>[] = [
    {
      accessorKey: "document",
      header: () => {
        return <div className="p-[10px]">Document</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{document?.documentName}</p>
            <span className="text-[#A9A9A9] text-[12px]">
              PDF | 5MB Created{" "}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "contributoe",
      header: () => {
        return <div className="p-[10px]">Contributor</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <span className="text-[12px] p-[10px]">{document.contributor}</span>
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
            <p>{dayjs(document?.dateSubmitted).format("MMM DD, YYYY")}</p>
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

  const table = useReactTable({
    data: data,
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
                    setSelectedRow(row.original);
                    setOpenRowModal(true);
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
        handleClose={() => setOpenRowModal(false)}
        title="Approval Queue"
      >
        {selectedRow && (
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 w-full font-[family-name:var(--font-dm)]">
            {/* FILE PREVIEW CARD */}
            <div className="border rounded-md p-4 flex items-center gap-4 bg-[#F9FAFB] shadow-sm">
              <div className="p-3 bg-[#EEF8FF] rounded-md">
                <FileText className="w-6 h-6 text-brand-blue" />
              </div>

              <div>
                <p className="font-medium text-[15px]">
                  {selectedRow.documentName}
                </p>
                <p className="text-[12px] text-[#A9A9A9]">PDF | 5MB</p>
                <Button className="mt-1 bg-[#F4E4C6] text-[#AD8434] hover:bg-[#F4E4C6] hover:text-[#AD8434] font-medium text-[14px]">
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
                  {selectedRow.contributor}
                </p>
              </div>

              {/* Departmnet */}
              <div className="text-right">
                <p className="text-[14px] text-primary-gray font-semibold">
                  Department
                </p>
                <div className="text-[13px] font-medium text-[#464646]">
                  Human Resource (HR)
                </div>
              </div>

              {/* Document Type */}
              <div>
                <p className="text-[14px] text-primary-gray font-semibold">
                  Document Type
                </p>
                <div className="text-[13px] font-medium text-[#464646]">
                  Employment Contract
                </div>
              </div>

              {/* Date Submitted */}
              <div className="text-right">
                <p className="text-[14px] text-primary-gray font-semibold">
                  Submission Date
                </p>
                <p className="text-[13px] font-medium text-[#464646]">
                  {dayjs(selectedRow.dateSubmitted).format("MMMM DD, YYYY")}
                </p>
              </div>

              {/* Workflow Step */}
              <div>
                <p className="text-[14px] text-primary-gray font-semibold">
                  Workflow Step
                </p>
                <p className="text-[13px] font-medium text-[#464646]">
                  Initial Review
                </p>
              </div>

              {/* Status */}
              <div className="text-right">
                <p className="text-[14px] text-primary-gray font-semibold">
                  Status
                </p>
                <div className="text-[13px] font-medium text-[#464646]">
                  {selectedRow.status}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* APPROVE BUTTON */}
              <Button
                className="bg-brand-blue w-full py-[20px] hover:bg-brand-blue mt-4"
                onClick={() => setModal(true)}
              >
                Approve
              </Button>

              {/* REJECT BUTTON */}
              <Button
                className="bg-[#DD6A57] w-full py-[20px] hover:bg-[#DD6A57] mt-4"
                onClick={() => setRejectionModal(true)}
              >
                Reject
              </Button>

              {/* REQUEST CHANGE BUTTON */}
              <Button
                className="bg-[#DD9B4F] w-full py-[20px] hover:bg-[#DD9B4F] mt-4"
                onClick={() => setRequestChangeModal(true)}
              >
                Request Change
              </Button>
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
              onClick={() => onDelete(deleteId)}
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
              onClick={() => onRejection(deleteId)}
              disabled={deleteLoader}
            >
              {deleteLoader && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </div>
        </div>
      </GenericModal>

      {/* Document Request Change Modal */}
      <GenericModal
        isOpen={requestchangeModal}
        subTitle="Request Change"
      >
        <div className="w-full">
          <Label className="text-primary-gray text-[15px] font-semibold mb-1">
            Request change
          </Label>
          <Textarea
            className="resize-none h-25 w-full focus-visible:ring-0"
            placeholder="Kindly state your comments here"
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
              onClick={() => onRequestChange(deleteId)}
              disabled={deleteLoader}
            >
              {deleteLoader && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
}

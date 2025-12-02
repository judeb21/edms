/* eslint-disable */
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import Link from "next/link";

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
import { Edit, Loader2, Trash2 } from "lucide-react";
import { WorkflowTypes } from "@/types/workflow";
import dayjs from "dayjs";
import GenericModal from "../workflow/generic-modal";
import { useEffect, useState } from "react";

export type WorkflowType = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  name: string;
  status: string;
};

export type WorkflowStatus =
  | "Draft"
  | "Active"
  | "Under Review"
  | "Configured"
  | "Closed";

interface DataTableProps {
  data: WorkflowTypes[];
  showPagination?: boolean;
  deleteLoader?: boolean;
  onSuccess?: boolean;
  previousTable?: () => void;
  nextTable?: () => void;
  onDelete: (id: string) => void;
}

export function WorkFlowDataTable(props: DataTableProps) {
  const [deleteId, setDeleteId] = useState("");
  const [deleteModal, setModal] = useState(false);
  const {
    data,
    deleteLoader,
    showPagination = false,
    previousTable,
    nextTable,
    onDelete,
    onSuccess,
  } = props;

  const deleteItem = (id: string) => {
    setDeleteId(id);
    setModal(true);
  };

  useEffect(() => {
    if (onSuccess) setModal(false);
  }, [onSuccess]);

  const getStatusBadge = (status: WorkflowStatus) => {
    const styles = {
      Active: "border-0 text-[#36C58C]",
      Inactive: "border-0 text-[#FC5A5A]",
      Archived: "border-0 text-yellow-700",
      Configured: "border-0 text-blue-700",
      "Under Review": "border-0 text-purple-700",
      Draft: "border-0 text-primary-gray",
      Closed: "border-0 text-gray-700",
    };

    return (
      <Badge variant="outline" className={styles[status] || styles["Draft"]}>
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<WorkflowTypes>[] = [
    {
      accessorKey: "name",
      header: () => {
        return <div className="p-[10px]">Workflow Name</div>;
      },
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{ticket?.name}</p>
            <span className="text-[#A9A9A9] text-[12px]">
              Created {dayjs(ticket?.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="p-[10px]">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as WorkflowStatus;
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
    {
      accessorKey: "scope",
      header: () => {
        return <div className="p-[10px]">Scope</div>;
      },
      cell: ({ row }) => {
        const workflow = row.original;
        return (
          <div className="capitalize p-[10px]">
            <span className="bg-[#DAF5FF] rounded-[24px] text-[12px] text-[#0284B2] p-[10px]">
              {workflow.scopeType}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: () => {
        return <div className="p-[10px]">Last Modified</div>;
      },
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{dayjs(ticket?.updatedAt).format("MMM DD, YYYY")}</p>
          </div>
        );
      },
    },
    {
      id: "action",
      header: () => <div className="p-[10px]">Action</div>,
      cell: ({ row }) => {
        const workflow = row.original;
        return (
          <div className="ml-[10px] flex justify-start items-center text-[13px] gap-4 text-[#1A1A1A]">
            <Link href={`/workflow-editor/${workflow?.id}`}>
              <Edit
                strokeWidth={1.5}
                className="h-5 w-5 cursor-pointer hover:text-[#2E7D32]"
                color="#E8D244"
              />
            </Link>

            {workflow.status?.toLowerCase() !== "inactive" && (
              <Trash2
                color="#FC5A5A"
                className="h-5 w-5 cursor-pointer"
                onClick={() => deleteItem(workflow?.id)}
              />
            )}
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
                  className="odd:bg-[#F9FAFB] w-full border-0"
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

      <GenericModal
        isOpen={deleteModal}
        subTitle="Delete Workflow"
        description="Are you sure you want to delete this workflow?"
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
              Delete
            </Button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
}

/* eslint-disable */
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

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
import dayjs from "dayjs";
import { Avatar, AvatarFallback } from "../ui/avatar";

export type AuditTrailType = {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  name: string;
  email: string;
  actions: string;
  documentTitle: string;
};

interface DataTableProps {
  data: AuditTrailType[];
  showPagination?: boolean;
  previousTable?: () => void;
  nextTable?: () => void;
}

export function AuditTrailDataTable(props: DataTableProps) {
  const { data, showPagination = false, previousTable, nextTable } = props;

  const columns: ColumnDef<AuditTrailType>[] = [
    {
      accessorKey: "name",
      header: () => {
        return <div className="p-[10px]">User</div>;
      },
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="p-[10px]">
            <div className="flex gap-2">
              <Avatar>
                <AvatarFallback className="bg-brand-blue text-white">
                  {ticket.name.split(" ")[0].charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="capitalize">{ticket?.name}</p>
                <span className="text-[#A9A9A9] text-[12px]">
                  {ticket?.email}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createAt",
      header: () => {
        return <div className="p-[10px]">Date</div>;
      },
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{dayjs(ticket?.createdAt).format("MMM DD, YYYY")}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: () => {
        return <div className="p-[10px]">Document Title</div>;
      },
      cell: ({ row }) => {
        const trail = row.original;
        return (
          <div className="capitalize p-[10px]">
            <span className="">
              {trail.documentTitle}
            </span>
          </div>
        );
      },
    },
    {
      id: "action",
      header: () => <div className="p-[10px]">Action</div>,
      cell: ({ row }) => {
        const trail = row.original;
        return (
          <div className="ml-[10px] capitalize flex justify-start items-center text-[13px] gap-4 text-[#1A1A1A]">
            {trail.actions}
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
    </div>
  );
}

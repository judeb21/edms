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
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export type DocumentType = {
  id: string;
  title: string;
  category: string;
  department: string;
  dateModified: string;
  status: string;
};

export type ApprovalStatus =
  | "Draft"
  | "Active"
  | "Submitted"
  | "Pending"
  | "Closed";

interface DataTableProps {
  data: DocumentType[];
  showPagination?: boolean;
  deleteLoader?: boolean;
  onSuccess?: boolean;
  previousTable?: () => void;
  nextTable?: () => void;
}

export function DocumentsTable(props: DataTableProps) {
  const router = useRouter();
  const {
    data,
    showPagination = false,
    previousTable,
    nextTable,
    onSuccess,
  } = props;

  const getStatusBadge = (status: ApprovalStatus) => {
    const styles = {
      Active: "border-0 text-[#36C58C]",
      Inactive: "border-0 text-[#FC5A5A]",
      Submitted: "border-0 text-brand-blue",
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

  const columns: ColumnDef<DocumentType>[] = [
    {
      accessorKey: "title",
      header: () => {
        return <div className="p-[10px]">Title</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{document?.title}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => {
        return <div className="p-[10px]">Category</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <span className="">{document.category}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: () => {
        return <div className="p-[10px]">Department</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{document?.department}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "dateModified",
      header: () => {
        return <div className="p-[10px]">Date Modified</div>;
      },
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="capitalize p-[10px]">
            <p>{dayjs(document?.dateModified).format("MMM DD, YYYY")}</p>
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
          <div className={`w-[100px]`}>
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

  const goToDetailsPage = (id: string) => {
    router.push(`/documents/${id}`);
  };

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
                    goToDetailsPage(row.original?.id);
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
    </div>
  );
}

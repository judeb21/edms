"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { useGetDepartmentsQuery } from "@/hooks/api/useSmartUserQuery";
import { DepartmentType } from "@/types/smartUserTypes";

export default function FilterHeader({
  formData,
  handleSearchClear,
  onChange,
}: {
  formData: any;
  handleSearchClear: () => void;
  onChange: (data: any) => void;
}) {
  const [search, setSearchValue] = useState(formData?.keyword);
  const [department, setDepartment] = useState(formData?.department);

  const { data: departmentsData } = useGetDepartmentsQuery();

  const departments = useMemo(() => {
    const sortedData =
      departmentsData?.data?.sort((a, b) =>
        a.departmentName
          .trim()
          .localeCompare(b.departmentName.trim(), undefined, {
            sensitivity: "base",
          })
      ) ?? ([] as DepartmentType[]);

    return sortedData;
  }, [departmentsData]);

  const handleSearch = (e: string) => {
    setSearchValue(e);
    onChange({ ...formData, keyword: e });
  };

  const handleDepartment = (e: string) => {
    setDepartment(e);
    onChange({ ...formData, department: e });
  };

  const onClear = () => {
    setSearchValue("");
    handleSearchClear();
  };

  return (
    <div className="flex items-center gap-[20px] md:flex-row flex-col w-full mt-4">
      <div className="md:max-w-[250px] w-full">
        <Label
          htmlFor="keywords"
          className="text-left block text-[13px] text-[#464646] font-[family-name:var(--font-dm)]"
        >
          Keywords
        </Label>
        <div className="relative mt-1">
          <Search
            className="text-[#A9A9A9] absolute top-[15px] left-2"
            size={20}
          />
          <Input
            id="keyword"
            placeholder="Search with Ticket ID"
            className="max-w-[250px] w-full md:w-[250px] h-[50px] focus-visible:ring-0 rounded-[8px] placeholder:text-[#A9A9A9] font-[family-name:var(--font-dm)] pl-[35px] text-[#101828] font-[500] pr-[35px]"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {formData?.keyword && (
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
          Department
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="md:w-[200px] mt-1 w-full h-[50px] sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-dm)] text-[#3D4F5C] truncate"
            >
              <span>{department || "All"}</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="font-[family-name:var(--font-poppins)] text-[12px] md:min-w-[200px] w-full h-40 overflow-auto"
          >
            <DropdownMenuRadioGroup
              value={formData.department}
              onValueChange={(e) => handleDepartment(e)}
            >
              <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
              {departments?.map((department) => {
                return (
                  <DropdownMenuRadioItem
                    value={department.departmentName}
                    key={department.departmentId}
                  >
                    {department.departmentName}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

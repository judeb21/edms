"use client";

import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
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
import { useCallback, useMemo, useState } from "react";
import { useGetDepartmentsQuery } from "@/hooks/api/useSmartUserQuery";
import { DepartmentType } from "@/types/smartUserTypes";
import dayjs from "dayjs";
// import { DateFilter } from "@/types";
import { DateRangeFilter } from "../ui/date-picker";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function FilterHeader({
  formData,
  handleSearchClear,
  onChange,
  isFetching,
}: {
  formData: any;
  handleSearchClear: () => void;
  onChange: (data: any) => void;
  isFetching: boolean;
}) {
  const [search, setSearchValue] = useState(formData?.keyword);
  const [department, setDepartment] = useState(formData?.department);

  const { data: departmentsData } = useGetDepartmentsQuery();

  const [ticketFilter, setTicketFilter] = useState("3");
  const [showCardCustomDate, setCardCustomDate] = useState(false);

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

  const handleFilter = (e: string) => {
    if (Number(e) === 0) {
      const formattedFromDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      const formattedToDate = dayjs().format("YYYY-MM-DD");
      onChange({
        ...formData,
        dateFrom: dayjs.utc(formattedFromDate).startOf("day"),
        dateTo: dayjs.utc(formattedToDate).startOf("day"),
      });

      setCardCustomDate(false);
      return;
    }
    if (Number(e) === 1) {
      const formattedFromDate = dayjs()
        .subtract(30, "day")
        .format("YYYY-MM-DD");
      const formattedToDate = dayjs().format("YYYY-MM-DD");
      onChange({
        ...formData,
        dateFrom: dayjs.utc(formattedFromDate).startOf("day"),
        dateTo: dayjs.utc(formattedToDate).startOf("day"),
      });

      setCardCustomDate(false);
      return;
    }
    if (Number(e) === 3) {
      onChange({
        ...formData,
        dateFrom: "",
        dateTo: "",
      });

      setCardCustomDate(false);
      return;
    }
    setCardCustomDate(true);
  };

  // const getTicketCardDataRange = (range: DateFilter) => {
  //   const { dateFrom, dateTo } = range;
  //   const shouldSetDate = dateFrom && dateTo;

  //   // if (shouldSetDate) setCardCustomDate(false);
  //   if (shouldSetDate) {
  //     const formattedFromDate = dayjs(dateFrom).format("YYYY-MM-DD");
  //     const formattedToDate = dayjs(dateTo).format("YYYY-MM-DD");
  //     onChange({
  //       ...formData,
  //       dateFrom: dayjs.utc(formattedFromDate).startOf("day"),
  //       dateTo: dayjs.utc(formattedToDate).endOf("day"),
  //     });

  //     return;
  //   }
  // };

  //Stop unnecessary re-renders
  
   
  const handleDateChange = useCallback(
    (newRange: {
      dateFrom: string | Date | undefined;
      dateTo: string | Date | undefined;
    }) => {
      const { dateFrom, dateTo } = newRange;
      if (dateFrom && dateTo) {
        const formattedFromDate = dayjs(dateFrom).format("YYYY-MM-DD");
        const formattedToDate = dayjs(dateTo).format("YYYY-MM-DD");

        onChange({
          ...formData,
          dateFrom: dayjs.utc(formattedFromDate).startOf("day"),
          dateTo: dayjs.utc(formattedToDate).endOf("day"),
        });
      }
    },
    [formData, onChange] // ✅ Add dependencies
  );
  // eslint-enable */

  const resetDateFilter = () => {
    handleFilter("2");
    setTicketFilter("2");
    onChange({ ...formData, dateFrom: "", dateTo: "" });
    // setCardCustomDate(false);
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
            placeholder="Search with Title"
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

      {/* Date filter */}
      <div className="col-span-1 grid items-center w-full md:w-[150px] md:ml-[50px] relative">
        <Label
          htmlFor="date"
          className="text-left block text-[14px] text-[#464646]"
        >
          Date
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[150px] h-[50px] sm:justify-between focus-visible:ring-1 font-[family-name:var(--font-poppins)] text-[#3D4F5C] truncate text-[14px]"
            >
              {Number(ticketFilter) === 3 && "All"}
              {Number(ticketFilter) === 0 && "Last 7 days"}
              {Number(ticketFilter) === 1 && "Last 30 days"}
              {Number(ticketFilter) === 2 && "Custom date"}
              <ChevronUp size={14} className="text-[#07112D]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuRadioGroup
              value={ticketFilter}
              onValueChange={(e) => {
                setTicketFilter(e);
                handleFilter(e);
              }}
              className="text-[#BFBFBF] text-[14px] -tracking-[0.5px]"
            >
              <DropdownMenuRadioItem value="3">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="0">
                Last 7 days
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1">
                Last 30 days
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2">
                Custom date
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {showCardCustomDate && (
          <div className="absolute top-15 right-0 border rounded-[8px]">
            <DateRangeFilter
              dateFrom={formData.dateFrom.toString()}
              dateTo={formData.dateTo?.toString()}
              onDateChange={handleDateChange}
              updateDateFilter={resetDateFilter}
              onClose={() => setCardCustomDate(false)}
              className="mx-auto"
              openOnMount={showCardCustomDate}
              isFetching={isFetching}
            />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Loader2, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOrdinal } from "@/utils/getOrdinal";
import { DateFilter } from "@/types";
import dayjs from "dayjs";
import { parseLocalDate } from "@/utils/time";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type DateRangeFilterProps = {
  onDateChange: (range: DateFilter) => void;
  updateDateFilter: () => void;
  onClose: () => void;
  dateFrom?: string;
  dateTo?: string;
  className?: string;
  openOnMount?: boolean;
  isFetching: boolean;
};

export function DateRangeFilter({
  onDateChange,
  updateDateFilter,
  dateFrom,
  dateTo,
  className,
  openOnMount = false,
  isFetching,
  onClose,
}: DateRangeFilterProps) {
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const [fromPopoverOpen, setFromPopoverOpen] = useState(false);
  const [toPopoverOpen, setToPopoverOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize only once to avoid re-setting state in loops
  useEffect(() => {
    if (!isInitialized) {
      if (dateFrom) {
        /* eslint-disable */
        const parsed = parseLocalDate(dateFrom);
        setFrom(parsed);
        setFromDate(parsed);
        // eslint-enable */
      }

      if (dateTo) {
        const parsed = parseLocalDate(dateTo);
        setTo(parsed);
        setToDate(parsed);
        // eslint-enable */
      }

      if (openOnMount && (dateFrom || dateTo)) {
        setFromPopoverOpen(true);
      }

      setIsInitialized(true);
    }
  }, [dateFrom, dateTo, openOnMount, isInitialized]);

  // const isRangeValid =
  //   from && to && (isBefore(from, to) || isSameDay(from, to));

  // useEffect(() => {
  //   onDateChange({ dateFrom, dateTo: isRangeValid ? dateTo : undefined });
  // }, [from, to, isRangeValid, onDateChange]);

  const formatDisplayDate = (date?: Date) =>
    date
      ? `${format(date, "MMM")}. ${getOrdinal(date.getDate())}, ${format(
          date,
          "yyyy"
        )}`
      : undefined;

  const handleDateApply = () => {
    if (fromDate) setFrom(fromDate);
    if (toDate) setTo(toDate);
    onDateChange({ dateFrom: fromDate, dateTo: toDate });
    console.info({
      From: fromDate,
      To: toDate,
    });
    setFromPopoverOpen(false);
    setToPopoverOpen(false);
  };

  const handleDateReset = () => {
    setFromDate(undefined);
    setToDate(undefined);
    updateDateFilter();
    setFromPopoverOpen(false);
    setToPopoverOpen(false);
  };

  return (
    <div
      className={`relative w-full max-w-xl bg-white shadow-md p-3 mt-2 rounded-[8px] font-[family-name:var(--font-dm)] z-20`}
    >
      <div className="flex items-start gap-2 w-full">
        <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
          {/* From Date */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <Popover open={fromPopoverOpen} onOpenChange={setFromPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? (
                    formatDisplayDate(fromDate)
                  ) : (
                    <span>From Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={fromDate}
                  onSelect={(d) => d && setFromDate(startOfDay(d))}
                  disabled={(d) => d > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <Popover open={toPopoverOpen} onOpenChange={setToPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? formatDisplayDate(toDate) : <span>To Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(d) => d && setToDate(startOfDay(d))}
                  disabled={(d) =>
                    d > new Date() || (fromDate ? d < fromDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Reset */}
        {(from || to) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setFrom(undefined);
              setTo(undefined);
              onClose();
            }}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Button
          variant="ghost"
          onClick={handleDateReset}
          className="text-sm font-bold text-gray-700"
        >
          Reset
        </Button>
        <Button
          variant="default"
          onClick={handleDateApply}
          className="text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue"
          disabled={isFetching}
        >
          {isFetching && <Loader2 className="animate-spin" />}
          Apply
        </Button>
      </div>
    </div>
  );
}

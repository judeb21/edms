"use client";

import { useEffect, useState } from "react";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Loader2, X } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
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

// const formatDisplayDate = (date: Date) => {
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   return `${months[date.getMonth()]}. ${getOrdinal(date.getDate())}, ${date.getFullYear()}`;
// };

// Simple Calendar Component
const SimpleCalendar = ({
  selected,
  onSelect,
  month,
  onMonthChange,
  disabled,
}: {
  selected?: Date;
  onSelect: (date: Date) => void;
  month?: Date;
  onMonthChange?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    month || selected || new Date(),
  );

  useEffect(() => {
    /* eslint-disable */
    if (month) setCurrentMonth(month);
    // eslint-enable */
  }, [month]);

  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = new Date(year, monthIndex, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleYearChange = (newYear: number) => {
    const newDate = new Date(newYear, monthIndex, 1);
    setCurrentMonth(newDate);
    onMonthChange?.(newDate);
  };

  const handleMonthChange = (newMonthIndex: number) => {
    const newDate = new Date(year, newMonthIndex, 1);
    setCurrentMonth(newDate);
    onMonthChange?.(newDate);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === monthIndex &&
      selected.getFullYear() === year
    );
  };

  const isDisabled = (day: number) => {
    const date = new Date(year, monthIndex, day);
    return disabled ? disabled(date) : false;
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex gap-2 mb-4">
        <select
          value={monthIndex}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          className="flex-1 px-2 py-1 border rounded"
        >
          {months.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="flex-1 px-2 py-1 border rounded"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-600 p-2"
          >
            {d}
          </div>
        ))}
        {days.map((day, i) => (
          <div key={i} className="aspect-square">
            {day && (
              <button
                onClick={() =>
                  !isDisabled(day) && onSelect(new Date(year, monthIndex, day))
                }
                disabled={isDisabled(day)}
                className={`w-full h-full rounded-md text-sm ${
                  isSelected(day)
                    ? "bg-blue-500 text-white font-bold"
                    : isDisabled(day)
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
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

  const [fromMonth, setFromMonth] = useState<Date | undefined>();
  const [toMonth, setToMonth] = useState<Date | undefined>();

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

  const handleFromMonthChange = (newMonth: Date) => {
    setFromMonth(newMonth);

    if (fromDate) {
      const newDate = new Date(
        newMonth.getFullYear(),
        newMonth.getMonth(),
        fromDate.getDate(),
      );

      if (newDate.getMonth() !== newMonth.getMonth()) {
        newDate.setDate(0);
      }

      setFromDate(startOfDay(newDate));
    }
  };

  const handleToMonthChange = (newMonth: Date) => {
    setToMonth(newMonth);

    if (toDate) {
      const newDate = new Date(
        newMonth.getFullYear(),
        newMonth.getMonth(),
        toDate.getDate(),
      );

      if (newDate.getMonth() !== newMonth.getMonth()) {
        newDate.setDate(0);
      }

      setToDate(startOfDay(newDate));
    }
  };

  // const isRangeValid =
  //   from && to && (isBefore(from, to) || isSameDay(from, to));

  // useEffect(() => {
  //   onDateChange({ dateFrom, dateTo: isRangeValid ? dateTo : undefined });
  // }, [from, to, isRangeValid, onDateChange]);

  const formatDisplayDate = (date?: Date) =>
    date
      ? `${format(date, "MMM")}. ${getOrdinal(date.getDate())}, ${format(
          date,
          "yyyy",
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
                    !fromDate && "text-muted-foreground",
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
                <SimpleCalendar
                  selected={fromDate}
                  onSelect={(d) => {
                    d && setFromDate(startOfDay(d));
                    setFromMonth(d);
                  }}
                  month={fromMonth}
                  onMonthChange={handleFromMonthChange}
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
                    !toDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? formatDisplayDate(toDate) : <span>To Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <SimpleCalendar
                  selected={toDate}
                  onSelect={(d) => {
                    d && setToDate(startOfDay(d));
                    setToMonth(d);
                  }}
                  month={toMonth}
                  onMonthChange={handleToMonthChange}
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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    [key: string]: any; // Allow additional properties like email, dept, role, etc.
  }[];
  onValueChange: (value: string[]) => void;
  onSelectionChange?: (selectedOptions: any[]) => void; // New callback with full option objects
  defaultOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    [key: string]: any; // Allow additional properties like email, dept, role, etc.
  }[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  
  // New props for server-side search and infinite loading
  onSearch?: (value: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      onSelectionChange,
      variant,
      defaultOptions = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      onSearch,
      onLoadMore,
      hasMore = false,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultOptions.map((u) => u.value));
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    
    // Store all options we've seen (both from initial load and searches)
    const [optionsStore, setOptionsStore] = React.useState<Map<string, {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }>>(new Map());

    // Update options store whenever new options come in
    React.useEffect(() => {
      setOptionsStore((prevStore) => {
        const newStore = new Map(prevStore);
        options.forEach((option) => {
          newStore.set(option.value, option);
        });
        return newStore;
      });
    }, [options]);

    // Update options store whenever there's default value
    React.useEffect(() => {
      setOptionsStore((prevStore) => {
        const newStore = new Map(prevStore);
        defaultOptions.forEach((option) => {
          newStore.set(option.value, option);
        });
        return newStore;
      });
    }, [defaultOptions]);

    // Debounce search to avoid too many API calls
    React.useEffect(() => {
      if (onSearch) {
        const timer = setTimeout(() => {
          onSearch(searchValue);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [searchValue, onSearch]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
        
        // Send full option objects if callback exists
        if (onSelectionChange) {
          const selectedOptions = newSelectedValues
            .map(val => optionsStore.get(val))
            .filter(Boolean);
          onSelectionChange(selectedOptions);
        }
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      
      // Send full option objects if callback exists
      if (onSelectionChange) {
        const selectedOptions = newSelectedValues
          .map(val => optionsStore.get(val))
          .filter(Boolean);
        onSelectionChange(selectedOptions);
      }
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
      
      // Send empty array if callback exists
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    };

    const handleTogglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Don't toggle if clicking on a badge or X icon
      const target = event.target as HTMLElement;
      if (
        target.closest('[data-badge]') || 
        target.closest('[data-remove-icon]')
      ) {
        return;
      }
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      
      // Send full option objects if callback exists
      if (onSelectionChange) {
        const selectedOptions = newSelectedValues
          .map(val => optionsStore.get(val))
          .filter(Boolean);
        onSelectionChange(selectedOptions);
      }
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
        
        // Send full option objects if callback exists
        if (onSelectionChange) {
          onSelectionChange(options);
        }
      }
    };

    // Observer for infinite scroll
    const observerTarget = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!onLoadMore || !hasMore || isLoading) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );

      const currentTarget = observerTarget.current;
      if (currentTarget) {
        observer.observe(currentTarget);
      }

      return () => {
        if (currentTarget) {
          observer.unobserve(currentTarget);
        }
      };
    }, [onLoadMore, hasMore, isLoading]);

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    // Use optionsStore instead of options to get the selected item
                    const option = optionsStore.get(value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        data-badge
                        className={cn(
                          "!bg-[#E2F5FC] hover:bg-[#E2F5FC] !text-brand-blue capitalize",
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant })
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {option?.label}
                        <XCircle
                          data-remove-icon
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      data-badge
                      className={cn(
                        "!bg-[#E2F5FC] !text-brand-blue border-foreground/1 hover:bg-[#E2F5FC]",
                        isAnimating ? "animate-bounce" : "",
                        multiSelectVariants({ variant })
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
                      <XCircle
                        data-remove-icon
                        className="ml-2 h-4 w-4 cursor-pointer"
                        color="#0284B2"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    data-remove-icon
                    className="h-4 mx-2 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex min-h-6 h-full"
                  />
                  <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">
                  {placeholder}
                </span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-70 p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command shouldFilter={!onSearch}>
            <CommandInput
              placeholder="Search..."
              onKeyDown={handleInputKeyDown}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading..." : "No results found."}
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.length === options.length
                        ? "bg-white text-white border-brand-blue"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className="h-4 w-4" color="#0284B2" />
                  </div>
                  <span>(Select All)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-white text-white border-brand-blue"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" color="#0284B2" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
                {/* Infinite scroll trigger */}
                {hasMore && (
                  <div ref={observerTarget} className="py-2 text-center">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mx-auto" />}
                  </div>
                )}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer"
                      >
                        Clear
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full"
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

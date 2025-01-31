"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronsUpDown,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  value,
  onChange,
  className,
  filter = false,
  placeholder = "Select date",
}: Readonly<{
  value: Date | undefined;
  onChange: (date: Date | undefined) => void | null;
  className?: string;
  filter?: boolean;
  placeholder?: string;
}>) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center">
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal px-3 [&_svg]:gap-1 h-9",
              className,
              value && filter ? "rounded-r-none" : "rounded-md",
              filter ? "text-xs" : "text-sm"
            )}
          >
            <CalendarIcon />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
            <ChevronsUpDown className="!size-3 opacity-50 ml-auto" />
          </Button>
        </PopoverTrigger>
        {value && filter && (
          <Button
            variant={"outline"}
            className="size-8 p-0 flex-none rounded-l-none border-l-0 hover:bg-red-100"
            onClick={() => onChange(undefined)}
          >
            <XCircle />
          </Button>
        )}
      </div>
      <PopoverContent portal={false} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date as Date);
            setOpen(false);
          }}
          initialFocus
          disabled={(date) => (filter ? false : date < new Date())}
        />
      </PopoverContent>
    </Popover>
  );
}

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import React from "react";

export const CustomToolbar = ({
  date,
  onNavigate,
}: {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}) => {
  return (
    <div className="mb-4 flex gap-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        className="shadow-none"
        size={"icon"}
        onClick={() => onNavigate("PREV")}
        variant={"outline"}
      >
        <ChevronLeftIcon />
      </Button>
      <div className="flex items-center px-3 h-9 border gap-2 border-input rounded-md justify-center w-full lg:w-auto">
        <CalendarDaysIcon className="size-4" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        className=" shadow-none"
        size={"icon"}
        onClick={() => onNavigate("NEXT")}
        variant={"outline"}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};

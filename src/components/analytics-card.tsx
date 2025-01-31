import React from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}) => {
  const colorIcon = variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <CardDescription className="flex items-center gap-2 font-medium overflow-hidden">
            <span className="truncate text-sm">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-1">
            <Icon className={cn(colorIcon, "size-4")} />
            <span
              className={cn(increaseValueColor, "text-sm truncate font-medium")}
            >
              {increaseValue.toLocaleString()}
            </span>
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold">
          {value.toLocaleString()}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

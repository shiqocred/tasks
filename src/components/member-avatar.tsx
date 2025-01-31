import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const MemberAvatar = ({ fallbackClassName, className, name }: any) => {
  return (
    <Avatar
      className={cn(
        "size-10 transition border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "bgneutral-200 text-neutral-500 font-medium flex items-center justify-center",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

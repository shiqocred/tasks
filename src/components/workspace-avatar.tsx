"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useSidebar } from "./ui/sidebar";

export const WorkspaceAvatar = ({ image, className, name }: any) => {
  const { state } = useSidebar();
  if (image) {
    return (
      <div
        className={cn(
          "relative rounded-md overflow-hidden",
          className,
          state === "collapsed" ? "size-[31px] " : "size-10 "
        )}
      >
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : null}
      </div>
    );
  }

  return (
    <Avatar
      className={cn(
        "rounded-md",
        className,
        state === "collapsed" ? "size-[31px] text-base" : "size-10 text-lg"
      )}
    >
      <AvatarFallback className="uppercase rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white font-medium">
        {name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const WorkspaceAvatarGeneral = ({ image, className, name }: any) => {
  if (image) {
    return (
      <div
        className={cn("relative rounded-md overflow-hidden size-10", className)}
      >
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : null}
      </div>
    );
  }

  return (
    <Avatar className={cn("rounded-md size-10 text-lg", className)}>
      <AvatarFallback className="uppercase rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white font-medium">
        {name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};

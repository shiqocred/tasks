"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export const ProjectAvatar = ({ image, className, name }: any) => {
  if (image) {
    return (
      <div className={cn("relative rounded overflow-hidden size-5", className)}>
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : null}
      </div>
    );
  }

  return (
    <Avatar className={cn("rounded size-5 text-xs", className)}>
      <AvatarFallback className="uppercase rounded bg-gradient-to-br from-blue-500 to-blue-700 text-white font-medium">
        {name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};

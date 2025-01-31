import React, { ReactNode } from "react";

export const OverviewProperty = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};

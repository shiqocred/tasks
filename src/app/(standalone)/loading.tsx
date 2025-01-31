import { Loader } from "lucide-react";
import React from "react";

const DashboardLoading = () => {
  return (
    <div className="h-[calc(100vh-128px-16px)] flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default DashboardLoading;

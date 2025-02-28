"use client";

import { AlertTriangle } from "lucide-react";
import React, { useEffect } from "react";

const ErrorComponent = ({
  error,
}: {
  error: Error & { digest?: string; status: any };
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AlertTriangle className="size-10" />
      <p className="font-semibold">{error.message}</p>
    </div>
  );
};

export default ErrorComponent;

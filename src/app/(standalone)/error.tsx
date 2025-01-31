"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, HomeIcon, RefreshCcw } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string; status: any };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="w-full h-[calc(100vh-128px-16px)] flex items-center justify-center">
      <Card>
        <CardContent className="p-5 flex flex-col items-center gap-4">
          <div className="flex flex-col gap-1 items-center justify-center pt-6 pb-2">
            <AlertTriangle className="size-10" />
            <p className="font-semibold text-lg">{error.message}</p>
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <Button variant={"link"} onClick={reset}>
              <RefreshCcw />
              Try Again
            </Button>
            <Button asChild>
              <Link href={"/"}>
                <HomeIcon />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;

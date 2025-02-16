"use client";

import React from "react";
import UserButton from "./user-button";
import { Separator } from "./ui/separator";
import { useSidebar } from "./ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import { Sidebar } from "lucide-react";

export const Navbar = ({
  isLoading,
  breadcrumb,
}: {
  isLoading: boolean;
  breadcrumb?: { label?: string; href?: string; loading?: string }[];
}) => {
  const { open, openMobile, setOpen, setOpenMobile, isMobile } = useSidebar();
  return (
    <header className="flex h-[74px] shrink-0 items-center gap-2 transition-[width,height] ease-linear w-full justify-between px-3 border-b border-gray-300">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={() => {
            if (isMobile) {
              setOpenMobile(!openMobile);
            } else {
              setOpen(!open);
            }
          }}
          className="w-fit h-fit p-1 bg-transparent text-black hover:bg-neutral-100 shadow-none"
        >
          <Sidebar className="size-6" />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          {isLoading ? (
            <BreadcrumbList>
              <BreadcrumbItem className="animate-pulse duration-1000">
                Home
              </BreadcrumbItem>
              {breadcrumb?.map((item) => (
                <React.Fragment key={item.loading}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="animate-pulse duration-1000">
                    {item?.loading}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          ) : (
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumb?.map((item) => (
                <React.Fragment key={item.label}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {item?.href ? (
                      <BreadcrumbLink href={item.href}>
                        {item?.label}
                      </BreadcrumbLink>
                    ) : (
                      item?.label
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          )}
        </Breadcrumb>
      </div>
      <UserButton />
    </header>
  );
};

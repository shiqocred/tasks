import UserButton from "@/components/user-button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const StandaloneLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href={"/"}>
            <Image src={"/logo.svg"} width={140.4} alt="logo" height={31} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StandaloneLayout;

import React from "react";
import { Client } from "./_components/client";
import { infoJoin } from "@/features/auth/server/queries";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const InviteMemberPage = async ({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) => {
  const { inviteCode } = await params;
  const info = await infoJoin(inviteCode);

  if (
    (!info?.data?.status && !info?.data?.data) ||
    (info?.data?.status && !info?.data?.data)
  ) {
    toast.error("Invite invalid");
    redirect("/sign-in");
  }

  return (
    <div className="w-full">
      <Client info={info} />
    </div>
  );
};

export default InviteMemberPage;

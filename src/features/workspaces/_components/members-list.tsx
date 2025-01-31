"use client";

import React, { Fragment } from "react";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LogOut, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { MemberAvatar } from "@/components/member-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { MemberRole } from "@/features/members/types";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useConfirm } from "@/hooks/use-confirm";
import { Badge } from "@/components/ui/badge";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Remove member",
    "this member will be removed from the workspace",
    "destructive"
  );

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave Workspace",
    "you will be removed from the workspace",
    "destructive"
  );

  const { mutate: deleteMember, isPending: isDeleteMember } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdateMember } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const handleLeave = async (memberId: string) => {
    const ok = await confirmLeave();

    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <LeaveDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
        <Button variant={"secondary"} size={"sm"} asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Member List</CardTitle>
      </CardHeader>
      <Separator className="mx-7" />
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                fallbackClassName={"text-lg"}
                className={"size-10"}
                name={member.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <Badge className="capitalize bg-gray-300 hover:bg-gray-300 text-black font-normal text-xs rounded-full cursor-default">
                  {member.role.toLowerCase()}
                </Badge>
                {member.role === MemberRole.MEMBER && member.owner && (
                  <Button
                    onClick={() => handleLeave(member.$id)}
                    className="px-2.5 py-0.5 text-xs h-auto rounded-full [&_svg]:size-3 bg-red-400/80 hover:bg-red-400 text-black"
                  >
                    Leave
                    <ArrowRight />
                  </Button>
                )}
                {member.role === MemberRole.ADMIN && member.owner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"secondary"} size={"icon"}>
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom">
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.ADMIN)
                        }
                        disabled={isUpdateMember}
                        className="font-medium"
                      >
                        Set as administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.MEMBER)
                        }
                        disabled={isUpdateMember}
                        className="font-medium"
                      >
                        Set as member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isDeleteMember}
                        className="font-medium text-amber-700"
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

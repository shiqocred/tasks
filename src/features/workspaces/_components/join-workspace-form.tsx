"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInviteCode } from "@/features/join/hooks/use-invite-code";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { ArrowLeftIcon, HomeIcon, Loader, UsersIcon } from "lucide-react";
import { useJoin } from "@/features/api";

export const JoinWorkspaceForm = () => {
  const inviteCode = useInviteCode();

  const { mutate, isPending } = useJoin().accept({ inviteCode });
  const router = useRouter();
  const { data: initialValue, isLoading } = useJoin().info({ inviteCode });

  const onSubmit = async () => {
    mutate(
      {
        workspaceId: initialValue?.data?.id ?? "",
        code: inviteCode,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-128px-16px)] flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialValue) {
    throw new Error("Invalid invite code");
  }

  if (!initialValue?.status) {
    return (
      <div className="w-full lg:max-w-xl mx-auto">
        <Card className="h-full w-full border-none shadow-none">
          <CardContent className="p-7 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 justify-center">
              <p className="font-medium">
                You&apos;ve already joined this workspace.
              </p>
              <Separator />
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={() => router.push("/")}
              >
                <HomeIcon />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7 flex flex-col gap-4">
          <div className="flex justify-start">
            <Button
              asChild
              className="w-auto justify-start p-0 hover:[&_svg]:"
              variant="link"
              size="lg"
              disabled={isPending}
            >
              <Link href={"/"}>
                <ArrowLeftIcon />
                Cancel
              </Link>
            </Button>
          </div>
          <div className="w-full flex flex-col gap-4 justify-center items-center">
            <ProjectAvatar
              image={initialValue.data?.imageUrl}
              className="size-14 text-2xl rounded-lg"
              name={initialValue.data?.name}
            />
            <div className="flex flex-col gap-1 justify-center items-center">
              <p className=" text-gray-500">You&apos;ve been invited to join</p>
              <h3 className="font-semibold capitalize text-xl">
                {initialValue.data?.name} Workspace
              </h3>
            </div>
            <div className="flex gap-2 items-center">
              <UsersIcon className="size-4" />
              <p className="text-sm">
                {initialValue.data?.members.toLocaleString() +
                  " " +
                  (initialValue.data?.members && initialValue.data?.members > 1
                    ? "Members"
                    : "Member")}
              </p>
            </div>
          </div>
          <Separator />
          <div className="w-full flex justify-center">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              Join Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

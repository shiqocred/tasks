"use client";

import React, { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeft, Copy, ImageIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useOrigin } from "@/hooks/use-origin";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { updateWorkspaceSchema } from "@/lib/schemas";
import { useWorkspaces } from "@/features/api";

export const EditWorkspaceForm = ({ onCancel }: { onCancel?: () => void }) => {
  const workspaceId = useWorkspaceId();
  const origin = useOrigin();
  const router = useRouter();

  const { mutate, isPending } = useWorkspaces().patch({ workspaceId });
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useWorkspaces().delete({ workspaceId });
  const { mutate: resetInviteCode, isPending: isResetInviteCode } =
    useWorkspaces().resetInviteCode({ workspaceId });

  const { data: initialValue, isLoading } = useWorkspaces().show({
    workspaceId,
  });

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive"
  );
  const [ResetInviteCodeDialog, confrimResetInviteCode] = useConfirm(
    "Reset Invite Link",
    "This will invalidate the current invite link",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValue,
      image: initialValue?.imageUrl ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: initialValue?.name ?? "",
      image: initialValue?.imageUrl ?? "",
    });
  }, [form, initialValue]);

  const handleResetLink = async () => {
    const ok = await confrimResetInviteCode();

    if (!ok) return;

    resetInviteCode();
  };
  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(undefined, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  const handleSubmit = (value: z.infer<typeof updateWorkspaceSchema>) => {
    const formData = new FormData();

    formData.append("name", value.name ?? "");

    if (value.image instanceof File) {
      formData.append("image", value.image);
    }

    mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const fullInviteLink = `${origin}/join/${initialValue?.inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-128px-16px)] flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialValue) {
    throw new Error("Workspace not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={
              onCancel || (() => router.push(`/workspaces/${initialValue.$id}`))
            }
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValue.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending || isDeletingWorkspace}
                          {...field}
                          placeholder="Enter Workspace name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="image"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="logo"
                              className="object-cover"
                              fill
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px] rounded-md">
                            <AvatarFallback className="rounded-md">
                              <ImageIcon className="size-8 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">Workspace Icon</p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1mb
                          </p>
                          <Input
                            className="hidden"
                            ref={inputRef}
                            type="file"
                            accept=".jpg,.png,.svg,.jpeg"
                            disabled={isPending || isDeletingWorkspace}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                              className="h-6 px-2 text-xs w-fit bg-red-100 hover:bg-red-200/80 text-red-600 mt-2 rounded"
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => inputRef.current?.click()}
                              className="h-6 px-2 text-xs w-fit bg-blue-100 hover:bg-blue-200/80 text-blue-600 mt-2 rounded"
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
                <Separator className="my-7" />
                <div className="flex justify-end items-center">
                  <Button
                    type="submit"
                    size={"lg"}
                    disabled={isPending || isDeletingWorkspace}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Update Workspace
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace
            </p>
            <div className="mt-4">
              <div className="flex gap-2 items-center">
                <Input
                  disabled
                  value={fullInviteLink}
                  className="disabled:opacity-100"
                />
                <Button
                  className="flex-none"
                  variant={"outline"}
                  size={"icon"}
                  type="button"
                  onClick={handleCopyLink}
                >
                  <Copy className="size-5" />
                </Button>
              </div>
            </div>
            <Separator className="my-6" />
            <Button
              className="w-fit ml-auto"
              type="button"
              disabled={isPending || isResetInviteCode}
              variant={"destructive"}
              size={"sm"}
              onClick={handleResetLink}
            >
              Reset Link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace irrevisible and will remove all associated
              data.
            </p>
            <Separator className="my-6" />
            <Button
              className="mt-6 w-fit ml-auto"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              variant={"destructive"}
              size={"sm"}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
import { updateProjectSchema } from "../server/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeft, ImageIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProjectType } from "../server/types";
import { useUpdateProject } from "../api/use-update-project";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteeProject } from "../api/use-delete-project";
import { useProjectId } from "../hooks/use-project-id";
import { useGetProject } from "../api/use-get-project";

export const EditProjectForm = ({ onCancel }: { onCancel?: () => void }) => {
  const projectId = useProjectId();
  const { data: initialValue, isLoading } = useGetProject({ projectId });
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteeProject();
  const router = useRouter();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action cannot be undone",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialValue?.name ?? "",
      image: initialValue?.imageUrl ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: initialValue?.name ?? "",
      image: initialValue?.imageUrl ?? "",
    });
  }, [initialValue]);

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteProject(
      {
        param: { projectId: initialValue?.$id ?? "" },
      },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${initialValue?.workspaceId}`;
        },
      }
    );
  };

  const handleSubmit = (value: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...value,
      image: value.image instanceof File ? value.image : "",
    };
    mutate({
      form: finalValues,
      param: { projectId: initialValue?.$id ?? "" },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-128px-16px)] flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialValue) {
    throw new Error("Not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={
              onCancel ||
              (() =>
                router.push(
                  `/workspaces/${initialValue.workspaceId}/projects/${initialValue.$id}`
                ))
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending || isDeletingProject}
                          {...field}
                          placeholder="Enter Project name"
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
                          <p className="text-sm font-medium">Project Icon</p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1mb
                          </p>
                          <Input
                            className="hidden"
                            ref={inputRef}
                            type="file"
                            accept=".jpg,.png,.svg,.jpeg"
                            disabled={isPending || isDeletingProject}
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
                    disabled={isPending || isDeletingProject}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Update Project
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
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project irrevisible and will remove all associated
              data.
            </p>
            <Separator className="my-6" />
            <Button
              className="mt-6 w-fit ml-auto"
              type="button"
              disabled={isPending || isDeletingProject}
              variant={"destructive"}
              size={"sm"}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

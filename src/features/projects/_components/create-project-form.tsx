"use client";

import React, { useRef } from "react";
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
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../server/schemas";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const CreateProjectForm = ({ onCancel }: { onCancel?: () => void }) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateProject();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (value: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...value,
      image: value.image instanceof File ? value.image : "",
      workspaceId,
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };
  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
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
                        disabled={isPending}
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
                          disabled={isPending}
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
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  size={"lg"}
                  disabled={isPending}
                  variant="secondary"
                  onClick={onCancel}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={"lg"}
                  disabled={isPending}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

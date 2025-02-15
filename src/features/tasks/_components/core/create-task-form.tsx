"use client";

import React, { useEffect } from "react";
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
import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { Label } from "@/components/ui/label";
import { ChevronsUpDownIcon } from "lucide-react";
import { createTaskSchema, TaksStatus } from "@/lib/schemas";
import { useTasks } from "@/features/api";

export const CreateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialStatus,
  initialProject,
  initialAssigne,
}: {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  initialStatus: string;
  initialProject: string;
  initialAssigne: string;
}) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useTasks().create;

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId,
      name: "",
    },
  });

  useEffect(() => {
    if (initialStatus) {
      form.setValue("status", initialStatus as TaksStatus);
    }
    if (initialProject) {
      form.setValue("projectId", initialProject);
    }
    if (initialAssigne) {
      form.setValue("assigneId", initialAssigne);
    }
  }, [form, initialStatus, initialProject, initialAssigne]);

  const handleSubmit = (value: z.infer<typeof createTaskSchema>) => {
    mutate(
      { ...value, workspaceId },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  const projectInitial = projectOptions.find(
    (item) => item.id === initialProject
  );
  const assigneInitial = memberOptions.find(
    (item) => item.id === initialAssigne
  );

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
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
                    <FormLabel>Task Name</FormLabel>
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
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {assigneInitial && initialAssigne ? (
                <div className="space-y-2">
                  <Label>Assigne</Label>
                  <Button
                    variant={"outline"}
                    type="button"
                    disabled
                    className="disabled:opacity-100 disabled:pointer-events-auto disabled:hover:bg-transparent disabled:cursor-not-allowed w-full justify-between [&_svg]:size-3 font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <MemberAvatar
                        className={"size-6"}
                        name={assigneInitial.name}
                      />
                      {assigneInitial.name}
                    </div>
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="assigneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigne</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assigne" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {memberOptions.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              <div className="flex items-center gap-2">
                                <MemberAvatar
                                  className={"size-6"}
                                  name={item.name}
                                />
                                {item.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              {!initialStatus ? (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          <SelectItem value={TaksStatus.BACKLOG}>
                            <span className="border-l-[3px] h-full border-pink-400 pl-2">
                              Backlog
                            </span>
                          </SelectItem>
                          <SelectItem value={TaksStatus.IN_PROGRESS}>
                            <span className="border-l-[3px] h-full border-yellow-400 pl-2">
                              In Progress
                            </span>
                          </SelectItem>
                          <SelectItem value={TaksStatus.IN_REVIEW}>
                            <span className="border-l-[3px] h-full border-blue-400 pl-2">
                              In Review
                            </span>
                          </SelectItem>
                          <SelectItem value={TaksStatus.TODO}>
                            <span className="border-l-[3px] h-full border-red-400 pl-2">
                              Todo
                            </span>
                          </SelectItem>
                          <SelectItem value={TaksStatus.DONE}>
                            <span className="border-l-[3px] h-full border-emerald-400 pl-2">
                              Done
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Button
                    variant={"outline"}
                    type="button"
                    disabled
                    className="disabled:opacity-100 disabled:pointer-events-auto disabled:hover:bg-transparent disabled:cursor-not-allowed w-full justify-between [&_svg]:size-3 font-normal"
                  >
                    <span
                      className={cn(
                        "border-l-[3px] h-full pl-2",
                        initialStatus === TaksStatus.BACKLOG
                          ? "border-pink-400"
                          : initialStatus === TaksStatus.IN_PROGRESS
                          ? "border-yellow-400"
                          : initialStatus === TaksStatus.IN_REVIEW
                          ? "border-blue-400"
                          : initialStatus === TaksStatus.TODO
                          ? "border-red-400"
                          : initialStatus === TaksStatus.DONE
                          ? "border-emerald-400"
                          : "border-gray-300"
                      )}
                    >
                      {snakeCaseToTitleCase(initialStatus)}
                    </span>
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </div>
              )}
              {initialProject && projectInitial ? (
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Button
                    variant={"outline"}
                    disabled
                    type="button"
                    className="disabled:opacity-100 disabled:pointer-events-auto disabled:hover:bg-transparent disabled:cursor-not-allowed w-full justify-between [&_svg]:size-3 font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <ProjectAvatar
                        className={"size-6"}
                        name={projectInitial.name}
                        image={projectInitial.imageUrl}
                      />
                      {projectInitial.name}
                    </div>
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {projectOptions.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              <div className="flex items-center gap-2">
                                <ProjectAvatar
                                  className={"size-6"}
                                  name={item.name}
                                  image={item.imageUrl}
                                />
                                {item.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
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
                  Create Task
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

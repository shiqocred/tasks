"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TaskType } from "../../../server/types";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDown,
  MoreVertical,
} from "lucide-react";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { MemberAvatar } from "@/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskAction } from "./task-action";

export const columns: ColumnDef<TaskType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-transparent text-muted-foreground text-xs [&_svg]:size-3 shadow-none gap-1 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          {!column.getIsSorted() ? (
            <ChevronsUpDown className="size-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1 text-xs capitalize px-4">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-transparent text-muted-foreground text-xs [&_svg]:size-3 shadow-none gap-1 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          {!column.getIsSorted() ? (
            <ChevronsUpDown className="size-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div className="flex items-center gap-2 text-sm font-medium px-4">
          <ProjectAvatar
            className="size-6"
            name={project?.name ?? ""}
            image={project?.imageUrl}
          />
          <p className="line-clamp-1 text-xs capitalize">{project?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assigne",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-transparent text-muted-foreground text-xs [&_svg]:size-3 shadow-none gap-1 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assigne
          {!column.getIsSorted() ? (
            <ChevronsUpDown className="size-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const assigne = row.original.assigne;

      return (
        <div className="flex items-center gap-2 text-sm font-medium px-4">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assigne?.name ?? "?"}
          />
          <p className="line-clamp-1 text-xs capitalize">{assigne?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-transparent text-muted-foreground text-xs [&_svg]:size-3 shadow-none gap-1 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due date
          {!column.getIsSorted() ? (
            <ChevronsUpDown className="size-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return (
        <div className="px-4">
          <TaskDate className="text-xs" value={dueDate} />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-transparent text-muted-foreground text-xs [&_svg]:size-3 shadow-none gap-1 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {!column.getIsSorted() ? (
            <ChevronsUpDown className="size-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="px-4">
          <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;

      return (
        <TaskAction id={id} projectId={projectId}>
          <Button className="size-8 p-0" variant={"ghost"}>
            <MoreVertical />
          </Button>
        </TaskAction>
      );
    },
  },
];

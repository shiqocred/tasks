import React, { FormEvent } from "react";
import { TaskType } from "../../server/types";
import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUpdateTask } from "../../api/use-update-task";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export const TaskDescription = ({ task }: { task: TaskType }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(task.description ?? "");
  const { mutate, isPending } = useUpdateTask();

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      {
        param: { taskId: task.$id },
        json: { description: value },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Description</p>
        <Button
          className={cn(
            " text-black",
            isEditing
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-yellow-400 hover:bg-yellow-500"
          )}
          size="sm"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? <XIcon /> : <PencilIcon />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <Separator className="my-4 bg-gray-400" />
      <div className="flex flex-col gap-4">
        {isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              disabled={isPending}
              placeholder="Add a description"
            />
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-400/75 hover:bg-blue-400 text-black w-fit ml-auto"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        ) : (
          <div>
            {task.description ?? (
              <span className="text-muted-foreground">No description set.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

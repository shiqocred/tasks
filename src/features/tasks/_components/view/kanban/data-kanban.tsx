import React, { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";
import { TaksStatus, TaskType } from "@/lib/schemas";

const boards: TaksStatus[] = [
  TaksStatus.BACKLOG,
  TaksStatus.TODO,
  TaksStatus.IN_PROGRESS,
  TaksStatus.IN_REVIEW,
  TaksStatus.DONE,
];

type TaskState = {
  [key in TaksStatus]: TaskType[];
};

export const DataKanban = ({
  data,
  onchange,
}: {
  data: TaskType[];
  onchange: (
    tasks: { $id: string; status: TaksStatus; position: number }[]
  ) => void;
}) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaksStatus.BACKLOG]: [],
      [TaksStatus.TODO]: [],
      [TaksStatus.IN_PROGRESS]: [],
      [TaksStatus.IN_REVIEW]: [],
      [TaksStatus.DONE]: [],
    };

    data.forEach((item) => {
      initialTasks[item.status].push(item);
    });

    Object.keys(initialTasks).forEach((item) => {
      initialTasks[item as TaksStatus].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaksStatus;
      const destStatus = destination.droppableId as TaksStatus;

      let updatesPayload: {
        $id: string;
        status: TaksStatus;
        position: number;
      }[] = [];

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        // safely remove the task from the source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        if (!movedTask) {
          console.error("No task found at the source index");
          return prevTasks;
        }

        const updatedMovedTask =
          sourceStatus !== destStatus
            ? { ...movedTask, status: destStatus }
            : movedTask;

        newTasks[sourceStatus] = sourceColumn;

        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destStatus] = destColumn;

        updatesPayload = [];

        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        newTasks[destStatus].forEach((item, index) => {
          if (item && item.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (item.position !== newPosition) {
              updatesPayload.push({
                $id: item.$id,
                status: destStatus,
                position: newPosition,
              });
            }
          }
        });

        if (sourceStatus !== destStatus) {
          newTasks[sourceStatus].forEach((item, index) => {
            if (item) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);
              if (item.position !== newPosition) {
                updatesPayload.push({
                  $id: item.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onchange(updatesPayload);
    },
    [onchange]
  );

  useEffect(() => {
    const newTasks: TaskState = {
      [TaksStatus.BACKLOG]: [],
      [TaksStatus.TODO]: [],
      [TaksStatus.IN_PROGRESS]: [],
      [TaksStatus.IN_REVIEW]: [],
      [TaksStatus.DONE]: [],
    };

    data.forEach((item) => {
      newTasks[item.status].push(item);
    });

    Object.keys(newTasks).forEach((item) => {
      newTasks[item as TaksStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto gap-4">
        {boards.map((item) => {
          return (
            <div
              key={item}
              className="flex-1 bg-gray-100 p-1.5 rounded-md min-w-[200px] space-y-1.5"
            >
              <KanbanColumnHeader board={item} taskCount={tasks[item].length} />
              <Droppable droppableId={item}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {tasks[item].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

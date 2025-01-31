import { AnalyticsCard } from "@/components/analytics-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const AnalyticsWorkspace = ({
  data,
}: {
  data?: {
    projectCount: number;
    projectDifference: number;
    taskCount: number;
    taskDifference: number;
    taskAssignedCount: number;
    taskAssignedDifference: number;
    taskIncompleteCount: number;
    taskIncompleteDifference: number;
    taskCompletedCount: number;
    taskCompletedDifference: number;
    taskOverdueCount: number;
    taskOverdueDifference: number;
  };
}) => {
  if (!data) {
    return null;
  }
  return (
    <ScrollArea className="flex w-full border border-gray-300 rounded-lg whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex-1 flex items-center">
          <AnalyticsCard
            title="Total Project"
            value={data.projectCount}
            variant={data.projectDifference > 0 ? "up" : "down"}
            increaseValue={data.projectDifference}
          />
          <Separator orientation="vertical" className="bg-gray-300" />
        </div>
        <div className="flex-1 flex items-center">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
          <Separator orientation="vertical" className="bg-gray-300" />
        </div>
        <div className="flex-1 flex items-center">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.taskAssignedCount}
            variant={data.taskAssignedDifference > 0 ? "up" : "down"}
            increaseValue={data.taskAssignedDifference}
          />
          <Separator orientation="vertical" className="bg-gray-300" />
        </div>
        <div className="flex-1 flex items-center">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.taskCompletedCount}
            variant={data.taskCompletedDifference > 0 ? "up" : "down"}
            increaseValue={data.taskCompletedDifference}
          />
          <Separator orientation="vertical" className="bg-gray-300" />
        </div>
        <div className="flex-1 flex items-center">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.taskOverdueCount}
            variant={data.taskOverdueDifference > 0 ? "up" : "down"}
            increaseValue={data.taskOverdueDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
};

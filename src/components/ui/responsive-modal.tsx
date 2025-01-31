import React from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogHeader } from "./dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";
import { DialogTitle } from "@radix-ui/react-dialog";

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto  hide-scrollbar max-w-[85vh]">
          <DialogHeader className={"hidden"}>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto  hide-scrollbar max-w-[85vh]">
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
          </DrawerHeader>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

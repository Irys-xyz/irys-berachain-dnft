import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React from "react";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

const ReusableDialog = (props: Props) => {
  return (
    <Dialog>
      {/* <DialogTrigger>{props.trigger}</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogDescription>{props.children}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableDialog;

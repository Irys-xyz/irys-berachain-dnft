import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import clsx from "clsx";
import BeeIcon from "@/components/svg/bee-icon";
import RefreshIcon from "@/components/svg/refresh-icon";
import { Button } from "@/components/ui/button";

import { ERROR_UPDATE_METADATA_24H } from "@/utils/constants";

/**
 * Dialog that shows an error message from updateMetadataMutation.
 *
 * @remarks
 * It will be rendered when updateMetadataMutation.error is truthy.
 * It will render a RefreshIcon if the error message is ERROR_UPDATE_METADATA_24H,
 * otherwise it will render a BeeIcon.
 * It will reset the mutation when the dialog is closed.
 *
 * @param {Object} props - Props of the component.
 * @param {Object} props.updateMetadataMutation - The mutation that can have an error.
 * @returns {React.ReactElement} - The element rendered by the component.
 */
const ErrorDialog = ({
  updateMetadataMutation,
}: {
  updateMetadataMutation: any;
}): React.ReactElement => (
  <Dialog
    open={!!updateMetadataMutation?.error}
    onOpenChange={() => updateMetadataMutation.reset()}
  >
    <DialogContent className="bg-[#111111CC] border-none !max-w-[318px] backdrop-blur-md px-11 py-12">
      <DialogHeader className="">
        <DialogDescription className="flex items-center justify-center flex-col">
          <div
            className={clsx(
              "grid place-items-center rounded-full",
              updateMetadataMutation.error?.message ===
                ERROR_UPDATE_METADATA_24H
                ? "bg-[#3E91DD] size-14 p-3"
                : "bg-[#451D07] size-14 p-2"
            )}
          >
            {updateMetadataMutation.error?.message ===
            ERROR_UPDATE_METADATA_24H ? (
              <RefreshIcon />
            ) : (
              <BeeIcon className="" />
            )}
          </div>
          <p className="text-white font-bold tracking-tight text-lg text-center mt-5 mb-5">
            {updateMetadataMutation.error?.message}
          </p>
        </DialogDescription>
        <DialogClose>
          <Button>OKAY</Button>
        </DialogClose>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

export default ErrorDialog;

import { XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  buttonText?: string;
  handleClose?: () => void;
  handleClick?: () => void;
  children: React.ReactNode;
  showClose?: boolean;
}

const GenericModal = ({
  isOpen,
  title,
  handleClose,
  subTitle,
  description,
  children,
  showClose = false,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-0 font-[family-name:var(--font-dm)]"
      >
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {showClose && (
          <div
            className="absolute top-5 right-5 flex justify-center items-center h-[20px] w-[20px] bg-[#0284B21A] rounded-full cursor-pointer"
            onClick={handleClose}
          >
            <XIcon className="w-[15px] h-[15px]" color="#0284B2" />
          </div>
        )}

        <div className="px-6 justify-center flex flex-col items-center font-[family-name:var(--font-dm)]">
          {subTitle && (
            <h4 className=" pt-4 text-primary-gray font-semibold text-[24px]">
              {subTitle}
            </h4>
          )}
          {description && (
            <p className="pb-4 font-[family-name:var(--font-poppins)] text-[16px] text-primary-gray font-medium mt-4">
              {description}
            </p>
          )}
        </div>

        <div className="flex gap-3 px-6 justify-center flex flex-col items-center mb-10">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenericModal;

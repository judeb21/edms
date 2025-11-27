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
}

const GenericModal = ({
  isOpen,
  title,
  handleClose,
  subTitle,
  description,
  children,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="max-w-lg p-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 justify-center flex flex-col items-center font-[family-name:var(--font-dm)]">
          <h4 className="text-primary-gray font-semibold text-[24px]">
            {subTitle}
          </h4>

          <p className="font-[family-name:var(--font-poppins)] text-[16px] text-primary-gray font-medium mt-4">
            {description}
          </p>
        </div>

        <div className="flex gap-3 px-6 justify-center flex flex-col items-center mb-10">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenericModal;

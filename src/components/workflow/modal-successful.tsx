import { CircleCheckBig } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  buttonText?: string;
  buttonAdditionalText?: string;
  handleClose?: () => void;
  handleClick?: () => void;
  handleAdditionalClick?: () => void;
  variant?: string;
  buttonClass?: string;
  showAdditionalButton?: boolean;
}

const SuccessModal = ({
  isOpen,
  title,
  handleClose,
  subTitle,
  description,
  buttonText,
  handleClick,
  handleAdditionalClick,
  buttonClass,
  showAdditionalButton = false,
  buttonAdditionalText,
}: SuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="max-w-lg p-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 justify-center flex flex-col items-center font-[family-name:var(--font-dm)]">
          <CircleCheckBig
            className="w-[60px] h-[60px] mx-auto"
            color="#0284B2"
            strokeWidth={1}
          />

          <h4 className="text-primary-gray font-semibold text-[24px]">
            {subTitle}
          </h4>

          <p className="font-[family-name:var(--font-poppins)] text-[16px] text-primary-gray font-medium mt-4">
            {description}
          </p>
        </div>

        <div className="flex gap-3 px-6 py-4 justify-center flex items-center mb-10">
          {showAdditionalButton && (
            <Button
              className={cn(
                "bg-[#FC5A5A] hover:bg-[#FC5A5A] text-[14px] font-medium h-[50px]",
                buttonClass
              )}
              onClick={handleAdditionalClick}
            >
              {buttonAdditionalText}
            </Button>
          )}
          <Button
            className={cn(
              "bg-brand-blue text-[14px] font-medium hover:bg-brand-blue h-[50px]",
              buttonClass
            )}
            onClick={handleClick}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface ButtonProps {
  isLoading: boolean;
  buttonText: string;
  className?: string;
  disabled?: boolean;
  nextStep?: () => void;
  variant?: string;
}

const LoaderButton = ({
  isLoading,
  buttonText,
  className,
  nextStep,
  disabled,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      className={`cursor-pointer text-center rounded-[8px] ${className}`}
      disabled={disabled || isLoading}
      onClick={nextStep}
    >
      {isLoading && (
        <>
          <Loader2 className="mr-1 animate-spin" />
        </>
      )}
      {buttonText}
    </Button>
  );
};

export default LoaderButton;

"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authOTPSchema } from "@/validationSchemas/auth/otpSchema";
import Image from "next/image";

export default function VerifyAuthOTP({
  isSuccess,
  emitPinValue,
  isLoading,
}: {
  isSuccess: boolean;
  emitPinValue: (payload: string) => void;
  isLoading: boolean;
}) {
  const PinForm = useForm<z.infer<typeof authOTPSchema>>({
    resolver: zodResolver(authOTPSchema),
    defaultValues: { pin: ["", "", "", "", "", ""] },
  });
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [readOnly, setReadOnly] = useState([
    false,
    true,
    true,
    true,
    true,
    true,
  ]);

  const onSubmitOTP = async (values: Array<string>) => {
    emitPinValue(values.join(""));
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    const lastIndex = updatedOtp.length - 1;

    if (value) {
      if (lastIndex != index) {
        setReadOnly((prev) => {
          const updatedReadOnly = [...prev];
          updatedReadOnly[index] = true;
          updatedReadOnly[index + 1] = false;
          return updatedReadOnly;
        });
      }

      if (updatedOtp.every((value) => value !== "")) {
        onSubmitOTP(updatedOtp);
      }

      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const currentValue = otp[index];

    if (e.key === "Backspace" && !currentValue && index > 0) {
      inputRefs.current[index - 1]?.focus();

      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.setSelectionRange(
          prevInput.value.length,
          prevInput.value.length
        );
      }

      setReadOnly((prev) => {
        const updatedReadOnly = [...prev];

        updatedReadOnly[index - 1] = false;

        updatedReadOnly[index] = true;

        return updatedReadOnly;
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData
      .getData("text/plain")
      .slice(0, otp.length)
      .split("");

    if (!pastedText.join("").match(/^\d+$/)) {
      return "";
    }
    setOtp((prev) => {
      let updatedOtp = [...prev];
      updatedOtp = [...pastedText];
      return updatedOtp;
    });

    if (pastedText.every((value) => value !== "")) {
      onSubmitOTP(pastedText);
    }

    pastedText.forEach((_, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]?.focus();
        setReadOnly((prev) => {
          const updatedReadOnly = [...prev];

          updatedReadOnly[idx] = false;

          return updatedReadOnly;
        });
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      PinForm.reset();
      setOtp(["", "", "", "", "", ""]);
      setReadOnly([false, true, true, true, true, true]);
    }
  }, [isSuccess, PinForm]);

  return (
    <div className="w-[inherit] flex flex-col justify-center items-center my-[30px]">
      <form className="w-[100%]">
        <div className="w-[inherit] flex gap-2 md:gap-4 justify-center">
          {otp.map((_, index) => (
            <Input
              key={index}
              onChange={(e) => {
                if (!/^\d*$/.test(e.target.value)) return;
                handleInputChange(index, e.target.value);
              }}
              onPaste={(e) => handlePaste(e)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              className={`${
                readOnly[index] ? "pointer-events-none" : ""
              }  cursor-default bg-[#F7F7F8] focus-visible:ring-[1px] border p-2 !rounded-[12px] h-[45px] w-[45px] text-[16px] sm:text-[20px] md:h-[74px] md:w-[74px] md:text-[40px] text-themeGreen focus-visible:bg-[#F0FDFB] focus-visible:ring-themeGreen text-center focus-visible:ring-offset-0 font-[family-name:var(--font-satoshi)]`}
              disabled={isLoading}
              readOnly={readOnly[index]}
              onKeyDown={(e) => handleKeyDown(e, index)}
              value={otp[index]}
            />
          ))}
        </div>
      </form>

      {isLoading && (
        <div className="w-[40px] h-[40px] mx-auto mt-[10px]">
          <Image
            src="/assets/green-loader.svg"
            height={40}
            width={40}
            alt="button loader"
            className="mr-1 animate-spin"
          />
        </div>
      )}
    </div>
  );
}

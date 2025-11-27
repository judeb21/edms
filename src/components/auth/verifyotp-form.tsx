"use client";

import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, LoginValidation } from "@/validationSchemas/auth/loginSchema";
import { useRouter } from "next/navigation";
import { ExtendedFetchBaseQueryError } from "@/types";
import { Button } from "../ui/button";
import { useLoader } from "@/context/loader-context";
import VerifyAuthOTP from "./otpPin";

export default function VerifyOTPForm() {
  const form = LoginValidation();
  const { buttonLoader } = useLoader();

  const router = useRouter();

  const initialCountdown = 60; // Initial resend code timer
  const [countdown, setCountdown] = useState(initialCountdown);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccessful] = useState(false);
  const [pin, setPin] = useState("");

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  useEffect(() => {
    let timer: number;

    if (isRunning) {
      timer = window.setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [countdown, isRunning]);

  const handleResendOTP = async () => {
    setCountdown(60);
    setIsRunning(!isRunning);
  };

  const getAndAssignPinValues = (pin: string) => {
    setPin(pin);
  };

  const handleOTPSubmission = async () => {
    console.log("PIN", pin);

    router.push("/reset-password");
  };

  return (
    <div>
      <div className="mb-[50px] relative w-full">
        <Image
          src="/logo-text.svg"
          alt="credlanche logo"
          height={55}
          width={180}
          className="mx-auto"
        />
      </div>

      <div className="relative font-[family-name:var(--font-dm)] w-full">
        <h3 className="text-brand-blue text-[30px] font-[700] text-center w-[70%] mx-auto">
          Enter the 6-digit verification code sent to your email address
        </h3>

        <div className="mb-[20px] mx-auto max-w-[100%]">
          <VerifyAuthOTP
            isSuccess={isSuccess}
            emitPinValue={getAndAssignPinValues}
            isLoading={false}
          />

          <Button
            className="w-full bg-brand-blue hover:bg-brand-blue text-center h-[50px] mt-[20px] font-[family-name:var(--font-dm)] cursor-pointer"
            disabled={buttonLoader}
            onClick={handleOTPSubmission}
          >
            {buttonLoader && <Loader2 className="animate-spin" />}
            Verify Code
          </Button>

          <h4 className="text-center text-[18px] text-[#464646] mt-[20px]">
            Didn&apos;t get the code?{" "}
            {isRunning && (
              <span className="text-[#F08B10]">
                Resend code in {String(minutes).padStart(2, "0")}:{" "}
                {seconds < 10 ? "0" : ""}
                {seconds} {minutes < 1 ? "secs" : "min"}
              </span>
            )}
            {!isRunning && (
              <span
                className="text-brand-blue cursor-pointer"
                onClick={handleResendOTP}
              >
                Resend code
              </span>
            )}
          </h4>
        </div>
      </div>
    </div>
  );
}

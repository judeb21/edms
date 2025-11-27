"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const OTPValidation = () =>
  useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  export const authOTPSchema = z.object({
    pin: z
      .array(z.string().length(1).or(z.literal("")))
      .length(6, "OTP must be exactly 6 digits"),
  });

export const TransactionPinSchema = z.object({
  pin: z
    .array(z.string().length(1).or(z.literal("")))
    .length(4, "PIN must be exactly 4 digits"),
});

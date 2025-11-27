"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "Enter Password.",
    }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Password does not match",
      path: ["confirmPassword"],
    }
  );

export const ResetPasswordValidation = () =>
  useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Enter Password.",
  }),
});

export const LoginValidation = () =>
  useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

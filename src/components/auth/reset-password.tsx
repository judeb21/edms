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
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  resetPasswordSchema,
  ResetPasswordValidation,
} from "@/validationSchemas/auth/resetPasswordSchema";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useLoader } from "@/context/loader-context";

export default function ResetPasswordForm() {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const form = ResetPasswordValidation();
  const { buttonLoader } = useLoader();

  const togglePasswordVisibility = () => {
    if (passwordType === "password") return setPasswordType("text");
    return setPasswordType("password");
  };

  const toggleConfirmPasswordVisibility = () => {
    if (confirmPasswordType === "password")
      return setConfirmPasswordType("text");
    return setConfirmPasswordType("password");
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    console.log("Values", values);
    setTimeout(() => {
      router.push("/reset-password-successful");
    }, 150);
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
        <h3 className="text-brand-blue text-[30px] font-[700] text-center">
          Enter new password
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mt-[48px] text-left"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="font-[family-name:var(--font-satoshi-medium)] mb-[20px]">
                  <FormLabel className="text-[16px]">New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your new password"
                        className="h-[48px]"
                        type={passwordType}
                        {...field}
                      />
                      {passwordType === "password" ? (
                        <Eye
                          size={20}
                          className="absolute right-[15px] top-[30%] cursor-pointer"
                          onClick={() => togglePasswordVisibility()}
                        />
                      ) : (
                        <EyeOff
                          size={20}
                          className="absolute right-[15px] top-[30%] cursor-pointer"
                          onClick={() => togglePasswordVisibility()}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="font-[family-name:var(--font-satoshi-medium)] mb-[20px]">
                  <FormLabel className="text-[16px]">
                    Confirm new password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm new password"
                        className="h-[48px]"
                        type={confirmPasswordType}
                        {...field}
                      />
                      {confirmPasswordType === "password" ? (
                        <Eye
                          size={20}
                          className="absolute right-[15px] top-[30%] cursor-pointer"
                          onClick={() => toggleConfirmPasswordVisibility()}
                        />
                      ) : (
                        <EyeOff
                          size={20}
                          className="absolute right-[15px] top-[30%] cursor-pointer"
                          onClick={() => toggleConfirmPasswordVisibility()}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-brand-blue hover:bg-brand-blue text-center h-[50px] mt-[20px] font-[family-name:var(--font-dm)] cursor-pointer"
              type="submit"
              disabled={buttonLoader}
            >
              {buttonLoader && <Loader2 className="animate-spin" />}
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

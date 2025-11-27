"use client";

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
import { Button } from "../ui/button";
import { useLoader } from "@/context/loader-context";
import { Loader2 } from "lucide-react";
import {
  forgotPasswordSchema,
  ForgotPasswordValidation,
} from "@/validationSchemas/auth/forgotPasswordSchema";
import { useRouter } from "next/navigation";

export default function ForgotPassswordEmail({}) {
  const { buttonLoader } = useLoader();
  const form = ForgotPasswordValidation();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    console.log(values);

    router.push("/verify-otp");
  };

  const backToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <h3 className="text-brand-blue text-[30px] font-[700] text-center">
        Enter your valid email address
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full mt-[48px] text-left"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="font-[family-name:var(--font-satoshi-medium)] mb-[20px]">
                <FormLabel className="text-[16px]">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address"
                    className="h-[48px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full bg-brand-blue hover:bg-brand-blue text-center h-[50px] mt-[20px] font-[family-name:var(--font-dm)] cursor-pointer"
            disabled={buttonLoader}
          >
            {buttonLoader && <Loader2 className="animate-spin" />}
            Continue
          </Button>

          <Button
            variant="ghost"
            type="button"
            className="w-full rounded-md text-center h-[50px] mt-[30px] font-[family-name:var(--font-dm)] hover:bg-white"
            onClick={backToLogin}
          >
            Back to Login
          </Button>
        </form>
      </Form>
    </>
  );
}

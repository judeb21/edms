"use client";

import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import Link from "next/link";
import { loginSchema, LoginValidation } from "@/validationSchemas/auth/loginSchema";
import { useRouter } from "next/navigation";
import { ExtendedFetchBaseQueryError } from "@/types";
import { Button } from "../ui/button";
import { useUser } from "@/context/auth-context";

export default function LoginForm() {
  const [passwordType, setPasswordType] = useState("password");
  const { setUser } = useUser();
  const form = LoginValidation();
  const [buttonLoader, setButtonLoader] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    if (passwordType === "password") return setPasswordType("text");
    return setPasswordType("password");
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    setButtonLoader(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setButtonLoader(false);
        router.push("/overview");
      } else {
        setButtonLoader(false);
        toast.error("Invalid credentials", {
          unstyled: true,
          position: "top-right",
          classNames: {
            toast:
              "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
            title: "text-[#E71D36]",
          },
        });
      }
    } catch (error) {
      console.log("Error", error);
      setButtonLoader(false);
      const requestError = error as ExtendedFetchBaseQueryError;
      toast.error(requestError?.data?.message, {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
          title: "text-[#E71D36]",
        },
      });
    }
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
          Login into your account
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
                <FormItem className="font-[family-name:var(--font-dm)] mb-[24px]">
                  <FormControl>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-[15px] top-[30%] cursor-pointer text-[#A9A9A9]"
                      />
                      <Input
                        placeholder="Enter your email address"
                        className="pl-[42px] font-[500] text-[#A9A9A9] h-[56px] rounded-[4px] border-[1px] border-[#D3D3D3] focus-visible:ring-[1px] placeholder:text-[#A9A9A9] focus-visible:ring-brand-blue"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="font-[family-name:var(--font-dm)]">
                  <FormControl>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-[15px] top-[30%] cursor-pointer text-[#A9A9A9]"
                      />
                      <Input
                        placeholder="Enter your password"
                        className="h-[56px] font-[500] pl-[42px] text-[#A9A9A9] rounded-[4px] border-[1px] border-[#D3D3D3] focus-visible:ring-[1px] placeholder:text-[#A9A9A9] focus-visible:ring-[#0284B2]"
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

            <div className="my-[16px] text-right">
              <Link
                href="/forgot-password"
                className="text-[#464646] cursor-pointer font-[family-name:var(--font-dm)] text-[14px] text-right"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full bg-brand-blue hover:bg-brand-blue text-center h-[50px] mt-[20px] font-[family-name:var(--font-dm)] cursor-pointer"
              type="submit"
              disabled={buttonLoader}
            >
              {buttonLoader && <Loader2 className="animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

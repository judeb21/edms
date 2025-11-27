"use client";

import { ReactNode } from "react";
import AuthBrand from "./auth-brand";

interface AuthLayoutProps {
  children: ReactNode;
  authTitle?: string;
  authDescription?: string;
  authsubTitle?: string;
}

export default function AuthLayout({
  children,
  authTitle,
  authDescription,
  authsubTitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-dm)] p-4">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl w-full">
        <AuthBrand
          authTitle={authTitle}
          authDescription={authDescription}
          authsubTitle={authsubTitle}
        />

        <div className="flex-1 w-full overflow-hidden flex-1">
          <div className="rounded-[24px] border-5 border-brand-blue pt-[100px] pb-[50px] px-[44px] shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

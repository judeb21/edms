"use client";

import Image from "next/image";

interface AuthBrandProps {
  authTitle?: string;
  authDescription?: string;
  authsubTitle?: string;
}

export default function AuthBrand({
  authTitle = "Welcome Back!",
  authDescription = "Log in to manage users, settings, and data with admin privileges.",
}: AuthBrandProps) {
  return (
    <div className="order-2 lg:order-1 justify-center flex-col items-center hidden lg:block">
      <div className="">
        <Image
          src="/assets/illustrations/auth/login.svg"
          alt="login screen"
          width={500}
          height={550}
          className="mx-auto mb-6 max-w-md"
        />

        <div className="font-[family-name:var(--font-dm)] text-center w-[80%] mx-auto">
          <h4 className="font-[family-name:var(--font-dm)] text-center text-[#0284B2] text-[30px] font-[700] mb-[13px]">
            {authTitle}
          </h4>
          {authDescription && (
            <p className="font-[family-name:var(--font-dm)] text-[18px] text-[#0284B2]">
              {authDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

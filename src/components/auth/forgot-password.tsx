"use client";

import Image from "next/image";
import ForgotPassswordEmail from "./email-forgot-password";

export default function ForgotPassword() {
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
        <ForgotPassswordEmail />
      </div>
    </div>
  );
}

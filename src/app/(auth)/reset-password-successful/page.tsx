"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResetPasswordSuccessful() {
  const router = useRouter();
  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 min-h-screen bg-white max-h-[100vh] gap-4 font-[family-name:var(--font-dm)] px-[1rem] md:px-[2rem]">
      <div className="bg-white max-h-full h-full translate-y-[150px]">
        <div className="md:flex flex-col justify-center items-center">
          <Image
            src="/assets/illustrations/auth/success-reset.svg"
            alt="reset password screen"
            width={300}
            height={300}
            className=" mx-auto"
          />
        </div>
        <div className="font-[family-name:var(--font-dm)] text-center">
          <h4 className="font-[family-name:var(--font-dm)] text-center text-[#464646] text-[30px] font-[700] mb-[13px]">
            Password Reset Successful
          </h4>
          <p className="w-[320px] mx-auto font-[family-name:var(--font-dm)] text-[18px] text-[#464646]">
            You have successfully reset your password. You can now login with
            your new password
          </p>

          <Button
            onClick={goToLogin}
            className="cursor-pointer w-[80%] md:w-[400px] bg-brand-blue hover:bg-brand-blue text-center h-[50px] mt-[15px] rounded-[4px]"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

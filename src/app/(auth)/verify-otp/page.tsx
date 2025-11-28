import AuthLayout from "@/components/auth/auth-layout";
import VerifyOTPForm from "@/components/auth/verifyotp-form";
import { AUTH_CONTENT } from "@/constant/auth";

export default function VerifyOTPPage() {
  return (
    <AuthLayout
      authTitle={AUTH_CONTENT.FORGOT_PASSWORD.title}
      authDescription={AUTH_CONTENT.FORGOT_PASSWORD.subtitle}
    >
      <VerifyOTPForm />
    </AuthLayout>
  );
}

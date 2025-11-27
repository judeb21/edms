import AuthLayout from "@/components/auth/auth-layout";
import ForgotPassword from "@/components/auth/forgot-password";
import { AUTH_CONTENT } from "@/constant/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      authTitle={AUTH_CONTENT.FORGOT_PASSWORD.title}
      authDescription={AUTH_CONTENT.FORGOT_PASSWORD.subtitle}
    >
      <ForgotPassword />
    </AuthLayout>
  );
}

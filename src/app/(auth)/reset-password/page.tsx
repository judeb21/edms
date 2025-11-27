import AuthLayout from "@/components/auth/auth-layout";
import ResetPasswordForm from "@/components/auth/reset-password";
import { AUTH_CONTENT } from "@/constant/auth";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      authTitle={AUTH_CONTENT.RESET_PASSWORD.title}
      authDescription={AUTH_CONTENT.RESET_PASSWORD.subtitle}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}

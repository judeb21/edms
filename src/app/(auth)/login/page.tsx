import AuthLayout from "@/components/auth/auth-layout";
import LoginForm from "@/components/auth/login-form";
import { AUTH_CONTENT } from "@/constant/auth";

export default function LoginPage() {
  return (
    <AuthLayout
      authTitle={AUTH_CONTENT.LOGIN.title}
      authDescription={AUTH_CONTENT.LOGIN.subtitle}
    >
      <LoginForm />
    </AuthLayout>
  );
}

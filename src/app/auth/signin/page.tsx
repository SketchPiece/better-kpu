import AuthLayout from "@/components/auth/auth-layout";
import EmailCodeSignIn from "./email-code-signin";

export default function SignIn() {
  return (
    <AuthLayout>
      <EmailCodeSignIn />
    </AuthLayout>
  );
}

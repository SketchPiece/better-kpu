import { Resend } from "resend";
import EmailProvider from "next-auth/providers/email";
import KpuVerifyIdentityEmail from "emails/kpu-verify-identity";

interface ResendProviderOptions {
  apiKey: string;
  from: string;
}

function generateAuthCode() {
  const code = Math.floor(100000 + Math.random() * 900000); // random 6-digit code
  return code.toString();
}

export function ResendCodeProvider({ apiKey, from }: ResendProviderOptions) {
  const resend = new Resend(apiKey);
  return EmailProvider({
    from,
    maxAge: 5 * 60,
    generateVerificationToken: async () => {
      return generateAuthCode();
    },
    async sendVerificationRequest({
      identifier: email,
      token,
      provider: { from },
    }) {
      await resend.emails.send({
        from,
        to: email,
        subject: "Verify your email",
        react: <KpuVerifyIdentityEmail validationCode={token} />,
      });
    },
  });
}

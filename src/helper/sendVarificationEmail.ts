import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VarificatoinEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mistry message verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: false, message: "Failed to send verification email" };
  } catch (emailError) {
    console.log("Email verification failed", emailError);

    return { success: false, message: "Failed to send verification email" };
  }
}

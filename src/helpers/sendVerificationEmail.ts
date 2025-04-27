import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>{
    
    try {
        await resend.emails.send({
            from:  'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message verification code',
            react: VerificationEmail({username , otp: verifyCode}),
          });
        return {success: true, message: "Verificaion email send successfully"}
    } catch (Emailerror) {
        console.error("Error while sending the email", Emailerror)
        return {success: false, message: "failed to send verification code"}
    }
}


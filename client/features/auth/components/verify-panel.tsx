"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  RefreshCcw, 
  ShieldCheck, 
  TicketPercent, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Shield,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resendOtp, verifyOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { validateOtp } from "@/lib/validation/otp";

type VerifyPanelProps = {
  userId: string;
};

export function VerifyPanel({ userId }: VerifyPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [isVerifying, startVerifyTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  const otpError = code ? validateOtp(code) : null;

  const intent = searchParams?.get("intent");

  function handleVerify() {
    if (otpError) {
      toast.error(otpError);
      return;
    }

    startVerifyTransition(async () => {
      try {
        const result = await verifyOtp(userId, code.toUpperCase());
        toast.success("Verification complete.");

        if (result.requiresPasswordSetup || intent === "reset") {
          router.push(`/auth/password-setup/${userId}`);
          return;
        }

        toast.info("Password already exists. Please sign in.");
        router.push("/auth/login");
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Unable to verify code.";
        toast.error(message);
      }
    });
  }

  function handleResend() {
    startResendTransition(async () => {
      try {
        await resendOtp(userId);
        toast.success("A new verification code has been sent.");
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Unable to resend code.";
        toast.error(message);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--color-blue)]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--color-green)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--color-yellow)]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Main Verification Card */}
        <Card variant="glass" className="relative overflow-hidden backdrop-blur-xl animate-slide-in-up">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] opacity-20 rounded-[var(--radius-xl)]" />
          
          <CardHeader className="relative z-10 text-center space-y-6 pb-8">
            {/* Back Button */}
            <div className="absolute top-4 left-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            </div>

            {/* Logo/Icon Section */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-green)] to-[var(--color-blue)] rounded-2xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-green)] to-[var(--color-blue)] rounded-2xl animate-ping" />
              <div className="relative w-full h-full bg-gradient-to-br from-[var(--color-green)] to-[var(--color-blue)] rounded-2xl flex items-center justify-center">
                <TicketPercent className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <CardTitle size="lg" className="bg-gradient-to-r from-[var(--color-green)] via-[var(--color-blue)] to-[var(--color-yellow)] bg-clip-text text-transparent">
                Email Verification
              </CardTitle>
              <CardDescription className="text-[var(--foreground-secondary)]">
                Enter the 6-character code sent to your email
              </CardDescription>
            </div>

            {/* Feature Pills */}
            <div className="flex justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-blue)]/10 text-[var(--color-blue)] rounded-full text-xs font-medium">
                <Timer className="w-3 h-3" />
                5 Minutes
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-green)]/10 text-[var(--color-green)] rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Secure
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-yellow)]/10 text-[var(--color-yellow)] rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Auto-Format
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Code Input */}
            <div className="space-y-4">
              <Input
                label="Verification Code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="AB1234"
                maxLength={6}
                error={otpError}
              />

              {/* Code Format Info */}
              <div className="flex items-center gap-3 p-3 bg-[var(--color-blue)]/5 border border-[var(--color-blue)]/20 rounded-[var(--radius-lg)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-blue)] flex-shrink-0" />
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  The code contains 4 digits and 2 uppercase letters. It expires in 5 minutes.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-3">
                <Button 
                  onClick={handleVerify} 
                  busy={isVerifying}
                  variant="primary"
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {isVerifying ? 'Verifying...' : 'Verify Code'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)]" />
                </Button>

                <Button 
                  variant="secondary" 
                  onClick={handleResend} 
                  busy={isResending}
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isResending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="w-4 h-4" />
                    )}
                    {isResending ? 'Sending...' : 'Resend Code'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-blue)]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)]" />
                </Button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--surface)] px-2 text-[var(--foreground-tertiary)]">Security Notice</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Security Info Cards */}
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-[var(--color-green)]/5 border border-[var(--color-green)]/20 rounded-[var(--radius-lg)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-green)] mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-[var(--foreground)] font-medium mb-1">Secure Verification</p>
                    <p className="text-[var(--foreground-tertiary)]">Your verification code is encrypted and only valid for 5 minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-[var(--color-yellow)]/5 border border-[var(--color-yellow)]/20 rounded-[var(--radius-lg)]">
                  <AlertCircle className="w-4 h-4 text-[var(--color-yellow)] mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-[var(--foreground)] font-medium mb-1">Check Your Email</p>
                    <p className="text-[var(--foreground-tertiary)]">If you not see the code, check your spam or junk folder.</p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="text-center pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--foreground-tertiary)] mb-2">
                  Having trouble with verification?
                </p>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[var(--foreground-tertiary)]">
            Verification codes are sent instantly. Check your inbox now.
          </p>
          
        </div>
      </div>
    </div>
  );
}

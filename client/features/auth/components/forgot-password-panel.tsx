"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  KeyRound, 
  MailCheck, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { validateEmail } from "@/lib/validation/email";

export function ForgotPasswordPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const emailError = email ? validateEmail(email) : null;

  function handleSubmit() {
    if (emailError) {
      toast.error(emailError);
      return;
    }

    startTransition(async () => {
      try {
        const result = await forgotPassword(email);
        toast.success("Password reset code sent to your email.");
        router.push(`/auth/verify/${result.userId}?intent=reset`);
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Unable to start password reset.";
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

        {/* Main Forgot Password Card */}
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
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-red)] rounded-2xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-red)] rounded-2xl animate-ping" />
              <div className="relative w-full h-full bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-red)] rounded-2xl flex items-center justify-center">
                <KeyRound className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <CardTitle size="lg" className="bg-gradient-to-r from-[var(--color-yellow)] via-[var(--color-red)] to-[var(--color-blue)] bg-clip-text text-transparent">
                Password Recovery
              </CardTitle>
              <CardDescription className="text-[var(--foreground-secondary)]">
                Enter your email to receive a secure password reset code
              </CardDescription>
            </div>

            {/* Feature Pills */}
            <div className="flex justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-blue)]/10 text-[var(--color-blue)] rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Secure
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-green)]/10 text-[var(--color-green)] rounded-full text-xs font-medium">
                <Zap className="w-3 h-3" />
                Fast
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-yellow)]/10 text-[var(--color-yellow)] rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Easy
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Email Input */}
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@gondar.edu.et"
                error={emailError}
              />

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                busy={isPending}
                variant="primary"
                size="lg"
                className="relative overflow-hidden group w-full"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MailCheck className="w-4 h-4" />
                  )}
                  {isPending ? 'Sending Code...' : 'Send Reset Code'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)]" />
              </Button>
            </div>

            {/* Security Notice */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--surface)] px-2 text-[var(--foreground-tertiary)]">Security Information</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Security Info Cards */}
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-[var(--color-blue)]/5 border border-[var(--color-blue)]/20 rounded-[var(--radius-lg)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-blue)] mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-[var(--foreground)] font-medium mb-1">Secure Process</p>
                    <p className="text-[var(--foreground-tertiary)]">Password reset codes are sent via encrypted email and expire after 15 minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-[var(--color-green)]/5 border border-[var(--color-green)]/20 rounded-[var(--radius-lg)]">
                  <AlertCircle className="w-4 h-4 text-[var(--color-green)] mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-[var(--foreground)] font-medium mb-1">Account Verification</p>
                    <p className="text-[var(--foreground-tertiary)]">Only verified accounts can request password resets. Check with your admin if needed.</p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="text-center pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--foreground-tertiary)] mb-2">
                  Need additional help?
                </p>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        
      </div>
    </div>
  );
}

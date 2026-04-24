"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Fingerprint,
  KeyRound,
  Mail,
  MailCheck,
  Sparkles,
  Zap,
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { initiateLogin, passwordLogin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getDashboardPath } from "@/lib/auth/redirect-by-role";
import { validateEmail } from "@/lib/validation/email";
import { useAuth } from "@/hooks/use-auth";

export function LoginPanel() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpPending, startOtpTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const emailError = validateEmail(email);
  const passwordError = password && password.length < 8 ? "Use at least 8 characters." : null;

  function handleInitiateLogin() {
    if (emailError) {
      toast.error(emailError);
      return;
    }

    startOtpTransition(async () => {
      try {
        const result = await initiateLogin(email);
        toast.success("Verification code sent to your email.");
        router.push(`/auth/verify/${result.userId}`);
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Unable to initiate login.";
        toast.error(message);
      }
    });
  }

  function handlePasswordLogin() {
    if (emailError) {
      toast.error(emailError);
      return;
    }

    if (!password) {
      toast.error("Password is required.");
      return;
    }

    startPasswordTransition(async () => {
      try {
        const result = await passwordLogin(email, password);

        if ("requiresSetup" in result) {
          toast.info("This account needs password setup. We sent a verification code.");
          const otpResult = await initiateLogin(email);
          router.push(`/auth/verify/${otpResult.userId}`);
          return;
        }

        setSession(result.user);
        toast.success("Login successful.");
        router.push(getDashboardPath(result.user.role));
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Unable to sign in.";
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

        {/* Main Login Card */}
        <Card variant="glass" className="relative overflow-hidden backdrop-blur-xl animate-slide-in-up">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] opacity-20 rounded-[var(--radius-xl)]" />
          
          <CardHeader className="relative z-10 text-center space-y-6 pb-8">
            {/* Logo/Icon Section */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-2xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-2xl animate-ping" />
              <div className="relative w-full h-full bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <CardTitle size="lg" className="bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-[var(--foreground-secondary)]">
                Enter your credentials to access the Housing Allocation Portal
              </CardDescription>
            </div>

            {/* Feature Pills */}
            <div className="flex justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-blue)]/10 text-[var(--color-blue)] rounded-full text-xs font-medium">
                <Zap className="w-3 h-3" />
                Fast Login
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-green)]/10 text-[var(--color-green)] rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Secure
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
                error={email ? emailError : null}
              />

              {/* Login Options */}
              <div className="grid gap-3">
                <Button 
                  onClick={handleInitiateLogin} 
                  busy={isOtpPending}
                  variant="primary"
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isOtpPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MailCheck className="w-4 h-4" />
                    )}
                    {isOtpPending ? 'Sending Code...' : 'Send Verification Code'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)]" />
                </Button>

                <Button 
                  variant="secondary" 
                  onClick={handlePasswordLogin} 
                  busy={isPasswordPending}
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPasswordPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    {isPasswordPending ? 'Signing In...' : 'Sign In with Password'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-blue)]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)]" />
                </Button>
              </div>
            </div>

            

            <div className="space-y-4">
              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your secure password"
                error={password ? passwordError : null}
                allowPasswordToggle
              />

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground-tertiary)]">New user?</span>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-[var(--color-blue)] hover:text-[var(--color-blue-dark)] transition-colors duration-[var(--transition-fast)] flex items-center gap-1"
                >
                  Forgot password?
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-2 p-3 bg-[var(--color-green)]/5 border border-[var(--color-green)]/20 rounded-[var(--radius-lg)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-green)] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  Your login is secured with industry-standard encryption and multi-factor authentication.
                </p>
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--foreground-tertiary)] mb-2">
                Need help accessing your account?
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[var(--foreground-tertiary)]">
            © 2026 Gondar University Housing Allocation Portal
          </p>
          
        </div>
      </div>
    </div>
  );
}

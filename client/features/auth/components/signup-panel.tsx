"use client";



import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft, MailCheck, Shield, Sparkles, Zap, Loader2, UserRound } from "lucide-react";

import { toast } from "sonner";



import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Select } from "@/components/ui/select";

import { createSignupRequest } from "@/lib/api/auth";

import { ApiError } from "@/lib/api/client";

import { validateEmail } from "@/lib/validation/email";

import { validateName } from "@/lib/validation/name";

import { departmentOptions, departmentRoles, roleOptions, type UserDepartment } from "@/constants/user";

import type { UserRole } from "@/lib/auth/session-storage";



export function SignupPanel() {

  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [department, setDepartment] = useState<UserDepartment | "">("");

  const [isPending, startTransition] = useTransition();



  const nameError = name ? validateName(name) : null;

  const emailError = email ? validateEmail(email) : null;

  const departmentError = !department ? "College is required." : null;



  function handleSubmit() {

    if (nameError || emailError || departmentError || !name || !email) {

      toast.error(nameError ?? emailError ?? departmentError ?? "Fill in all fields correctly.");

      return;

    }



    startTransition(async () => {

      try {

        await createSignupRequest({

          name,

          email,

          role: "LECTURER",

          department: department,

        });



        toast.success("Request submitted. An admin will review your account.");

        router.push("/auth/login");

      } catch (error) {

        const message = error instanceof ApiError ? error.message : "Unable to submit signup request.";

        toast.error(message);

      }

    });

  }



  return (

    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in relative overflow-hidden">

      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[var(--color-blue)]/40 to-[var(--color-blue)]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[var(--color-green)]/40 to-[var(--color-green)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-br from-[var(--color-yellow)]/30 to-[var(--color-yellow)]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/25 to-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="relative overflow-hidden backdrop-blur-2xl animate-slide-in-up">
          {/* Vibrant Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] opacity-40 rounded-[var(--radius-xl)] animate-gradient-x" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[var(--radius-xl)]" />

          <div className="relative z-10 bg-[var(--surface)]/90 border-2 border-[var(--border)] rounded-[var(--radius-2xl)] shadow-2xl p-10">

            <div className="relative mb-10 text-center">
              <div className="absolute top-4 left-4">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-2 text-[var(--foreground-secondary)] hover:text-[var(--color-blue)] transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </Link>
              </div>

              {/* Enhanced Logo with Animation */}
              <div className="relative mx-auto inline-flex items-center justify-center w-28 h-28">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] rounded-3xl animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] rounded-3xl animate-ping opacity-30" />
                <div className="relative w-full h-full bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-3xl flex items-center justify-center shadow-lg">
                  <UserRound className="w-14 h-14 text-white animate-pulse" />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] bg-clip-text text-transparent">
                  Request Access
                </h1>
                <p className="text-base text-[var(--foreground-secondary)] leading-relaxed">
                  Create a new lecturer account request. An administrator must approve your request before you can sign in.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex justify-center gap-2 flex-wrap mt-6">
                <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[var(--color-blue)]/20 to-[var(--color-blue)]/10 text-[var(--color-blue)] rounded-full text-sm font-semibold border border-[var(--color-blue)]/30">
                  <Sparkles className="w-4 h-4" />
                  Lecturer Access
                </div>
                <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[var(--color-green)]/20 to-[var(--color-green)]/10 text-[var(--color-green)] rounded-full text-sm font-semibold border border-[var(--color-green)]/30">
                  <Shield className="w-4 h-4" />
                  Admin Approval
                </div>
                <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[var(--color-yellow)]/20 to-[var(--color-yellow)]/10 text-[var(--color-yellow)] rounded-full text-sm font-semibold border border-[var(--color-yellow)]/30">
                  <Zap className="w-4 h-4" />
                  Fast Review
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <Input
                label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                error={nameError}
                placeholder="Example Name"
                icon={<UserRound className="h-5 w-5 text-[var(--color-blue)]" />}
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={emailError}
                placeholder="name@example.com"
              />

              <Select
                label="College"
                value={department}
                onChange={(event) => setDepartment(event.target.value as UserDepartment | "")}
                options={departmentOptions}
                error={departmentError}
              />

              <Button onClick={handleSubmit} busy={isPending} variant="primary" size="lg" className="gap-2 text-lg py-6 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <MailCheck className="h-5 w-5" />}
                  {isPending ? 'Submitting...' : 'Submit Request'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)]" />
              </Button>
            </div>

            <div className="mt-10 rounded-2xl border-2 border-gradient-to-r from-[var(--color-blue)]/30 to-[var(--color-green)]/30 bg-gradient-to-br from-[var(--color-blue)]/5 to-[var(--color-green)]/5 p-6 text-sm">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-primary)] font-bold text-lg">
                <div className="p-2 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Account Review
              </div>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                Your request will be stored for administrator review. We will notify you once the account is activated and password setup is available.
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>

  );

}


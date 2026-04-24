"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { setupPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { validatePassword } from "@/lib/validation/password";

type PasswordSetupPanelProps = {
  userId: string;
};

export function PasswordSetupPanel({ userId }: PasswordSetupPanelProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const passwordError = newPassword ? validatePassword(newPassword) : null;
  const confirmPasswordError =
    confirmPassword && newPassword !== confirmPassword ? "Passwords do not match." : null;

  function handleSubmit() {
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (!confirmPassword || confirmPasswordError) {
      toast.error(confirmPasswordError ?? "Confirm your password.");
      return;
    }

    startTransition(async () => {
      try {
        await setupPassword(userId, newPassword);
        toast.success("Password created successfully. Sign in now.");
        router.push("/auth/login");
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Unable to set password.";
        toast.error(message);
      }
    });
  }

  return (
    <div className="panel grid gap-6 p-8">
      <div className="grid gap-2">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
          Password setup
        </div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold text-[var(--color-primary)]">
          Create your secure password
        </h1>
        <p className="text-sm leading-7 text-muted">
          Use a strong password with multiple character types. This matches the backend
          policy exactly.
        </p>
      </div>

      <Input
        label="New password"
        type="password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        error={passwordError}
        icon={<LockKeyhole className="h-4 w-4" />}
        allowPasswordToggle
      />

      <PasswordStrength value={newPassword} />

      <Input
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={confirmPasswordError}
        icon={<ShieldCheck className="h-4 w-4" />}
        allowPasswordToggle
      />

      <Button onClick={handleSubmit} busy={isPending} className="gap-2">
        <LockKeyhole className="h-4 w-4" /> Save password
      </Button>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Mail, Plus, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  departmentOptions,
  departmentRoles,
  roleOptions,
  type UserDepartment,
} from "@/constants/user";
import { createUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { UserRole } from "@/lib/auth/session-storage";
import { validateEmail } from "@/lib/validation/email";
import { validateName } from "@/lib/validation/name";

type AdminCreateUserFormProps = {
  onCreated?: () => void;
};

export function AdminCreateUserForm({ onCreated }: AdminCreateUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("LECTURER");
  const [department, setDepartment] = useState<UserDepartment | "">("");
  const [isPending, startTransition] = useTransition();

  const nameError = name ? validateName(name) : null;
  const emailError = email ? validateEmail(email) : null;
  const departmentRequired = departmentRoles.has(role);
  const departmentError =
    departmentRequired && !department ? "Department is required for this role." : null;

  function handleRoleChange(nextRole: UserRole) {
    setRole(nextRole);
    if (!departmentRoles.has(nextRole)) {
      setDepartment("");
    }
  }

  function handleSubmit() {
    if (nameError || emailError || departmentError || !name || !email) {
      toast.error(
        nameError ?? emailError ?? departmentError ?? "Fill in all fields correctly.",
      );
      return;
    }

    startTransition(async () => {
      try {
        const createdUser = await createUser({
          name,
          email,
          role,
          department: departmentRequired ? department : null,
        });
        toast.success(`${createdUser.name} created successfully.`);
        setName("");
        setEmail("");
        setRole("LECTURER");
        setDepartment("");
        onCreated?.();
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Unable to create user.";
        toast.error(message);
      }
    });
  }

  return (
    <div className="panel grid gap-6 p-8">
      <div className="grid gap-2">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
          Admin action
        </div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--color-primary)]">
          Create a new user
        </h2>
        <p className="text-sm leading-7 text-muted">
          Admins can create all roles, including other admins. New users begin with email
          verification and password setup.
        </p>
      </div>

      <div className="grid gap-4">
        <Input
          label="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={nameError}
          placeholder="Example Name"
          icon={<UserRound className="h-4 w-4" />}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          placeholder="name@example.com"
          icon={<Mail className="h-4 w-4" />}
        />
        <Select
          label="Role"
          value={role}
          onChange={(event) => handleRoleChange(event.target.value as UserRole)}
          options={roleOptions}
        />
        {departmentRequired ? (
          <Select
            label="Department"
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value as UserDepartment | "")
            }
            options={departmentOptions}
            error={departmentError}
          />
        ) : null}
      </div>

      <Button onClick={handleSubmit} busy={isPending} className="gap-2">
        <Plus className="h-4 w-4" /> Create user
      </Button>
    </div>
  );
}

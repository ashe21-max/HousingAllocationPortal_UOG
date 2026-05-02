import { apiRequest } from "@/lib/api/client";

import type { AuthSession, UserRole } from "@/lib/auth/session-storage";



export type InitiateLoginResponse = {

  success: true;

  userId: string;

  requiresPasswordSetup: boolean;

  expiresAt: string;

};



export type VerifyOtpResponse = {

  success: true;

  requiresPasswordSetup: boolean;

};



type ApiUser = {

  id: string;

  name: string;

  email: string;

  role: UserRole;

  department: string | null;

  isVerified: boolean;

  isActive: boolean;

};



function toAuthSession(user: ApiUser): AuthSession {

  return {

    userId: user.id,

    name: user.name,

    email: user.email,

    role: user.role,

    department: user.department,

    isVerified: user.isVerified,

  };

}



export async function initiateLogin(email: string) {

  return apiRequest<InitiateLoginResponse>("/auth/login/initiate", {

    method: "POST",

    body: { email },

  });

}



export async function forgotPassword(email: string) {

  return apiRequest<InitiateLoginResponse>("/auth/forgot-password", {

    method: "POST",

    body: { email },

  });

}



export async function resendOtp(userId: string) {

  return apiRequest<{ success: true; expiresAt: string }>("/auth/otp/resend", {

    method: "POST",

    body: { userId },

  });

}



export async function verifyOtp(userId: string, code: string) {

  return apiRequest<VerifyOtpResponse>("/auth/otp/verify", {

    method: "POST",

    body: { userId, code },

  });

}



export async function setupPassword(userId: string, newPassword: string) {

  return apiRequest<{ success: true }>("/auth/password/setup", {

    method: "POST",

    body: { userId, newPassword },

  });

}



export async function passwordLogin(email: string, password: string) {

  const result = await apiRequest<

    | { success: true; user: ApiUser }

    | { requiresSetup: true; userId: string }

  >("/auth/login", {

    method: "POST",

    body: { email, password },

  });



  if ("requiresSetup" in result) {

    return result;

  }



  return {

    success: true as const,

    user: toAuthSession(result.user),

  };

}



export async function logout() {

  return apiRequest<{ success: true }>("/auth/logout", {

    method: "POST",

  });

}



export type CreateUserPayload = {

  name: string;

  email: string;

  role: UserRole;

  department?: string | null;

};



export async function createUser(payload: CreateUserPayload) {

  const user = await apiRequest<ApiUser>("/admin/users", {

    method: "POST",

    body: payload,

  });



  return toAuthSession(user);

}



export async function createSignupRequest(payload: CreateUserPayload) {

  const user = await apiRequest<ApiUser>("/auth/signup", {

    method: "POST",

    body: payload,

  });



  return toAuthSession(user);

}



export type AdminUser = ApiUser & {

  createdAt: string;

};



export type UpdateAdminUserPayload = {

  name?: string;

  email?: string;

  role?: UserRole;

  department?: string | null;

};



export async function getAdminUsers(query?: {

  page?: number;

  pageSize?: number;

  search?: string;

  role?: UserRole | "";

  isActive?: "all" | "true" | "false";

}) {

  const params = new URLSearchParams();

  if (query?.page) {

    params.set("page", String(query.page));

  }

  if (query?.pageSize) {

    params.set("pageSize", String(query.pageSize));

  }

  if (query?.search) {

    params.set("search", query.search);

  }

  if (query?.role) {

    params.set("role", query.role);

  }

  if (query?.isActive && query.isActive !== "all") {

    params.set("isActive", query.isActive);

  }



  const q = params.toString();

  return apiRequest<{

    items: AdminUser[];

    total: number;

    page: number;

    pageSize: number;

    totalPages: number;

  }>(`/admin/users${q ? `?${q}` : ""}`);

}



export async function updateAdminUser(id: string, payload: UpdateAdminUserPayload) {

  return apiRequest<AdminUser>(`/admin/users/${id}`, {

    method: "PATCH",

    body: payload,

  });

}



export async function setAdminUserStatus(id: string, isActive: boolean) {

  return apiRequest<AdminUser>(`/admin/users/${id}/status`, {

    method: "PATCH",

    body: { isActive },

  });

}



export async function deleteAdminUser(id: string) {

  return apiRequest<{ message: string; user: AdminUser }>(`/admin/users/${id}`, {

    method: "DELETE",

  });

}

export async function getPendingSignupRequests() {
  return apiRequest<{
    items: AdminUser[];
    total: number;
  }>("/admin/users?isActive=false");
}

export async function approveSignupRequest(id: string) {
  return apiRequest<AdminUser>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: { isActive: true },
  });
}

export async function rejectSignupRequest(id: string) {
  return apiRequest<{ message: string; user: AdminUser }>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}


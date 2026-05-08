"use client";



import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

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

import { ApiError } from "@/lib/api/client";

import {

  deleteAdminUser,

  getAdminUsers,

  setAdminUserStatus,

  updateAdminUser,

  type AdminUser,

} from "@/lib/api/auth";

import type { UserRole } from "@/lib/auth/session-storage";

import { validateEmail } from "@/lib/validation/email";

import { validateName } from "@/lib/validation/name";



export function AdminUserManagementPanel() {

  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editName, setEditName] = useState("");

  const [editEmail, setEditEmail] = useState("");

  const [editRole, setEditRole] = useState<UserRole>("LECTURER");

  const [editDepartment, setEditDepartment] = useState<UserDepartment | "">("");

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");

  const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "date-asc" | "date-desc">("name-asc");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);



  const usersQuery = useQuery({

    queryKey: ["admin-users", page, pageSize, search, roleFilter, activeFilter],

    queryFn: () =>

      getAdminUsers({

        page,

        pageSize,

        search: search.trim() || undefined,

        role: roleFilter,

        isActive: activeFilter,

      }),

  });



  const updateMutation = useMutation({

    mutationFn: (payload: {

      id: string;

      body: {

        name?: string;

        email?: string;

        role?: UserRole;

        department?: string | null;

      };

    }) => updateAdminUser(payload.id, payload.body),

    onSuccess: () => {

      toast.success("User updated.");

      setEditingId(null);

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

    },

    onError: (error) => {

      const message = error instanceof ApiError ? error.message : "Could not update user.";

      toast.error(message);

    },

  });



  const statusMutation = useMutation({

    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>

      setAdminUserStatus(id, isActive),

    onSuccess: (_row, vars) => {

      toast.success(vars.isActive ? "User activated." : "User deactivated.");

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

    },

    onError: (error) => {

      const message =

        error instanceof ApiError ? error.message : "Could not update user status.";

      toast.error(message);

    },

  });



  const deleteMutation = useMutation({

    mutationFn: (id: string) => deleteAdminUser(id),

    onSuccess: (data) => {

      console.log("Delete successful:", data);

      toast.success("User deleted successfully.");

      setDeleteConfirmId(null);

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

    },

    onError: (error) => {

      console.error("Delete error:", error);

      const message =

        error instanceof ApiError ? error.message : "Could not delete user.";

      toast.error(message);

    },

  });



  function beginEdit(user: AdminUser) {

    setEditingId(user.id);

    setEditName(user.name);

    setEditEmail(user.email);

    setEditRole(user.role);

    setEditDepartment((user.department as UserDepartment | null) ?? "");

  }



  function cancelEdit() {

    setEditingId(null);

  }



  function confirmDelete(id: string) {

    setDeleteConfirmId(id);

  }



  function cancelDelete() {

    setDeleteConfirmId(null);

  }



  function handleDelete(id: string) {

    deleteMutation.mutate(id);

  }



  function saveEdit() {

    if (!editingId) {

      return;

    }



    const nameError = validateName(editName);

    const emailError = validateEmail(editEmail);

    const departmentRequired = departmentRoles.has(editRole);



    if (nameError || emailError || (departmentRequired && !editDepartment)) {

      toast.error(nameError ?? emailError ?? "College is required for this role.");

      return;

    }



    updateMutation.mutate({

      id: editingId,

      body: {

        name: editName,

        email: editEmail,

        role: editRole,

        department: departmentRequired ? editDepartment : null,

      },

    });

  }



  return (

    <section className="panel overflow-hidden">

      <div className="p-6 border-b border-[var(--border)]">

        <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">

          Manage Users

        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-5">

          <Input

            label="Search"

            value={search}

            onChange={(e) => {

              setSearch(e.target.value);

              setPage(1);

            }}

            placeholder="Name or email"

          />

          <Select

            label="Role Filter"

            options={[{ label: "All roles", value: "" }, ...roleOptions]}

            value={roleFilter}

            onChange={(e) => {

              setRoleFilter(e.target.value as UserRole | "");

              setPage(1);

            }}

          />

          <Select

            label="Active Filter"

            options={[

              { label: "All", value: "all" },

              { label: "Active", value: "true" },

              { label: "Inactive", value: "false" },

            ]}

            value={activeFilter}

            onChange={(e) => {

              setActiveFilter(e.target.value as "all" | "true" | "false");

              setPage(1);

            }}

          />

          <Select

            label="Sort by"

            options={[

              { label: "A to Z", value: "name-asc" },

              { label: "Z to A", value: "name-desc" },

              { label: "Newest first", value: "date-desc" },

              { label: "Oldest first", value: "date-asc" },

            ]}

            value={sortBy}

            onChange={(e) => {

              setSortBy(e.target.value as typeof sortBy);

            }}

          />

          <Select

            label="Page Size"

            options={[

              { label: "10", value: "10" },

              { label: "20", value: "20" },

              { label: "50", value: "50" },

            ]}

            value={String(pageSize)}

            onChange={(e) => {

              setPageSize(Number(e.target.value));

              setPage(1);

            }}

          />

        </div>

      </div>



      {usersQuery.isLoading ? (

        <div className="p-8 text-sm text-muted">Loading users...</div>

      ) : usersQuery.isError ? (

        <div className="p-8 text-sm text-[var(--color-danger)]">Could not load users.</div>

      ) : !usersQuery.data || usersQuery.data.items.length === 0 ? (

        <div className="p-8 text-sm text-muted">No users found.</div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">

                  Name

                </th>

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">

                  Email

                </th>

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">

                  Role

                </th>

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">

                  College

                </th>

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">

                  Active

                </th>

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[var(--border)]">

              {[...usersQuery.data.items]
                .sort((a, b) => {
                  switch (sortBy) {
                    case "name-asc":
                      return (a.name || "").localeCompare(b.name || "");
                    case "name-desc":
                      return (b.name || "").localeCompare(a.name || "");
                    case "date-asc":
                      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                    case "date-desc":
                      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                    default:
                      return 0;
                  }
                })
                .map((user) => (

                <tr key={user.id}>

                  <td className="px-4 py-4 text-sm text-[var(--color-primary)]">{user.name}</td>

                  <td className="px-4 py-4 text-sm text-muted">{user.email}</td>

                  <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">

                    {user.role}

                  </td>

                  <td className="px-4 py-4 text-sm text-muted">{user.department ?? "-"}</td>

                  <td className="px-4 py-4 text-sm text-muted">

                    {user.isActive ? "Yes" : "No"}

                  </td>

                  <td className="px-4 py-4 text-right space-x-2">

                    <Button size="sm" variant="secondary" onClick={() => beginEdit(user)}>

                      Edit

                    </Button>

                    <Button

                      size="sm"

                      variant={user.isActive ? "danger" : "secondary"}

                      busy={

                        statusMutation.isPending &&

                        statusMutation.variables?.id === user.id

                      }

                      onClick={() =>

                        statusMutation.mutate({ id: user.id, isActive: !user.isActive })

                      }

                    >

                      {user.isActive ? "Deactivate" : "Activate"}

                    </Button>

                    {deleteConfirmId === user.id ? (

                      <div className="flex gap-1">

                        <Button

                          size="sm"

                          variant="danger"

                          busy={deleteMutation.isPending}

                          onClick={() => handleDelete(user.id)}

                        >

                          Confirm

                        </Button>

                        <Button

                          size="sm"

                          variant="ghost"

                          onClick={cancelDelete}

                        >

                          Cancel

                        </Button>

                      </div>

                    ) : (

                      <Button

                        size="sm"

                        variant="danger"

                        onClick={() => confirmDelete(user.id)}

                      >

                        Delete

                      </Button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}



      {usersQuery.data ? (

        <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4">

          <p className="text-xs text-muted">

            Showing page {usersQuery.data.page} of {usersQuery.data.totalPages} ({usersQuery.data.total} users)

          </p>

          <div className="flex gap-2">

            <Button

              size="sm"

              variant="secondary"

              onClick={() => setPage((p) => Math.max(1, p - 1))}

              disabled={usersQuery.data.page <= 1}

            >

              Previous

            </Button>

            <Button

              size="sm"

              variant="secondary"

              onClick={() =>

                setPage((p) => Math.min(usersQuery.data.totalPages, p + 1))

              }

              disabled={usersQuery.data.page >= usersQuery.data.totalPages}

            >

              Next

            </Button>

          </div>

        </div>

      ) : null}



      {editingId ? (

        <div className="border-t border-[var(--border)] p-6 space-y-4 bg-[var(--surface-muted)]">

          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">

            Edit User

          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <Input label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />

            <Input

              label="Email"

              type="email"

              value={editEmail}

              onChange={(e) => setEditEmail(e.target.value)}

            />

            <Select

              label="Role"

              options={roleOptions}

              value={editRole}

              onChange={(e) => {

                const nextRole = e.target.value as UserRole;

                setEditRole(nextRole);

                if (!departmentRoles.has(nextRole)) {

                  setEditDepartment("");

                }

              }}

            />

            {departmentRoles.has(editRole) ? (

              <Select

                label="College"

                options={departmentOptions}

                value={editDepartment}

                onChange={(e) => setEditDepartment(e.target.value as UserDepartment | "")}

              />

            ) : null}

          </div>

          <div className="flex gap-3">

            <Button onClick={saveEdit} busy={updateMutation.isPending}>

              Save

            </Button>

            <Button variant="ghost" onClick={cancelEdit}>

              Cancel

            </Button>

          </div>

        </div>

      ) : null}

    </section>

  );

}


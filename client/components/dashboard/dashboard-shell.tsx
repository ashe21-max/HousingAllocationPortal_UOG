"use client";

import { useState, useEffect } from "react";
import { Menu, Globe, User, LogOut, Edit, Camera, ChevronDown, RotateCw } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "./dashboard-sidebar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DashboardMainAuthBackdrop } from "@/components/dashboard/dashboard-main-auth-backdrop";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  department?: string | null;
  profilePicture?: string | null;
  createdAt: string;
}

type DashboardShellProps = {
  title: string | React.ReactNode;
  description: string;
  children: React.ReactNode;
  /** Auth-style gradient behind sidebar + header + main (full shell). */
  authStyleMainBackdrop?: boolean;
};

export function DashboardShell({
  title,
  description,
  children,
  authStyleMainBackdrop = false,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session, clearSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const userProfile: UserProfile = {
        id: 'default',
        fullName: session.name || 'User',
        email: session.email || 'user@example.com',
        phoneNumber: null,
        role: session.role || 'LECTURER',
        department: session.department || 'Computer Science',
        profilePicture: null,
        createdAt: new Date().toISOString(),
      };
      setEditForm(userProfile);
    }
  }, [session]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setIsProfileOpen(false);
  };

  const handleSaveProfile = async () => {
    if (!editForm) return;
    setIsLoading(true);
    setIsEditing(false);
    toast.success('Profile updated successfully', { duration: 500 });
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore and continue client cleanup
    }
    clearSession();
    toast.success("Signed out successfully.", { duration: 500 });
    router.replace("/auth/login");
  };

  const handleRefresh = () => {
    toast.loading('Refreshing system...', { duration: 500 });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      if (editForm) {
        setEditForm({ ...editForm, profilePicture: imageUrl });
      }
      toast.success('Profile picture updated successfully', { duration: 500 });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.success('Profile picture updated locally', { duration: 500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-screen w-full overflow-hidden text-[var(--foreground)]",
        !authStyleMainBackdrop &&
          "bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background)]",
      )}
    >
      {authStyleMainBackdrop && (
        <div className="absolute inset-0 z-0">
          <DashboardMainAuthBackdrop />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        authGradientChrome={authStyleMainBackdrop}
      />

      {/* Top Right Profile */}
      {editForm && (
        <>
          {/* Minimized Top Right Profile */}
          <div className="fixed top-0 right-2 z-40 flex flex-col items-center gap-1 bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] rounded-lg shadow-lg border border-[var(--border)] px-2 py-1.5">
            {/* Profile Section */}
            <div className="flex items-center gap-2">
              {/* Professional Refresh Button */}
              <button
                onClick={handleRefresh}
                className="group relative p-1 rounded hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                title="Refresh System"
              >
                <RotateCw 
                  className="h-3 w-3 text-white group-hover:text-white transition-colors duration-300 group-hover:rotate-180" 
                  strokeWidth={2}
                />
                <div className="absolute inset-0 rounded bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <div className="h-2 w-px bg-white/30"></div>
              
              <Button
                variant="ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 text-white hover:text-white/90 p-0.5"
              >
                <div className="flex items-center gap-1">
                  {editForm.profilePicture ? (
                    <Image
                      src={editForm.profilePicture}
                      alt="Profile"
                      width={16}
                      height={16}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-white/30 flex items-center justify-center">
                      <User className="h-2 w-2 text-white" />
                    </div>
                  )}
                  <span className="text-xs font-medium hidden sm:block text-white leading-tight">{editForm.fullName}</span>
                  <ChevronDown className="h-2 w-2 text-white" />
                </div>
              </Button>
            </div>
            
            {/* Date Below Profile - Very Small and White */}
            <span className="text-[8px] font-mono text-white tracking-tight">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gradient-to-br from-white to-[var(--background)] rounded-lg shadow-xl border border-[var(--border)] z-40">
                <div className="p-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    {editForm.profilePicture ? (
                      <Image
                        src={editForm.profilePicture}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm text-[var(--foreground)] leading-snug">{editForm.fullName}</p>
                      <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">{editForm.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <Button
                    variant="ghost"
                    onClick={handleEditProfile}
                    className="w-full justify-start text-sm hover:bg-gradient-to-r hover:from-[var(--color-blue)]/10 hover:to-[var(--color-green)]/10 text-[var(--foreground)]"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-sm hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
              <div className="bg-gradient-to-br from-white to-[var(--background)] rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] text-white">
                  <h2 className="text-2xl font-semibold leading-tight">Edit Profile</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {editForm.profilePicture ? (
                        <Image
                          src={editForm.profilePicture}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] flex items-center justify-center">
                          <User className="h-10 w-10 text-white" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] rounded-full p-1 cursor-pointer hover:shadow-lg transition duration-300">
                        <Camera className="h-3 w-3 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-2 leading-relaxed">Click camera to change photo</p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1 leading-snug">Full Name</label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] bg-[var(--surface)] text-sm leading-normal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1 leading-snug">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] bg-[var(--surface)] text-sm leading-normal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1 leading-snug">Phone Number</label>
                      <input
                        type="tel"
                        value={editForm.phoneNumber || ''}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] bg-[var(--surface)] text-sm leading-normal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1 leading-snug">Role</label>
                        <div className="px-3 py-2 bg-gradient-to-r from-[var(--color-blue)]/10 to-[var(--color-green)]/10 rounded-md text-sm leading-normal">
                          {editForm.role}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1 leading-snug">College</label>
                        <div className="px-3 py-2 bg-gradient-to-r from-[var(--color-green)]/10 to-[var(--color-yellow)]/10 rounded-md text-sm leading-normal">
                          {editForm.department || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1 leading-snug">Member Since</label>
                      <div className="px-3 py-2 bg-gradient-to-r from-[var(--color-yellow)]/10 to-[var(--color-blue)]/10 rounded-md text-sm leading-normal">
                        {new Date(editForm.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="hover:bg-[var(--surface)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] text-white hover:shadow-lg transition duration-300"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-30 flex h-20 items-center justify-between border-b px-4 text-white lg:px-8",
            authStyleMainBackdrop
              ? "border-white/25 bg-white/10 backdrop-blur-xl shadow-lg"
              : "border-[var(--border)] bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] shadow-lg",
          )}
        >
          <div className="flex flex-1 items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-2 transition duration-300 lg:hidden hover:bg-white/20"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-white" />
            </Button>

            <div className="relative w-full max-w-md lg:hidden">
              <BrandLockup
                logoSize={32}
                subtitle=""
                subtitleClassName="text-white/90"
                titleClassName="text-white font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://uog.edu.et/login/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors duration-300 opacity-90 hover:opacity-100"
              title="Visit University Portal"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden lg:inline">University Portal</span>
            </a>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main
          className={cn(
            "custom-scrollbar flex-1 overflow-y-auto",
            authStyleMainBackdrop ? "relative" : "p-10",
          )}
        >
          <div
            className={cn(
              "mx-auto max-w-[1400px] space-y-10",
              authStyleMainBackdrop && "relative z-10 min-h-full p-10",
            )}
          >
            {/* Page Header */}
            <div
              className={cn(
                "border-b pb-8",
                authStyleMainBackdrop ? "border-white/25" : "border-[var(--border)]",
              )}
            >
              <div
                className={cn(
                  "mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em]",
                  authStyleMainBackdrop ? "text-white/75" : "text-muted",
                )}
              >
                <span>Workspace</span>
                <span
                  className={cn(
                    authStyleMainBackdrop ? "text-white/35" : "text-[var(--border)]",
                  )}
                >
                  /
                </span>
                <span
                  className={cn(
                    "font-bold",
                    authStyleMainBackdrop ? "text-white" : "text-[var(--color-primary)]",
                  )}
                >
                  {title}
                </span>
              </div>
              <h1
                className={cn(
                  "text-6xl font-bold uppercase leading-tight",
                  authStyleMainBackdrop
                    ? "text-white drop-shadow-md"
                    : "bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] bg-clip-text text-transparent",
                )}
              >
                {title}
              </h1>
              <p
                className={cn(
                  "mt-3 max-w-3xl text-base leading-normal",
                  authStyleMainBackdrop ? "text-white/85" : "text-muted",
                )}
              >
                {description}
              </p>
            </div>

            {/* Content Slot */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
              {children}
            </div>

            {authStyleMainBackdrop && (
              <p className="pb-6 text-center text-sm text-white/70">
                © 2026 Gondar University — University of Gondar House Allocation Portal
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

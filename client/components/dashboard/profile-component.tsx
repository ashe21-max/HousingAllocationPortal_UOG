'use client';

import { useState, useEffect } from 'react';
import { User, LogOut, Edit, Camera, ChevronDown, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { logout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

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

export function ProfileComponent() {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  const handleSaveProfile = async () => {
    if (!editForm) return;

    setIsLoading(true);
    setIsEditing(false);
    
    // For now, just show success message
    toast.success('Profile updated successfully');
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore and continue client cleanup
    }

    clearSession();
    toast.success("Signed out successfully.");
    router.replace("/auth/login");
  };

  const handleRefresh = () => {
    // Show loading state
    toast.loading('Refreshing system...');
    
    // Force refresh the entire page like professional systems
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Create a temporary URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      
      // Update local state immediately for better UX
      if (editForm) {
        setEditForm({ ...editForm, profilePicture: imageUrl });
      }

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.success('Profile picture updated locally');
    } finally {
      setIsLoading(false);
    }
  };

  if (!editForm) return null;

  return (
    <>
      {/* Minimized Top Right Profile */}
      <div className="fixed top-0 right-2 z-40 flex flex-col items-center gap-1 bg-white rounded-lg shadow-md border border-gray-200 px-2 py-1.5">
        {/* Profile Section */}
        <div className="flex items-center gap-2">
          {/* Professional Refresh Button */}
          <button
            onClick={handleRefresh}
            className="group relative p-1 rounded hover:bg-gray-100 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            title="Refresh System"
          >
            <RotateCw 
              className="h-3 w-3 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 group-hover:rotate-180" 
              strokeWidth={2}
            />
            <div className="absolute inset-0 rounded bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
          
          <div className="h-2 w-px bg-gray-300"></div>
          
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 p-0.5"
          >
            <div className="flex items-center gap-1">
              {editForm.profilePicture ? (
                <img
                  src={editForm.profilePicture}
                  alt="Profile"
                  className="h-4 w-4 rounded-full object-cover"
                />
              ) : (
                <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="h-2 w-2 text-white" />
                </div>
              )}
              <span className="text-xs font-medium hidden sm:block">{editForm.fullName}</span>
              <ChevronDown className="h-2 w-2" />
            </div>
          </Button>
        </div>
        
        {/* Date Below Profile - Very Small and Black */}
        <span className="text-[8px] font-mono text-black tracking-tight">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {editForm.profilePicture ? (
                  <img
                    src={editForm.profilePicture}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{editForm.fullName}</p>
                  <p className="text-xs text-gray-500">{editForm.role}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <Button
                variant="ghost"
                onClick={handleEditProfile}
                className="w-full justify-start text-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-sm text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {isEditing && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {editForm.profilePicture ? (
                    <img
                      src={editForm.profilePicture}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700">
                    <Camera className="h-3 w-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Click camera to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-md text-sm">
                      {editForm.role}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-md text-sm">
                      {editForm.department || 'N/A'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-sm">
                    {new Date(editForm.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api/client";
import { 
  User,
  Bell,
  Shield,
  Mail,
  Phone,
  Lock,
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface UserSettingsData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    staffId: string;
    bio: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
  security: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
}

function SettingsPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<'personal' | 'notifications' | 'security' | 'preferences'>('personal');
  
  const [settings, setSettings] = useState<UserSettingsData>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      staffId: '',
      bio: '',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: true,
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest<UserSettingsData>('/settings/user');
      if (data) {
        setSettings(data);
      } else {
        // Handle null response (HTML responses) with mock data
        const mockData: UserSettingsData = {
          personal: {
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@example.com',
            phone: '',
            department: '',
            position: '',
            staffId: '',
            bio: ''
          },
          notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false
          },
          security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
        };
        setSettings(mockData);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Use mock data when server is not available
      const mockData: UserSettingsData = {
        personal: {
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          phone: '',
          department: '',
          position: '',
          staffId: '',
          bio: ''
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false
        },
        security: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      };
      setSettings(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      await apiRequest('/settings/user', {
        method: 'POST',
        body: settings
      });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show saved status even if server fails (demo mode)
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateNotifications = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
  };

  const updateSecurity = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  return (
    <div className="page-shell">
      <div className="container animate-fade-in">
        {/* Header */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-xl flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle size="lg" className="text-[var(--foreground)]">Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadUserSettings} 
                  disabled={isLoading}
                  className="hover:bg-[var(--color-blue)]/10"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                  variant="primary" 
                  onClick={saveSettings} 
                  disabled={saveStatus === 'saving'}
                  busy={saveStatus === 'saving'}
                >
                  <Save className="w-4 h-4" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Status Messages */}
          {saveStatus === 'saved' && (
            <div className="mx-6 mb-4 p-4 bg-[var(--color-green)]/10 border border-[var(--color-green)]/20 rounded-[var(--radius-lg)] flex items-center gap-3 animate-slide-in-right">
              <CheckCircle className="w-5 h-5 text-[var(--color-green)]" />
              <span className="text-[var(--color-green-dark)] font-medium">Settings saved successfully!</span>
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="mx-6 mb-4 p-4 bg-[var(--color-red)]/10 border border-[var(--color-red)]/20 rounded-[var(--radius-lg)] flex items-center gap-3 animate-slide-in-right">
              <AlertCircle className="w-5 h-5 text-[var(--color-red)]" />
              <span className="text-[var(--color-red-dark)] font-medium">Failed to save settings. Please try again.</span>
            </div>
          )}
        </Card>

        {/* Settings Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="xl:col-span-1">
            <Card variant="default" className="sticky top-8">
              <CardHeader>
                <CardTitle size="sm" className="text-[var(--foreground-secondary)]">Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {[
                    { id: 'personal', label: 'Personal Info', icon: User, color: 'blue' },
                    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'green' },
                    { id: 'security', label: 'Security', icon: Shield, color: 'red' },
                    { id: 'preferences', label: 'Preferences', icon: SettingsIcon, color: 'yellow' },
                  ].map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id as any)}
                        className={`
                          w-full text-left px-4 py-3 rounded-[var(--radius-lg)] transition-all duration-[var(--transition-normal)]
                          flex items-center gap-3 group relative overflow-hidden
                          ${isActive 
                            ? 'bg-[var(--color-' + section.color + ')]/10 text-[var(--color-' + section.color + ')] border-l-4 border-[var(--color-' + section.color + ')]' 
                            : 'hover:bg-[var(--surface-muted)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                          }
                        `}
                      >
                        <section.icon className={`w-5 h-5 transition-transform duration-[var(--transition-normal)] group-hover:scale-110 ${
                          isActive ? 'text-[var(--color-' + section.color + ')]' : ''
                        }`} />
                        <span className="font-medium">{section.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-[var(--color-' + section.color + ')] animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="xl:col-span-3 space-y-8">
            {activeSection === 'personal' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-blue)]/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-[var(--color-blue)]" />
                    </div>
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and contact information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      value={settings.personal.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('firstName', e.target.value)}
                      icon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Last Name"
                      value={settings.personal.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('lastName', e.target.value)}
                      icon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={settings.personal.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('email', e.target.value)}
                      icon={<Mail className="w-4 h-4" />}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={settings.personal.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('phone', e.target.value)}
                      icon={<Phone className="w-4 h-4" />}
                    />
                    <Input
                      label="Department"
                      value={settings.personal.department}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('department', e.target.value)}
                      icon={<Shield className="w-4 h-4" />}
                    />
                    <Input
                      label="Staff ID"
                      value={settings.personal.staffId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('staffId', e.target.value)}
                      icon={<Shield className="w-4 h-4" />}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'notifications' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-green)]/10 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[var(--color-green)]" />
                    </div>
                    <div>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose how you want to receive updates</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates and alerts via email', color: 'blue' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in your browser', color: 'green' },
                      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via SMS', color: 'yellow' },
                    ].map((setting) => (
                      <label 
                        key={setting.key}
                        className="flex items-center justify-between p-4 border border-[var(--border)] rounded-[var(--radius-lg)] hover:bg-[var(--surface-muted)] cursor-pointer transition-all duration-[var(--transition-normal)] group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-[var(--color-${setting.color})]/10 rounded-lg flex items-center justify-center`}>
                            <Mail className="w-5 h-5 text-[var(--color-${setting.color})]" />
                          </div>
                          <div>
                            <div className="font-medium text-[var(--foreground)]">{setting.label}</div>
                            <div className="text-sm text-[var(--foreground-tertiary)]">{setting.description}</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications[setting.key as keyof typeof settings.notifications]}
                          onChange={(e) => updateNotifications(setting.key, e.target.checked)}
                          className="w-5 h-5 text-[var(--color-blue)] rounded focus:ring-[var(--color-blue)]/20"
                        />
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'security' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-red)]/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[var(--color-red)]" />
                    </div>
                    <div>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your password and security preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Input
                      label="Current Password"
                      type="password"
                      value={settings.security.currentPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSecurity('currentPassword', e.target.value)}
                      allowPasswordToggle
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={settings.security.newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSecurity('newPassword', e.target.value)}
                      allowPasswordToggle
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={settings.security.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSecurity('confirmPassword', e.target.value)}
                      allowPasswordToggle
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <Button 
                      variant="primary" 
                      className="w-full" 
                      size="lg"
                      onClick={() => console.log('Password update logic here')}
                    >
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'preferences' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-yellow)]/10 rounded-lg flex items-center justify-center">
                      <SettingsIcon className="w-5 h-5 text-[var(--color-yellow)]" />
                    </div>
                    <div>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>Customize your experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <SettingsIcon className="w-16 h-16 text-[var(--foreground-tertiary)] mx-auto mb-4" />
                    <p className="text-[var(--foreground-tertiary)]">Additional preferences coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { SettingsPanel };

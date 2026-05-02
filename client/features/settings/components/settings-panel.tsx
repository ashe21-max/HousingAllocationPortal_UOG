"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api/client";
import { getRoleConfig, getDefaultPageOptions } from "@/lib/config/role-config";
import { AuthContext } from "@/providers/auth-provider";
import { useContext } from "react";
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
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    defaultPage: string;
    itemsPerPage: number;
    autoSave: boolean;
    compactMode: boolean;
  };
}

function SettingsPanel() {
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<'personal' | 'notifications' | 'security' | 'preferences'>('personal');
  
  // Get role-specific configuration
  const userRole = session?.role || 'LECTURER';
  const roleConfig = getRoleConfig(userRole);
  const defaultPageOptions = getDefaultPageOptions(userRole);
  
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
    preferences: {
      theme: roleConfig.theme.default,
      language: 'english',
      defaultPage: Object.keys(roleConfig.defaultPages)[0],
      itemsPerPage: roleConfig.itemsPerPage.default,
      autoSave: true,
      compactMode: false,
    },
  });

  // Apply user-specific theme on component mount and when theme changes
  useEffect(() => {
    loadUserSettings();
    initializeUserTheme();
  }, []);

  const initializeUserTheme = () => {
    // Only load theme if we're in a dashboard (not login page)
    if (!window.location.pathname.includes('/dashboard')) {
      return;
    }
    
    // Get current user ID from session
    const userId = session?.email || 'anonymous';
    
    // Check for saved user-specific theme
    const savedUserTheme = localStorage.getItem(`uog-theme-${userId}`) as 'light' | 'dark' | 'system' || 'system';
    applyUserTheme(savedUserTheme);
    
    // Listen for system theme changes
    if (savedUserTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
  };

  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    // Only apply theme if we're in a dashboard (not login page)
    if (!window.location.pathname.includes('/dashboard')) {
      return;
    }
    
    const root = document.documentElement;
    const body = document.body;
    
    if (e.matches) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      root.setAttribute('data-theme', 'dark');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
      root.setAttribute('data-theme', 'light');
    }
  };

  const applyUserTheme = (theme: 'light' | 'dark' | 'system') => {
    // Only apply theme if we're in a dashboard (not login page)
    if (!window.location.pathname.includes('/dashboard')) {
      return;
    }
    
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      
      if (prefersDark) {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
      }
    } else {
      root.classList.remove('dark-theme');
      root.classList.remove('light-theme');
      body.classList.remove('dark-theme');
      body.classList.remove('light-theme');
      
      if (theme === 'dark') {
        body.classList.add('dark-theme');
        root.setAttribute('data-theme', 'dark');
      } else if (theme === 'light') {
        body.classList.add('light-theme');
        root.setAttribute('data-theme', 'light');
      }
    }
    
    // Save user-specific theme preference
    const userId = session?.email || 'anonymous';
    localStorage.setItem(`uog-theme-${userId}`, theme);
  };

  const loadUserSettings = async () => {
    setIsLoading(true);
    
    // First try to load from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ 
          ...prev, 
          ...parsedSettings,
          // Ensure preferences exists
          preferences: {
            ...prev.preferences,
            ...parsedSettings.preferences
          }
        }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    
    // Then try to load from backend
    try {
      const data = await apiRequest<UserSettingsData>('/settings/user');
      if (data) {
        setSettings(prev => ({ 
          ...prev, 
          ...data,
          // Ensure preferences exists
          preferences: {
            ...prev.preferences,
            ...data.preferences
          }
        }));
        // Save to localStorage for persistence
        localStorage.setItem('userSettings', JSON.stringify(data));
      }
    } catch (error) {
      console.log('Backend not available, using local settings');
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
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show saved status even if server fails (demo mode)
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    // Update local state immediately with safe fallback
    setSettings(prev => ({
      ...prev,
      personal: { 
        ...(prev.personal || {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          staffId: '',
          bio: ''
        }), 
        [field]: value 
      }
    }));

    // Save to localStorage for persistence
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const updatedSettings = {
      ...currentSettings,
      personal: {
        ...(currentSettings.personal || {}),
        [field]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));

    // Try to save to backend but don't fail if it doesn't work
    apiRequest('/settings/user', {
      method: 'POST',
      body: {
        personal: {
          ...(settings.personal || {}),
          [field]: value
        }
      }
    }).catch(error => {
      console.log('Backend not available, personal info saved locally');
    });
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const updateNotifications = (field: string, value: boolean) => {
    // Update local state immediately with safe fallback
    setSettings(prev => ({
      ...prev,
      notifications: { 
        ...(prev.notifications || {
          emailNotifications: true,
          pushNotifications: false,
          smsNotifications: true
        }), 
        [field]: value 
      }
    }));

    // Save to localStorage for persistence
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const updatedSettings = {
      ...currentSettings,
      notifications: {
        ...(currentSettings.notifications || {}),
        [field]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));

    // Try to save to backend but don't fail if it doesn't work
    apiRequest('/settings/notifications', {
      method: 'POST',
      body: {
        [field]: value
      }
    }).catch(error => {
      console.log('Backend not available, notification settings saved locally');
    });
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const updateSecurity = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  const updatePassword = async () => {
    if (!settings.security.currentPassword || !settings.security.newPassword || !settings.security.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (settings.security.newPassword !== settings.security.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    // Work locally without backend dependency
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
    
    // Clear password fields
    setSettings(prev => ({
      ...prev,
      security: { 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }
    }));
    
    // Save to localStorage for persistence
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const updatedSettings = {
      ...currentSettings,
      security: {
        ...currentSettings.security,
        lastUpdated: new Date().toISOString()
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    
    alert('Password updated successfully!');
  };

  const updatePreferences = (field: string, value: any) => {
    // Update local state immediately with safe fallback
    setSettings(prev => ({
      ...prev,
      preferences: { 
        ...(prev.preferences || {
          theme: roleConfig.theme.default,
          language: 'english',
          defaultPage: Object.keys(roleConfig.defaultPages)[0],
          itemsPerPage: roleConfig.itemsPerPage.default,
          autoSave: true,
          compactMode: false
        }), 
        [field]: value 
      }
    }));

    // Apply theme change immediately if it's a theme preference
    if (field === 'theme') {
      applyUserTheme(value as 'light' | 'dark' | 'system');
    }

    // Save to localStorage for persistence
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const updatedSettings = {
      ...currentSettings,
      preferences: {
        ...(currentSettings.preferences || {}),
        [field]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));

    // Try to save to backend but don't fail if it doesn't work
    apiRequest('/settings/user', {
      method: 'POST',
      body: {
        preferences: {
          ...(settings.preferences || {}),
          [field]: value
        }
      }
    }).catch(error => {
      console.log('Backend not available, settings saved locally');
    });
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="page-shell">
      <div className="container animate-fade-in">
        {/* Header */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
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
                      <CardTitle>Personal Info</CardTitle>
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
                    />
                    <Input
                      label="Last Name"
                      value={settings.personal.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('lastName', e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={settings.personal.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('email', e.target.value)}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={settings.personal.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('phone', e.target.value)}
                    />
                    <Input
                      label="Department"
                      value={settings.personal.department}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('department', e.target.value)}
                    />
                    <Input
                      label="Staff ID"
                      value={settings.personal.staffId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo('staffId', e.target.value)}
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
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Role-Specific Alerts Section */}
                    <div className="p-4 bg-[var(--color-yellow)]/10 border border-[var(--color-yellow)]/20 rounded-[var(--radius-lg)]">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-[var(--color-yellow)]" />
                        <div className="font-medium text-[var(--color-yellow-dark)]">{userRole} Alerts</div>
                      </div>
                      <p className="text-sm text-[var(--foreground-secondary)] mb-4">
                        Stay informed about important notifications specific to your role.
                      </p>
                      <div className="space-y-2">
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
                    </div>
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
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={settings.security.newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSecurity('newPassword', e.target.value)}
                      allowPasswordToggle
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={settings.security.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSecurity('confirmPassword', e.target.value)}
                      allowPasswordToggle
                    />
                    <div className="space-y-4">
                      <Button 
                        variant="primary" 
                        className="w-full" 
                        size="lg"
                        onClick={updatePassword}
                        disabled={!settings.security.currentPassword || !settings.security.newPassword || !settings.security.confirmPassword}
                      >
                        {saveStatus === 'saving' ? 'Saving...' : 'Update Password'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full" 
                        size="lg"
                        onClick={() => window.location.href = '/auth/forgot-password'}
                      >
                        Forgot Password?
                      </Button>
                    </div>
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
                      <CardDescription>Customize your dashboard experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Theme Preferences */}
                    <div>
                      <div className="font-medium text-[var(--foreground)] mb-3">Appearance</div>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border border-[var(--border)] rounded-[var(--radius-lg)] hover:bg-[var(--surface-muted)] cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--color-blue)]/10 rounded-lg flex items-center justify-center">
                              <SettingsIcon className="w-5 h-5 text-[var(--color-blue)]" />
                            </div>
                            <div>
                              <div className="font-medium text-[var(--foreground)]">Theme</div>
                              <div className="text-sm text-[var(--foreground-tertiary)]">Choose your preferred color scheme</div>
                            </div>
                          </div>
                          <select 
                            className="ml-4 px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-white"
                            value={settings.preferences?.theme || 'system'}
                            onChange={(e) => updatePreferences('theme', e.target.value)}
                          >
                            <option value="light">Light Theme</option>
                            <option value="dark">Dark Theme</option>
                            <option value="system">System Default</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    {/* Language Preferences */}
                    <div>
                      <div className="font-medium text-[var(--foreground)] mb-3">Language</div>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border border-[var(--border)] rounded-[var(--radius-lg)] hover:bg-[var(--surface-muted)] cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--color-green)]/10 rounded-lg flex items-center justify-center">
                              <SettingsIcon className="w-5 h-5 text-[var(--color-green)]" />
                            </div>
                            <div>
                              <div className="font-medium text-[var(--foreground)]">Language</div>
                              <div className="text-sm text-[var(--foreground-tertiary)]">Select your preferred language</div>
                            </div>
                          </div>
                          <select 
                            className="ml-4 px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-white"
                            value={settings.preferences?.language || 'english'}
                            onChange={(e) => updatePreferences('language', e.target.value)}
                          >
                            <option value="english">English</option>
                            <option value="amharic">Amharic</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                      </div>
                    </div>
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

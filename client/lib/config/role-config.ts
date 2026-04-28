export type UserRole = 'LECTURER' | 'ADMIN' | 'OFFICER' | 'COMMITTEE';

export interface RoleConfig {
  defaultPages: {
    [key: string]: {
      label: string;
      path: string;
      description: string;
    };
  };
  notificationTypes: {
    [key: string]: {
      label: string;
      description: string;
      enabled: boolean;
    };
  };
  theme: {
    default: 'light' | 'dark' | 'system';
    options: ('light' | 'dark' | 'system')[];
  };
  itemsPerPage: {
    default: number;
    options: number[];
  };
}

export const roleConfigs: Record<UserRole, RoleConfig> = {
  LECTURER: {
    defaultPages: {
      'my-applications': {
        label: 'My Applications',
        path: '/dashboard/lecturer/my-applications',
        description: 'View and manage your housing applications'
      },
      'new-application': {
        label: 'New Application',
        path: '/dashboard/lecturer/application',
        description: 'Create a new housing application'
      },
      'results': {
        label: 'Application Results',
        path: '/dashboard/lecturer/results',
        description: 'View your application results and status'
      },
      'support': {
        label: 'Support',
        path: '/dashboard/lecturer/support',
        description: 'Get help and support'
      }
    },
    notificationTypes: {
      applicationStatus: {
        label: 'Application Status Updates',
        description: 'Get notified when your application status changes',
        enabled: true
      },
      deadlineReminders: {
        label: 'Application Deadline Reminders',
        description: 'Reminders before application deadlines',
        enabled: true
      },
      resultNotifications: {
        label: 'Result Notifications',
        description: 'Notifications when results are available',
        enabled: true
      },
      systemUpdates: {
        label: 'System Updates',
        description: 'Important system announcements',
        enabled: false
      }
    },
    theme: {
      default: 'system',
      options: ['light', 'dark', 'system']
    },
    itemsPerPage: {
      default: 25,
      options: [10, 25, 50, 100]
    }
  },
  ADMIN: {
    defaultPages: {
      'dashboard': {
        label: 'Admin Dashboard',
        path: '/dashboard/admin',
        description: 'Main admin dashboard with overview'
      },
      'users': {
        label: 'User Management',
        path: '/dashboard/admin/users',
        description: 'Manage system users and permissions'
      },
      'applications': {
        label: 'Application Management',
        path: '/dashboard/admin/applications',
        description: 'Review and manage all applications'
      },
      'reports': {
        label: 'Reports',
        path: '/dashboard/admin/reports',
        description: 'Generate and view reports'
      },
      'settings': {
        label: 'System Settings',
        path: '/dashboard/admin/settings',
        description: 'Configure system settings'
      }
    },
    notificationTypes: {
      newApplications: {
        label: 'New Applications',
        description: 'Notifications when new applications are submitted',
        enabled: true
      },
      userRegistrations: {
        label: 'User Registrations',
        description: 'Notifications for new user registrations',
        enabled: true
      },
      systemAlerts: {
        label: 'System Alerts',
        description: 'Critical system alerts and issues',
        enabled: true
      },
      complianceIssues: {
        label: 'Compliance Issues',
        description: 'Compliance and policy violation alerts',
        enabled: true
      }
    },
    theme: {
      default: 'system',
      options: ['light', 'dark', 'system']
    },
    itemsPerPage: {
      default: 50,
      options: [10, 25, 50, 100]
    }
  },
  OFFICER: {
    defaultPages: {
      'dashboard': {
        label: 'Officer Dashboard',
        path: '/dashboard/officer',
        description: 'Main housing officer dashboard'
      },
      'applications': {
        label: 'Application Review',
        path: '/dashboard/officer/applications',
        description: 'Review and process applications'
      },
      'allocations': {
        label: 'Housing Allocations',
        path: '/dashboard/officer/allocations',
        description: 'Manage housing allocations'
      },
      'reports': {
        label: 'Reports',
        path: '/dashboard/officer/reports',
        description: 'View housing reports'
      }
    },
    notificationTypes: {
      applicationReviews: {
        label: 'Application Reviews',
        description: 'Notifications for applications requiring review',
        enabled: true
      },
      allocationUpdates: {
        label: 'Allocation Updates',
        description: 'Updates on housing allocations',
        enabled: true
      },
      urgentApplications: {
        label: 'Urgent Applications',
        description: 'Notifications for urgent housing requests',
        enabled: true
      },
      complianceAlerts: {
        label: 'Compliance Alerts',
        description: 'Compliance and policy alerts',
        enabled: true
      }
    },
    theme: {
      default: 'system',
      options: ['light', 'dark', 'system']
    },
    itemsPerPage: {
      default: 25,
      options: [10, 25, 50, 100]
    }
  },
  COMMITTEE: {
    defaultPages: {
      'dashboard': {
        label: 'Committee Dashboard',
        path: '/dashboard/committee',
        description: 'Main committee dashboard'
      },
      'reviews': {
        label: 'Application Reviews',
        path: '/dashboard/committee/reviews',
        description: 'Review applications as committee member'
      },
      'meetings': {
        label: 'Committee Meetings',
        path: '/dashboard/committee/meetings',
        description: 'View and manage committee meetings'
      },
      'decisions': {
        label: 'Decisions',
        path: '/dashboard/committee/decisions',
        description: 'View committee decisions'
      }
    },
    notificationTypes: {
      meetingReminders: {
        label: 'Meeting Reminders',
        description: 'Reminders for upcoming committee meetings',
        enabled: true
      },
      reviewRequests: {
        label: 'Review Requests',
        description: 'Notifications for application review requests',
        enabled: true
      },
      decisionUpdates: {
        label: 'Decision Updates',
        description: 'Updates on committee decisions',
        enabled: true
      },
      policyUpdates: {
        label: 'Policy Updates',
        description: 'Updates to housing policies and procedures',
        enabled: false
      }
    },
    theme: {
      default: 'system',
      options: ['light', 'dark', 'system']
    },
    itemsPerPage: {
      default: 25,
      options: [10, 25, 50, 100]
    }
  }
};

export function getRoleConfig(role: UserRole): RoleConfig {
  return roleConfigs[role] || roleConfigs.LECTURER;
}

export function getDefaultPageOptions(role: UserRole) {
  const config = getRoleConfig(role);
  return Object.entries(config.defaultPages).map(([key, page]) => ({
    value: key,
    label: page.label,
    description: page.description
  }));
}

export function getNotificationOptions(role: UserRole) {
  const config = getRoleConfig(role);
  return Object.entries(config.notificationTypes).map(([key, notification]) => ({
    value: key,
    label: notification.label,
    description: notification.description,
    enabled: notification.enabled
  }));
}

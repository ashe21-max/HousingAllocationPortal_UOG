import { pgTable, serial, text, timestamp, boolean, jsonb, varchar, integer, decimal } from 'drizzle-orm/pg-core';

// User Settings Table
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  department: varchar('department', { length: 100 }),
  position: varchar('position', { length: 100 }),
  staffId: varchar('staff_id', { length: 50 }),
  profileImage: varchar('profile_image', { length: 500 }),
  bio: text('bio'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  language: varchar('language', { length: 10 }).default('en'),
  dateFormat: varchar('date_format', { length: 20 }).default('MM/DD/YYYY'),
  timeFormat: varchar('time_format', { length: 10 }).default('12h'),
  emailNotifications: boolean('email_notifications').default(true),
  pushNotifications: boolean('push_notifications').default(true),
  smsNotifications: boolean('sms_notifications').default(false),
  theme: varchar('theme', { length: 20 }).default('light'),
  accentColor: varchar('accent_color', { length: 20 }).default('blue'),
  dashboardLayout: jsonb('dashboard_layout'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// System Settings Table
export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  settingKey: varchar('setting_key', { length: 255 }).notNull().unique(),
  settingValue: text('setting_value'),
  settingType: varchar('setting_type', { length: 50 }).default('string'),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  isEditable: boolean('is_editable').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Support Tickets Table
export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  priority: varchar('priority', { length: 20 }).default('medium'),
  status: varchar('status', { length: 20 }).default('open'),
  assignedTo: varchar('assigned_to', { length: 255 }),
  attachments: jsonb('attachments'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

// Support Ticket Responses Table
export const supportTicketResponses = pgTable('support_ticket_responses', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').notNull(),
  userId: varchar('user_id', { length: 255 }),
  response: text('response').notNull(),
  isInternal: boolean('is_internal').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// FAQ Table
export const faq = pgTable('faq', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags'),
  views: integer('views').default(0),
  helpful: integer('helpful').default(0),
  notHelpful: integer('not_helpful').default(0),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Chat Sessions Table
export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 }),
  messages: jsonb('messages'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Notification Preferences Table
export const notificationPreferences = pgTable('notification_preferences', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  notificationType: varchar('notification_type', { length: 100 }).notNull(),
  isEnabled: boolean('is_enabled').default(true),
  deliveryMethod: varchar('delivery_method', { length: 50 }).default('email'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Activity Log Table
export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  details: jsonb('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Types
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
export type SystemSettings = typeof systemSettings.$inferSelect;
export type NewSystemSettings = typeof systemSettings.$inferInsert;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type NewSupportTicket = typeof supportTickets.$inferInsert;
export type SupportTicketResponse = typeof supportTicketResponses.$inferSelect;
export type NewSupportTicketResponse = typeof supportTicketResponses.$inferInsert;
export type FAQ = typeof faq.$inferSelect;
export type NewFAQ = typeof faq.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type NewNotificationPreferences = typeof notificationPreferences.$inferInsert;
export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;

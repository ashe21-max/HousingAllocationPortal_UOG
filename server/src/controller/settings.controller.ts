import type { Request, Response } from 'express';
import { db } from '../lib/db/index.js';
import { users } from '../lib/db/schema/auth.js';
import { eq } from 'drizzle-orm';

// Get user settings
export async function getUserSettings(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user data
    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      department: users.department,
      isVerified: users.isVerified,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = user[0];
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    const nameParts = userData.name?.split(' ') || [];

    // Return settings data
    const settingsData = {
      personal: {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userData.email || '',
        phone: '',
        department: userData.department || '',
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

    res.json(settingsData);
  } catch (error) {
    console.error('Error getting user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update user settings
export async function updateUserSettings(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { personal, notifications, security } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update user personal information
    if (personal) {
      const updateData: any = {
        name: `${personal.firstName} ${personal.lastName}`,
        email: personal.email,
        department: personal.department
      };

      await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId));
    }

    // Handle password update if provided
    if (security && security.newPassword && security.currentPassword) {
      // TODO: Implement password update logic
      // This would involve verifying current password and updating with new one
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

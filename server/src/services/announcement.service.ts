import {
  findAnnouncements,
  findActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  findAnnouncementById,
} from '../repository/announcement.repository.js';

export async function listAnnouncements(filters?: {
  targetRoles?: string[];
  isActive?: boolean;
  createdBy?: string;
}) {
  return findAnnouncements(filters);
}

export async function getActiveAnnouncements(targetRoles?: string[]) {
  return findActiveAnnouncements(targetRoles);
}

export async function createAnnouncementService(input: {
  title: string;
  content: string;
  type: string;
  targetRoles?: string[];
  startsAt?: Date;
  endsAt?: Date;
  createdBy: string;
}) {
  return createAnnouncement(input);
}

export async function updateAnnouncementService(
  id: string,
  input: {
    title?: string;
    content?: string;
    type?: string;
    targetRoles?: string[];
    isActive?: boolean;
    startsAt?: Date;
    endsAt?: Date;
  }
) {
  return updateAnnouncement(id, input);
}

export async function deleteAnnouncementService(id: string) {
  return deleteAnnouncement(id);
}

export async function getAnnouncementById(id: string) {
  return findAnnouncementById(id);
}

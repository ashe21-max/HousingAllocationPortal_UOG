import type {
  CreateComplaintThreadDto,
  SendComplaintMessageDto,
} from '../dtos/complaint.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  createComplaintMessage,
  createComplaintThreadWithFirstMessage,
  findCommitteeComplaintThreads,
  findComplaintMessages,
  findComplaintThreadById,
  findLecturerComplaintThreads,
} from '../repository/complaint.repository.js';
import { findUserById } from '../repository/user.repository.js';
import {
  validateComplaintThreadId,
  validateCreateComplaintThreadInput,
  validateSendComplaintMessageInput,
} from '../validators/complaint.validator.js';

export async function createLecturerComplaintThread(
  lecturerUserId: string,
  input: CreateComplaintThreadDto,
) {
  const validated = validateCreateComplaintThreadInput(input);
  const created = await createComplaintThreadWithFirstMessage({
    lecturerUserId,
    targetDepartment: validated.targetDepartment,
    subject: validated.subject,
    message: validated.message,
  });

  if (!created) {
    throw new AppError(
      'Failed to create complaint thread',
      500,
      'COMPLAINT_CREATE_FAILED',
    );
  }

  return created;
}

export async function getLecturerComplaintThreads(lecturerUserId: string) {
  return findLecturerComplaintThreads(lecturerUserId);
}

export async function getLecturerComplaintThreadDetails(
  lecturerUserId: string,
  threadIdInput: string,
) {
  const threadId = validateComplaintThreadId(threadIdInput);
  const thread = await findComplaintThreadById(threadId);
  if (!thread || thread.lecturerUserId !== lecturerUserId) {
    throw new AppError('Complaint thread not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  const messages = await findComplaintMessages(threadId);
  return { thread, messages };
}

export async function sendLecturerComplaintMessage(
  lecturerUserId: string,
  threadIdInput: string,
  input: SendComplaintMessageDto,
) {
  const threadId = validateComplaintThreadId(threadIdInput);
  const thread = await findComplaintThreadById(threadId);
  if (!thread || thread.lecturerUserId !== lecturerUserId) {
    throw new AppError('Complaint thread not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  const payload = validateSendComplaintMessageInput(input);
  const message = await createComplaintMessage({
    threadId,
    senderUserId: lecturerUserId,
    message: payload.message,
  });

  if (!message) {
    throw new AppError(
      'Failed to send message',
      500,
      'COMPLAINT_MESSAGE_SEND_FAILED',
    );
  }

  return message;
}

export async function getCommitteeComplaintThreads(committeeUserId: string) {
  const committeeUser = await findUserById(committeeUserId);
  if (!committeeUser) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  const department = committeeUser.department?.trim();
  if (!department) {
    throw new AppError(
      'Committee profile has no department',
      400,
      'DEPARTMENT_REQUIRED',
    );
  }

  return findCommitteeComplaintThreads(department);
}

export async function getCommitteeComplaintThreadDetails(
  committeeUserId: string,
  threadIdInput: string,
) {
  const committeeUser = await findUserById(committeeUserId);
  if (!committeeUser) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  const department = committeeUser.department?.trim();
  if (!department) {
    throw new AppError(
      'Committee profile has no department',
      400,
      'DEPARTMENT_REQUIRED',
    );
  }

  const threadId = validateComplaintThreadId(threadIdInput);
  const thread = await findComplaintThreadById(threadId);
  if (!thread || thread.targetDepartment !== department) {
    throw new AppError('Complaint thread not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  const messages = await findComplaintMessages(threadId);
  return { thread, messages };
}

export async function sendCommitteeComplaintMessage(
  committeeUserId: string,
  threadIdInput: string,
  input: SendComplaintMessageDto,
) {
  const committeeUser = await findUserById(committeeUserId);
  if (!committeeUser) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  const department = committeeUser.department?.trim();
  if (!department) {
    throw new AppError(
      'Committee profile has no department',
      400,
      'DEPARTMENT_REQUIRED',
    );
  }

  const threadId = validateComplaintThreadId(threadIdInput);
  const thread = await findComplaintThreadById(threadId);
  if (!thread || thread.targetDepartment !== department) {
    throw new AppError('Complaint thread not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  const payload = validateSendComplaintMessageInput(input);
  const message = await createComplaintMessage({
    threadId,
    senderUserId: committeeUserId,
    message: payload.message,
  });

  if (!message) {
    throw new AppError(
      'Failed to send message',
      500,
      'COMPLAINT_MESSAGE_SEND_FAILED',
    );
  }

  return message;
}

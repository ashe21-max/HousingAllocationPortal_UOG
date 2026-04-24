import type {
  CreateComplaintThreadDto,
  SendComplaintMessageDto,
} from '../dtos/complaint.dto.js';
import type { UserDepartment } from '../dtos/create-user.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { allowedDepartments } from '../constants/user.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateComplaintThreadId(threadIdInput: string): string {
  const threadId = threadIdInput.trim();
  if (!threadId) {
    throw new AppError('Thread id is required', 400, 'VALIDATION_ERROR');
  }
  if (!uuidPattern.test(threadId)) {
    throw new AppError('Thread id must be a valid UUID', 400, 'VALIDATION_ERROR');
  }
  return threadId;
}

export function validateCreateComplaintThreadInput(input: CreateComplaintThreadDto) {
  const targetDepartment = input.targetDepartment?.trim();
  if (!targetDepartment) {
    throw new AppError('targetDepartment is required', 400, 'VALIDATION_ERROR');
  }
  if (!allowedDepartments.has(targetDepartment as UserDepartment)) {
    throw new AppError('targetDepartment is invalid', 400, 'VALIDATION_ERROR');
  }

  const subject = input.subject?.trim();
  if (!subject) {
    throw new AppError('subject is required', 400, 'VALIDATION_ERROR');
  }

  const message = input.message?.trim();
  if (!message) {
    throw new AppError('message is required', 400, 'VALIDATION_ERROR');
  }

  return { targetDepartment, subject, message };
}

export function validateSendComplaintMessageInput(input: SendComplaintMessageDto) {
  const message = input.message?.trim();
  if (!message) {
    throw new AppError('message is required', 400, 'VALIDATION_ERROR');
  }
  return { message };
}

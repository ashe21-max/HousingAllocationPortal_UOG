import { AppError } from '../errorHandler/app-error.js';
import type { PreviewCriteriaDto } from '../dtos/scoring.dto.js';

function requireNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new AppError(`${fieldName} must be a string`, 400, 'VALIDATION_ERROR');
  }
  const s = value.trim();
  if (!s) {
    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR');
  }
  return s;
}

function requireBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new AppError(`${fieldName} must be a boolean`, 400, 'VALIDATION_ERROR');
  }
  return value;
}

function requireServiceYears(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new AppError('serviceYears must be an integer', 400, 'VALIDATION_ERROR');
  }
  if (value < 0 || value > 60) {
    throw new AppError('serviceYears must be between 0 and 60', 400, 'VALIDATION_ERROR');
  }
  return value;
}

export function validatePreviewCriteriaInput(body: unknown): PreviewCriteriaDto {
  if (body === null || typeof body !== 'object') {
    throw new AppError('Request body must be a JSON object', 400, 'VALIDATION_ERROR');
  }

  const o = body as Record<string, unknown>;

  return {
    educationalTitle: requireNonEmptyString(o.educationalTitle, 'educationalTitle'),
    educationalLevel: requireNonEmptyString(o.educationalLevel, 'educationalLevel'),
    serviceYears: requireServiceYears(o.serviceYears),
    responsibility: requireNonEmptyString(o.responsibility, 'responsibility'),
    familyStatus: requireNonEmptyString(o.familyStatus, 'familyStatus'),
    femaleBonusEligible: requireBoolean(o.femaleBonusEligible, 'femaleBonusEligible'),
    disabilityBonusEligible: requireBoolean(
      o.disabilityBonusEligible,
      'disabilityBonusEligible',
    ),
    hivIllnessBonusEligible: requireBoolean(
      o.hivIllnessBonusEligible,
      'hivIllnessBonusEligible',
    ),
    spouseBonusEligible: requireBoolean(o.spouseBonusEligible, 'spouseBonusEligible'),
  };
}

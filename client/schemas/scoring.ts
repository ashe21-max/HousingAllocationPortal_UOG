import { z } from "zod";

export const lecturerCriteriaSchema = z.object({
  educationalTitle: z.string().min(2, "Educational title must be at least 2 characters."),
  educationalLevel: z.string().min(2, "Educational level must be at least 2 characters."),
  serviceYears: z.number().min(0, "Years of service cannot be negative.").max(60, "Years of service cannot exceed 60."),
  responsibility: z.string().min(2, "Please describe your responsibilities."),
  familyStatus: z.string().min(2, "Please describe your family status."),
  femaleBonusEligible: z.boolean(),
  disabilityBonusEligible: z.boolean(),
  hivIllnessBonusEligible: z.boolean(),
  spouseBonusEligible: z.boolean(),
});

export type LecturerCriteriaFormValues = z.infer<typeof lecturerCriteriaSchema>;

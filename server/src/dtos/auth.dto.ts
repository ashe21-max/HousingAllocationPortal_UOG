export type InitiateLoginDto = {
  email: string;
};

export type InitiateLoginResultDto = {
  success: true;
  userId: string;
  requiresPasswordSetup: boolean;
  expiresAt: Date;
};

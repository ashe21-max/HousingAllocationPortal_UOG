export type GenerateOtpDto = {
  userId: string;
};

export type GenerateOtpResultDto = {
  code: string;
  expiresAt: Date;
};

export type ResendOtpDto = {
  userId: string;
};

export type ResendOtpResultDto = {
  success: true;
  expiresAt: Date;
};

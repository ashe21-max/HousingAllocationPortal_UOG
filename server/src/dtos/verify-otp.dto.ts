export type VerifyOtpDto = {
  userId: string;
  code: string;
};

export type VerifyOtpResultDto = {
  success: true;
};

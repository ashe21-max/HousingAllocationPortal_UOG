export type SetPasswordDto = {
  userId: string;
  newPassword: string;
};

export type SetPasswordResultDto = {
  success: true;
};

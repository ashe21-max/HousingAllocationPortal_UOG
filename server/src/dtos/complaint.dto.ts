export type CreateComplaintThreadDto = {
  targetDepartment: string;
  subject: string;
  message: string;
};

export type SendComplaintMessageDto = {
  message: string;
};

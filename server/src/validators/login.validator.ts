import type { LoginDto } from '../dtos/login.dto.js';
import { validateEmail } from './email.validator.js';

export function validateLoginInput(input: LoginDto): LoginDto {
  const email = validateEmail(input.email);
  const password = typeof input.password === 'string' ? input.password : undefined;

  return {
    email,
    password,
  };
}

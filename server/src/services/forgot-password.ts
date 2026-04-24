import type {
  InitiateLoginDto,
  InitiateLoginResultDto,
} from '../dtos/auth.dto.js';

import { initiateLogin } from './initiate-login.js';

export async function forgotPassword(
  input: InitiateLoginDto,
): Promise<InitiateLoginResultDto> {
  return initiateLogin(input);
}

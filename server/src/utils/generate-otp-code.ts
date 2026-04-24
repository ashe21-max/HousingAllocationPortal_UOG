import { randomInt } from 'node:crypto';

const digits = '0123456789';
const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function pickCharacters(source: string, count: number): string[] {
  return Array.from({ length: count }, () => source[randomInt(0, source.length)]!);
}

function shuffle(values: string[]): string[] {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = randomInt(0, index + 1);
    [result[index], result[randomIndex]] = [result[randomIndex]!, result[index]!];
  }

  return result;
}

export function generateOtpCode(): string {
  const rawOtp = [
    ...pickCharacters(digits, 4),
    ...pickCharacters(uppercaseLetters, 2),
  ];

  return shuffle(rawOtp).join('');
}

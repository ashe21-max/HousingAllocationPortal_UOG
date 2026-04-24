import { eq } from 'drizzle-orm';
import { db } from '../lib/db/index.js';
import { otpCodes, users } from '../lib/db/schema/auth.js';

export async function replaceUserOtp(
  userId: string,
  code: string,
  expiresAt: Date,
) {
  return db.transaction(async (tx) => {
    await tx.delete(otpCodes).where(eq(otpCodes.userId, userId));

    const [createdOtp] = await tx
      .insert(otpCodes)
      .values({
        userId,
        code,
        expiresAt,
        attempts: 0,
        resendCount: 0,
      })
      .returning({
        code: otpCodes.code,
        expiresAt: otpCodes.expiresAt,
      });

    return createdOtp ?? null;
  });
}

export async function findOtpByUserId(userId: string) {
  const [otpRecord] = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.userId, userId))
    .limit(1);

  return otpRecord ?? null;
}

export async function resendUserOtp(
  userId: string,
  code: string,
  expiresAt: Date,
) {
  return db.transaction(async (tx) => {
    const [otpRecord] = await tx
      .select()
      .from(otpCodes)
      .where(eq(otpCodes.userId, userId))
      .limit(1);

    if (!otpRecord) {
      return { status: 'not_found' } as const;
    }

    if (otpRecord.resendCount >= 3) {
      return { status: 'limit_reached' } as const;
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return { status: 'expired' } as const;
    }

    const nextResendCount = otpRecord.resendCount + 1;

    const [updatedOtp] = await tx
      .update(otpCodes)
      .set({
        code,
        expiresAt,
        attempts: 0,
        resendCount: nextResendCount,
      })
      .where(eq(otpCodes.id, otpRecord.id))
      .returning({
        expiresAt: otpCodes.expiresAt,
        resendCount: otpCodes.resendCount,
      });

    if (!updatedOtp) {
      return { status: 'failed' } as const;
    }

    return {
      status: 'resent' as const,
      expiresAt: updatedOtp.expiresAt,
      resendCount: updatedOtp.resendCount,
    };
  });
}

type VerifyOtpRepositoryResult =
  | { status: 'not_found' }
  | { status: 'expired' }
  | { status: 'attempts_exceeded' }
  | { status: 'mismatch'; attempts: number }
  | { status: 'verified' };

export async function verifyOtpCode(
  userId: string,
  code: string,
  now: Date,
): Promise<VerifyOtpRepositoryResult> {
  return db.transaction(async (tx) => {
    const [otpRecord] = await tx
      .select()
      .from(otpCodes)
      .where(eq(otpCodes.userId, userId))
      .limit(1);

    if (!otpRecord) {
      return { status: 'not_found' };
    }

    if (otpRecord.expiresAt.getTime() < now.getTime()) {
      await tx.delete(otpCodes).where(eq(otpCodes.id, otpRecord.id));
      return { status: 'expired' };
    }

    if (otpRecord.attempts >= 3) {
      return { status: 'attempts_exceeded' };
    }

    if (otpRecord.code !== code) {
      const nextAttempts = otpRecord.attempts + 1;

      await tx
        .update(otpCodes)
        .set({ attempts: nextAttempts })
        .where(eq(otpCodes.id, otpRecord.id));

      return { status: 'mismatch', attempts: nextAttempts };
    }

    await tx
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userId));

    await tx.delete(otpCodes).where(eq(otpCodes.id, otpRecord.id));

    return { status: 'verified' };
  });
}

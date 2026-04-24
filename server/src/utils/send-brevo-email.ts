import { AppError } from '../errorHandler/app-error.js';

type BrevoRecipient = {
  email: string;
  name: string;
};
type SendBrevoEmailInput = {
  to: BrevoRecipient;
  subject: string;
  htmlContent: string;
};
export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
}: SendBrevoEmailInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME;

  if (!apiKey || !senderEmail || !senderName) {
    throw new AppError(
      'Brevo email configuration is missing',
      500,
      'BREVO_CONFIG_MISSING',
    );
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: [to],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const rawErrorBody = await response.text().catch(() => '');
    let providerMessage = '';

    if (rawErrorBody) {
      try {
        const parsedErrorBody = JSON.parse(rawErrorBody) as {
          message?: string;
          code?: string;
        };

        providerMessage = parsedErrorBody.message ?? parsedErrorBody.code ?? rawErrorBody;
      } catch {
        providerMessage = rawErrorBody;
      }
    }

    throw new AppError(
      providerMessage
        ? `Failed to send email: ${providerMessage}`
        : 'Failed to send email',
      502,
      'EMAIL_SEND_FAILED',
    );
  }
}

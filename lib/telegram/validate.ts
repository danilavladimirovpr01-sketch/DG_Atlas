import crypto from 'crypto';

/**
 * Validates Telegram Mini App initData using HMAC-SHA256.
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(initData: string): {
  valid: boolean;
  data: Record<string, string>;
} {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');

  // Sort params alphabetically
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const data: Record<string, string> = {};
  params.forEach((value, key) => {
    data[key] = value;
  });

  return {
    valid: calculatedHash === hash,
    data,
  };
}

export function parseTelegramUser(initData: Record<string, string>) {
  try {
    const user = JSON.parse(initData.user || '{}');
    return {
      id: String(user.id),
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      username: user.username || '',
    };
  } catch {
    return null;
  }
}

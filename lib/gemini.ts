import { google } from '@ai-sdk/google';

export const model = google('gemini-3.6-flash');

export const generateOptions = { maxRetries: 0 as const };

export function apiErrorMessage(e: unknown) {
  const raw = e instanceof Error ? e.message : String(e);
  const retry = raw.match(/retry in ([\d.]+)\s*s/i);
  const seconds = retry ? Math.ceil(Number(retry[1])) : null;
  if (/quota|rate.?limit|exceeded your current quota/i.test(raw)) {
    return seconds
      ? `Gemini free quota is used up. Try again in ${seconds}s.`
      : 'Gemini free quota is used up. Try again later.';
  }
  return raw || 'Request failed';
}

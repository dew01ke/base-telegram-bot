export function safeJsonParse(text: string, fallback = {}): any {
  try {
    return JSON.parse(text);
  } catch (err) {}

  return fallback;
}

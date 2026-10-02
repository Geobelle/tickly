export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function getAuthErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      errors?: Array<{ longMessage?: string; message?: string }>;
      message?: string;
    };
    return candidate.errors?.[0]?.longMessage ?? candidate.errors?.[0]?.message ?? candidate.message;
  }
  return undefined;
}

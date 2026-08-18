export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const STRENGTH_KEYS = [
  "passwordStrength.veryWeak",
  "passwordStrength.weak",
  "passwordStrength.fair",
  "passwordStrength.strong",
  "passwordStrength.veryStrong",
] as const;

export function getPasswordStrength(password: string): StrengthLevel {
  if (password.length === 0) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 10) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  return Math.min(score, 4) as StrengthLevel;
}

export function getStrengthKey(level: StrengthLevel): string {
  return STRENGTH_KEYS[level];
}

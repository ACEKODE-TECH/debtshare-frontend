export type GroupIconKey =
  "flight" | "home" | "food" | "party" | "sports" | "beach" | "mountain" | "city" | "music" | "car";

export const GROUP_ICON_ORDER: GroupIconKey[] = [
  "flight",
  "home",
  "food",
  "party",
  "sports",
  "beach",
  "mountain",
  "city",
  "music",
  "car",
];

export const GROUP_ICON_EMOJI: Record<GroupIconKey, string> = {
  flight: "✈️",
  home: "🏠",
  food: "🍽️",
  party: "🎉",
  sports: "⚽",
  beach: "🏖️",
  mountain: "🏔️",
  city: "🌆",
  music: "🎵",
  car: "🚗",
};

/** Bg + fg tokens for the group icon tile — one per icon, from the accent palette. */
export const GROUP_ICON_TINT: Record<GroupIconKey, { bg: string; fg: string }> = {
  flight: { bg: "bg-brand-subtle", fg: "text-brand-default" },
  home: { bg: "bg-feedback-success-subtle", fg: "text-feedback-success" },
  food: { bg: "bg-accent-mustard-subtle", fg: "text-accent-mustard-strong" },
  party: { bg: "bg-accent-plum-subtle", fg: "text-accent-plum" },
  sports: { bg: "bg-brand-secondary-subtle", fg: "text-brand-secondary" },
  beach: { bg: "bg-feedback-warning-subtle-strong", fg: "text-feedback-warning-strong" },
  mountain: { bg: "bg-feedback-success-subtle-strong", fg: "text-feedback-success" },
  city: { bg: "bg-brand-subtle", fg: "text-brand-default" },
  music: { bg: "bg-accent-plum-subtle", fg: "text-accent-plum" },
  car: { bg: "bg-feedback-danger-subtle", fg: "text-feedback-danger" },
};

export function getGroupEmoji(icon: string): string {
  return (GROUP_ICON_EMOJI as Record<string, string>)[icon] ?? "👥";
}

export function getGroupIconTint(icon: string): { bg: string; fg: string } {
  return (GROUP_ICON_TINT as Record<string, { bg: string; fg: string }>)[icon] ?? GROUP_ICON_TINT.flight;
}

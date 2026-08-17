import { useTranslation } from "react-i18next";

import { StarIcon } from "./icons";

export function BrandPanel() {
  const { t } = useTranslation("auth");

  return (
    <div className="relative hidden w-[520px] flex-col overflow-hidden p-4xl text-text-on-brand lg:flex bg-gradient-to-br from-brand-default to-[var(--color-brand-primary-light)]">
      <div className="absolute -right-[80px] -top-[80px] h-[280px] w-[280px] rounded-pill bg-[rgba(255,255,255,0.08)]" />
      <div className="absolute -bottom-[100px] -left-[60px] h-[220px] w-[220px] rounded-pill bg-[rgba(255,255,255,0.06)]" />

      <div className="relative z-[1] flex items-center gap-sm-plus">
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[10px]">
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <span className="text-display-sm font-extrabold tracking-[-0.6px]">
          {t("appName", { ns: "common" })}
        </span>
      </div>

      <div className="relative z-[1] mt-auto">
        <h1 className="mb-xl text-display-lg font-extrabold leading-[1.05] tracking-[-1.4px]">
          {t("tagline", { ns: "common" })}
        </h1>
        <p className="mb-[36px] max-w-[380px] text-xl leading-[1.55] text-[rgba(255,255,255,0.85)]">
          {t("taglineDescription", { ns: "common" })}
        </p>

        <div className="max-w-[380px] rounded-xl border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.15)] p-lg-plus backdrop-blur-[20px]">
          <div className="mb-sm-plus flex gap-[1px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p className="mb-md text-[13.5px] leading-[1.5] text-[rgba(255,255,255,0.95)]">
            {t("login.testimonial")}
          </p>
          <div className="flex items-center gap-sm-plus">
            <div className="h-[28px] w-[28px] rounded-pill bg-[rgba(255,255,255,0.3)] border-2 border-[rgba(255,255,255,0.4)]" />
            <span className="text-md-plus font-semibold">{t("login.testimonialAuthor")}</span>
          </div>
        </div>

        <div className="mt-3xl flex gap-xl-plus text-md-plus text-[rgba(255,255,255,0.8)]">
          <div>
            <span className="text-display-xs font-extrabold tracking-[-0.4px] text-[rgba(255,255,255,1)]">
              {t("login.statGroupsValue")}
            </span>{" "}
            {t("login.statGroups")}
          </div>
          <div>
            <span className="text-display-xs font-extrabold tracking-[-0.4px] text-[rgba(255,255,255,1)]">
              {t("login.statRatingValue")}
            </span>{" "}
            {t("login.statRating")}
          </div>
        </div>
      </div>
    </div>
  );
}

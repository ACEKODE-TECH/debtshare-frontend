import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Button } from "@/shared/components/ui";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { cn } from "@/shared/lib/cn";
import { ApiError } from "@/shared/lib/api";
import { useThemeStore } from "@/shared/stores/theme-store";

import { useGoogleLogin, useLogin } from "../api/use-login";
import { BrandPanel } from "../components/BrandPanel";
import { DebtshareLogoMark } from "../components/DebtshareLogoMark";
import { GoogleIcon } from "../components/GoogleIcon";
import { CheckIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "../components/icons";
import { loginSchema, type LoginFormData } from "../schemas/login-schema";

const CURRENT_YEAR = new Date().getFullYear();

const INPUT_BASE = cn(
  "flex items-center gap-sm-plus rounded-lg border px-md-plus",
  "bg-surface-card transition-[border-color,box-shadow] duration-150",
);

const INPUT_DEFAULT = cn(
  "border-border-strong",
  "focus-within:border-brand-default focus-within:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
);

const INPUT_ERROR = "border-feedback-danger shadow-[0_0_0_3px_var(--color-semantic-error-tint)]";

const INPUT_FIELD =
  "min-h-4xl flex-1 bg-transparent text-lg font-medium text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const isDark = useThemeStore((s) => s.theme === "dark");
  const { t } = useTranslation();
  const { t: tAuth } = useTranslation("auth");

  const login = useLogin();
  const googleLogin = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  const apiError = login.error instanceof ApiError ? login.error.message : null;
  const googleError = googleLogin.error instanceof ApiError ? googleLogin.error.message : null;
  const serverError = apiError || googleError;
  const isSubmitting = login.isPending || googleLogin.isPending;

  return (
    <div className="flex min-h-dvh bg-surface-bg">
      <BrandPanel />

      <div className="flex flex-1 flex-col px-[28px] py-2xl lg:px-[72px] lg:py-[56px]">
        {/* Desktop header */}
        <div className="mb-auto hidden items-center justify-end gap-md text-base text-text-tertiary lg:flex">
          <span>
            {tAuth("login.noAccount")}
            <Link
              to="/register"
              className="ml-xs font-bold text-brand-default no-underline hover:text-brand-hover transition-colors duration-150"
            >
              {tAuth("login.createAccount")}
            </Link>
          </span>
          <ThemeToggle />
        </div>

        {/* Mobile header */}
        <div className="mb-4xl flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-sm-plus">
            <DebtshareLogoMark size="sm" />
            <span className="text-display-xs font-extrabold tracking-[-0.6px] text-text-primary">
              {t("appName")}
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Form container */}
        <div className="mx-auto w-full max-w-[400px]">
          {/* Mobile heading */}
          <h1 className="mb-sm-plus text-display-md font-extrabold leading-[1.15] tracking-[-1px] text-text-primary lg:hidden whitespace-pre-line">
            {tAuth("login.mobileTitle")}
          </h1>
          <p className="mb-3xl text-lg leading-[1.45] text-text-tertiary lg:hidden whitespace-pre-line">
            {tAuth("login.mobileSubtitle")}
          </p>

          {/* Desktop heading */}
          <h1 className="mb-xs hidden text-display-md font-extrabold tracking-[-0.8px] text-text-primary lg:block">
            {tAuth("login.title")}
          </h1>
          <p className="mb-[28px] hidden text-lg text-text-tertiary lg:block">{tAuth("login.subtitle")}</p>

          {/* Server error */}
          {serverError && (
            <div className="mb-lg rounded-lg border border-feedback-danger-subtle-strong bg-feedback-danger-subtle px-md-plus py-md text-lg font-medium text-feedback-danger">
              {serverError}
            </div>
          )}

          {/* Google button */}
          <Button
            intent="secondary"
            fullWidth
            className={cn(
              "mb-xl gap-sm-plus !shadow-xs !font-semibold",
              isDark
                ? "!bg-[var(--color-neutral-0)] !text-[var(--color-neutral-800)] !border-[var(--color-neutral-300)] hover:!bg-[var(--color-neutral-75)]"
                : "!border-border-strong",
            )}
            onClick={() => googleLogin.mutate()}
            loading={googleLogin.isPending}
            disabled={isSubmitting}
            leftIcon={<GoogleIcon />}
          >
            {t("continueWithGoogle")}
          </Button>

          {/* Divider */}
          <div className="my-xl flex items-center gap-md lg:mb-xl lg:mt-sm">
            <div className="h-px flex-1 bg-border-divider" />
            <span className="text-sm-plus font-medium tracking-[0.3px] text-text-muted">
              {t("emailDivider")}
            </span>
            <div className="h-px flex-1 bg-border-divider" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="mb-md-plus">
              <label htmlFor="login-email" className="mb-xs block text-md font-semibold text-text-tertiary">
                {t("email")}
              </label>
              <div className={cn(INPUT_BASE, errors.email ? INPUT_ERROR : INPUT_DEFAULT)}>
                <MailIcon className="flex-none text-text-muted" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  disabled={isSubmitting}
                  className={INPUT_FIELD}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-2xs text-md font-semibold text-feedback-danger">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-md-plus">
              <div className="mb-xs flex items-center justify-between">
                <label htmlFor="login-password" className="text-md font-semibold text-text-tertiary">
                  {t("password")}
                </label>
                <button
                  type="button"
                  className="text-md font-semibold text-brand-default hover:text-brand-hover transition-colors duration-150"
                  tabIndex={-1}
                >
                  {t("forgotPassword")}
                </button>
              </div>
              <div className={cn(INPUT_BASE, errors.password ? INPUT_ERROR : INPUT_DEFAULT)}>
                <LockIcon
                  className={cn("flex-none", errors.password ? "text-feedback-danger" : "text-text-muted")}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("passwordPlaceholder")}
                  disabled={isSubmitting}
                  className={INPUT_FIELD}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex-none text-text-tertiary hover:text-text-secondary transition-colors duration-150"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2xs text-md font-semibold text-feedback-danger">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <label className="mb-xl-plus flex cursor-pointer items-center gap-sm text-md-plus font-medium text-text-secondary">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe((v) => !v)}
                className={cn(
                  "flex h-lg w-lg flex-none items-center justify-center rounded-[5px] transition-colors duration-150",
                  rememberMe ? "bg-brand-default" : "border border-border-stronger bg-surface-card",
                )}
              >
                {rememberMe && <CheckIcon />}
              </button>
              {t("rememberDevice")}
            </label>

            {/* Submit */}
            <Button
              type="submit"
              intent="primary"
              fullWidth
              loading={login.isPending}
              disabled={isSubmitting}
              className="!font-bold !shadow-lg"
            >
              {tAuth("login.submit")}
            </Button>
          </form>

          {/* Terms — desktop */}
          <p className="mt-xl-plus hidden text-center text-sm-plus leading-[1.5] text-text-muted lg:block">
            {t("termsNotice")}
            <br />
            <button
              type="button"
              className="font-semibold text-text-tertiary hover:text-text-secondary transition-colors duration-150"
            >
              {t("terms")}
            </button>
            {` ${t("termsJoiner")} `}
            <button
              type="button"
              className="font-semibold text-text-tertiary hover:text-text-secondary transition-colors duration-150"
            >
              {t("privacy")}
            </button>
          </p>
        </div>

        {/* Mobile sign-up link */}
        <p className="mt-2xl text-center text-base text-text-tertiary lg:hidden">
          {tAuth("login.mobileNoAccount")}{" "}
          <Link to="/register" className="font-bold text-brand-default no-underline">
            {tAuth("login.createAccount")}
          </Link>
        </p>

        {/* Footer — desktop */}
        <div className="mt-auto hidden items-center justify-between text-sm-plus text-text-muted lg:flex">
          <span>{t("copyright", { year: CURRENT_YEAR })}</span>
          <div className="flex gap-lg">
            <span>{t("language")}</span>
            <span>{t("help")}</span>
            <span>{t("status")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

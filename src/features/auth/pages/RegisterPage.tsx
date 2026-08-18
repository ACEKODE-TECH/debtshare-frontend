import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { Button } from "@/shared/components/ui";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { cn } from "@/shared/lib/cn";
import { ApiError } from "@/shared/lib/api";

import { useCheckAlias } from "../api/use-check-alias";
import { useRegister } from "../api/use-register";
import { BrandPanel } from "../components/BrandPanel";
import {
  AlertCircleIcon,
  CheckIcon,
  CheckSmallIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  XCircleIcon,
} from "../components/icons";
import { getPasswordStrength, getStrengthKey } from "../lib/password-strength";
import { createRegisterSchema, type RegisterFormData } from "../schemas/register-schema";

const CURRENT_YEAR = new Date().getFullYear();
const DEBOUNCE_MS = 500;

const INPUT_BASE = cn(
  "flex items-center gap-sm-plus rounded-lg border px-md-plus",
  "bg-surface-card transition-[border-color,box-shadow] duration-150",
);

const INPUT_DEFAULT = cn(
  "border-border-strong",
  "focus-within:border-brand-default focus-within:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
);

const INPUT_ERROR = "border-feedback-danger shadow-[0_0_0_3px_var(--color-semantic-error-tint)]";

const INPUT_SUCCESS = "border-feedback-success shadow-[0_0_0_3px_var(--color-semantic-success-tint)]";

const INPUT_CHECKING = cn("border-brand-default", "shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]");

const INPUT_FIELD =
  "min-h-4xl flex-1 bg-transparent text-lg font-medium text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed";

const STRENGTH_COLORS: Record<number, string> = {
  0: "bg-border-divider",
  1: "bg-feedback-danger",
  2: "bg-feedback-warning",
  3: "bg-feedback-success",
  4: "bg-feedback-success",
};

const STRENGTH_TEXT_COLORS: Record<number, string> = {
  0: "text-text-muted",
  1: "text-feedback-danger",
  2: "text-feedback-warning",
  3: "text-feedback-success",
  4: "text-feedback-success",
};

function useDebounced(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { t: tAuth } = useTranslation("auth");
  const navigate = useNavigate();

  const registerMutation = useRegister();

  const schema = useMemo(() => createRegisterSchema(), []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: { alias: "", email: "", password: "", acceptTerms: false as unknown as true },
    mode: "onChange",
  });

  const aliasValue = useWatch({ control, name: "alias" });
  const passwordValue = useWatch({ control, name: "password" });
  const acceptTermsValue = useWatch({ control, name: "acceptTerms" });

  const debouncedAlias = useDebounced(aliasValue || "", DEBOUNCE_MS);
  const aliasCheck = useCheckAlias(debouncedAlias);

  const aliasFieldError = errors.alias?.message;
  const isAliasChecking =
    !aliasFieldError &&
    aliasValue &&
    aliasValue.length >= 3 &&
    (debouncedAlias !== aliasValue || aliasCheck.isLoading);
  const isAliasAvailable =
    !aliasFieldError &&
    !isAliasChecking &&
    aliasCheck.data?.available === true &&
    debouncedAlias === aliasValue;
  const isAliasTaken =
    !aliasFieldError &&
    !isAliasChecking &&
    aliasCheck.data?.available === false &&
    debouncedAlias === aliasValue;

  const passwordStrength = getPasswordStrength(passwordValue || "");
  const strengthKey = getStrengthKey(passwordStrength);

  const isEmailTaken =
    registerMutation.error instanceof ApiError &&
    registerMutation.error.status === 409 &&
    registerMutation.error.message.toLowerCase().includes("email");

  const isAliasTakenServer =
    registerMutation.error instanceof ApiError &&
    registerMutation.error.status === 409 &&
    registerMutation.error.message.toLowerCase().includes("alias");

  const serverError =
    registerMutation.error instanceof ApiError && !isEmailTaken && !isAliasTakenServer
      ? registerMutation.error.message
      : null;

  const canSubmit =
    isValid && !isAliasChecking && !isAliasTaken && isAliasAvailable && !registerMutation.isPending;

  const onSubmit = useCallback(
    (data: RegisterFormData) => {
      if (!isAliasAvailable) return;
      registerMutation.mutate(
        {
          name: data.alias,
          alias: data.alias,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => navigate("/app"),
          onError: (error) => {
            if (error instanceof ApiError && error.status === 409) {
              if (error.message.toLowerCase().includes("alias")) {
                setError("alias", { message: t("aliasTaken") });
              }
            }
          },
        },
      );
    },
    [isAliasAvailable, registerMutation, navigate, setError, t],
  );

  const getAliasInputStyle = () => {
    if (aliasFieldError || isAliasTaken || isAliasTakenServer) return INPUT_ERROR;
    if (isAliasChecking) return INPUT_CHECKING;
    if (isAliasAvailable) return INPUT_SUCCESS;
    return INPUT_DEFAULT;
  };

  return (
    <div className="flex min-h-dvh bg-surface-bg">
      <BrandPanel variant="register" />

      <div className="flex flex-1 flex-col px-[28px] py-2xl lg:px-[72px] lg:py-[56px]">
        {/* Desktop header */}
        <div className="mb-auto hidden items-center justify-end gap-md text-base text-text-tertiary lg:flex">
          <span>
            {tAuth("register.hasAccount")}
            <Link
              to="/login"
              className="ml-xs font-bold text-brand-default no-underline hover:text-brand-hover transition-colors duration-150"
            >
              {tAuth("register.signIn")}
            </Link>
          </span>
          <ThemeToggle />
        </div>

        {/* Mobile header */}
        <div className="mb-4xl flex items-center justify-between lg:hidden">
          <Link
            to="/login"
            className="flex h-[36px] w-[36px] items-center justify-center rounded-lg border border-border-strong bg-surface-card text-text-secondary no-underline hover:bg-surface-subtle transition-colors duration-150"
          >
            <ChevronLeftIcon />
          </Link>
          <ThemeToggle />
        </div>

        {/* Form container */}
        <div className="mx-auto w-full max-w-[400px]">
          {/* Mobile heading */}
          <h1 className="mb-sm-plus text-display-md font-extrabold leading-[1.15] tracking-[-1px] text-text-primary lg:hidden">
            {tAuth("register.mobileTitle")}
          </h1>
          <p className="mb-3xl text-lg leading-[1.45] text-text-tertiary lg:hidden">
            {tAuth("register.mobileSubtitle")}
          </p>

          {/* Desktop heading */}
          <h1 className="mb-xs hidden text-display-md font-extrabold tracking-[-0.8px] text-text-primary lg:block">
            {tAuth("register.title")}
          </h1>
          <p className="mb-[28px] hidden text-lg text-text-tertiary lg:block">{tAuth("register.subtitle")}</p>

          {/* Server error */}
          {serverError && (
            <div className="mb-lg rounded-lg border border-feedback-danger-subtle-strong bg-feedback-danger-subtle px-md-plus py-md text-lg font-medium text-feedback-danger">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Alias */}
            <div className="mb-md-plus">
              <label
                htmlFor="register-alias"
                className="mb-xs block text-md font-semibold text-text-tertiary"
              >
                {t("aliasPublic")}
              </label>
              <div className={cn(INPUT_BASE, getAliasInputStyle())}>
                <span className="flex-none text-lg font-semibold text-text-muted">@</span>
                <input
                  id="register-alias"
                  type="text"
                  autoComplete="username"
                  placeholder="tu.alias"
                  disabled={registerMutation.isPending}
                  className={INPUT_FIELD}
                  {...register("alias")}
                />
                {isAliasChecking && (
                  <div className="h-[16px] w-[16px] flex-none animate-spin rounded-pill border-2 border-brand-default border-t-transparent" />
                )}
                {isAliasAvailable && <CheckSmallIcon className="flex-none text-feedback-success" />}
                {(isAliasTaken || isAliasTakenServer) && (
                  <XCircleIcon className="flex-none text-feedback-danger" />
                )}
              </div>
              {!aliasFieldError && !isAliasTaken && !isAliasTakenServer && !isAliasAvailable && (
                <p className="mt-2xs text-md text-text-muted">{t("aliasHint")}</p>
              )}
              {isAliasAvailable && (
                <p className="mt-2xs text-md font-semibold text-feedback-success">{t("aliasAvailable")}</p>
              )}
              {isAliasChecking && (
                <p className="mt-2xs text-md font-semibold text-brand-default">{t("aliasChecking")}</p>
              )}
              {(isAliasTaken || isAliasTakenServer) && (
                <p className="mt-2xs text-md font-semibold text-feedback-danger">{t("aliasTaken")}</p>
              )}
              {aliasFieldError && (
                <p className="mt-2xs text-md font-semibold text-feedback-danger">{aliasFieldError}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-md-plus">
              <label
                htmlFor="register-email"
                className="mb-xs block text-md font-semibold text-text-tertiary"
              >
                {t("email")}
              </label>
              <div className={cn(INPUT_BASE, errors.email || isEmailTaken ? INPUT_ERROR : INPUT_DEFAULT)}>
                <MailIcon className="flex-none text-text-muted" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  disabled={registerMutation.isPending}
                  className={INPUT_FIELD}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-2xs text-md font-semibold text-feedback-danger">{errors.email.message}</p>
              )}
              {isEmailTaken && (
                <div className="mt-sm flex items-start gap-xs rounded-lg border border-feedback-danger-subtle-strong bg-feedback-danger-subtle px-md py-sm">
                  <AlertCircleIcon className="mt-[2px] text-feedback-danger" />
                  <p className="text-md text-feedback-danger">
                    {tAuth("register.emailTaken")}{" "}
                    <Link to="/login" className="font-bold text-feedback-danger underline">
                      {tAuth("register.emailTakenSignIn")}
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-md-plus">
              <label
                htmlFor="register-password"
                className="mb-xs block text-md font-semibold text-text-tertiary"
              >
                {t("password")}
              </label>
              <div className={cn(INPUT_BASE, errors.password ? INPUT_ERROR : INPUT_DEFAULT)}>
                <LockIcon
                  className={cn("flex-none", errors.password ? "text-feedback-danger" : "text-text-muted")}
                />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("passwordPlaceholder")}
                  disabled={registerMutation.isPending}
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

              {/* Strength meter */}
              {(passwordValue?.length ?? 0) > 0 && (
                <div className="mt-sm">
                  <div className="flex gap-xs">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={cn(
                          "h-[4px] flex-1 rounded-pill transition-colors duration-200",
                          passwordStrength >= bar ? STRENGTH_COLORS[passwordStrength] : "bg-border-divider",
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn("mt-2xs text-md font-medium", STRENGTH_TEXT_COLORS[passwordStrength])}>
                    {t(strengthKey)}
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="mb-xl-plus flex cursor-pointer items-start gap-sm text-md-plus font-medium text-text-secondary">
              <button
                type="button"
                role="checkbox"
                aria-checked={!!acceptTermsValue}
                onClick={() => {
                  const input = document.getElementById("register-terms") as HTMLInputElement | null;
                  if (input) {
                    input.click();
                  }
                }}
                className={cn(
                  "mt-[2px] flex h-lg w-lg flex-none items-center justify-center rounded-[5px] transition-colors duration-150",
                  acceptTermsValue ? "bg-brand-default" : "border border-border-stronger bg-surface-card",
                )}
              >
                {acceptTermsValue && <CheckIcon />}
              </button>
              <input id="register-terms" type="checkbox" className="sr-only" {...register("acceptTerms")} />
              <span>
                {t("acceptTermsPrefix")}{" "}
                <button
                  type="button"
                  className="font-semibold text-brand-default hover:text-brand-hover transition-colors duration-150"
                >
                  {t("terms")}
                </button>
                {` ${t("acceptTermsJoiner")} `}
                <button
                  type="button"
                  className="font-semibold text-brand-default hover:text-brand-hover transition-colors duration-150"
                >
                  {t("privacy")}
                </button>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="-mt-xl mb-lg text-md font-semibold text-feedback-danger">
                {errors.acceptTerms.message}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              intent="primary"
              fullWidth
              loading={registerMutation.isPending}
              disabled={!canSubmit}
              className="!font-bold !shadow-lg"
            >
              {tAuth("register.submit")}
            </Button>
          </form>
        </div>

        {/* Mobile sign-in link */}
        <p className="mt-2xl text-center text-base text-text-tertiary lg:hidden">
          {tAuth("register.hasAccount")}{" "}
          <Link to="/login" className="font-bold text-brand-default no-underline">
            {tAuth("register.signIn")}
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

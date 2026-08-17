import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { Button } from "@/shared/components/ui";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { cn } from "@/shared/lib/cn";
import { ApiError } from "@/shared/lib/api";
import { useThemeStore } from "@/shared/stores/theme-store";

import { useGoogleLogin, useLogin } from "../api/use-login";
import { DebtshareLogoMark } from "../components/DebtshareLogoMark";
import { GoogleIcon } from "../components/GoogleIcon";
import { loginSchema, type LoginFormData } from "../schemas/login-schema";

// ---------------------------------------------------------------------------
// Icons (inline — small, auth-only, not reused elsewhere)
// ---------------------------------------------------------------------------

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
        stroke="currentColor"
      />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="#fbbf24" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="3.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Brand panel (left side — desktop only)
// ---------------------------------------------------------------------------

function BrandPanel() {
  return (
    <div className="relative hidden w-[520px] flex-col overflow-hidden p-[44px] text-text-on-brand lg:flex bg-gradient-to-br from-brand-default to-[var(--color-brand-primary-light)] [html[data-theme='dark']_&]:from-[var(--color-brand-primary-tint-dark)] [html[data-theme='dark']_&]:to-brand-default">
      {/* Decorative shapes */}
      <div className="absolute -right-[80px] -top-[80px] h-[280px] w-[280px] rounded-pill bg-[rgba(255,255,255,0.08)]" />
      <div className="absolute -bottom-[100px] -left-[60px] h-[220px] w-[220px] rounded-pill bg-[rgba(255,255,255,0.06)]" />

      {/* Logo */}
      <div className="relative z-[1] flex items-center gap-sm-plus">
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[10px]">
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <span className="text-display-sm font-extrabold tracking-[-0.6px]">Debtshare</span>
      </div>

      {/* Tagline + testimonial */}
      <div className="relative z-[1] mt-auto">
        <h1 className="mb-xl text-display-lg font-extrabold leading-[1.05] tracking-[-1.4px]">
          Cuentas claras,
          <br />
          amistades largas.
        </h1>
        <p className="mb-[36px] max-w-[380px] text-xl leading-[1.55] text-[rgba(255,255,255,0.85)]">
          Divide gastos, escanea tickets y liquida al instante. Todo lo que compartes, en un solo sitio.
        </p>

        {/* Testimonial card */}
        <div className="max-w-[380px] rounded-xl border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.15)] p-lg-plus backdrop-blur-[20px]">
          <div className="mb-sm-plus flex gap-[1px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p className="mb-md text-[13.5px] leading-[1.5] text-[rgba(255,255,255,0.95)]">
            "Compartimos piso 4 personas y nunca supimos quién debía qué. Con Debtshare tardamos 10 segundos
            en cerrar el mes."
          </p>
          <div className="flex items-center gap-sm-plus">
            <div className="h-[28px] w-[28px] rounded-pill bg-[rgba(255,255,255,0.3)] border-2 border-[rgba(255,255,255,0.4)]" />
            <span className="text-md-plus font-semibold">Ana G. · Madrid</span>
          </div>
        </div>

        <div className="mt-3xl flex gap-xl-plus text-md-plus text-[rgba(255,255,255,0.8)]">
          <div>
            <span className="text-display-xs font-extrabold tracking-[-0.4px] text-white">12k+</span> grupos
            activos
          </div>
          <div>
            <span className="text-display-xs font-extrabold tracking-[-0.4px] text-white">4.9★</span> App
            Store
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const isDark = useThemeStore((s) => s.theme === "dark");

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
    <div className="flex min-h-dvh bg-surface-bg [html[data-theme='dark']_&]:bg-[var(--color-surface-dark-bg)]">
      <BrandPanel />

      {/* Form side */}
      <div className="flex flex-1 flex-col px-[28px] py-[24px] lg:px-[72px] lg:py-[56px]">
        {/* Top-right link (desktop) */}
        <div className="mb-auto hidden items-center justify-end gap-md text-base text-text-tertiary lg:flex">
          <span>
            ¿Nuevo por aquí?
            <Link
              to="/register"
              className="ml-xs font-bold text-brand-default no-underline hover:text-brand-hover transition-colors duration-150"
            >
              Crear cuenta
            </Link>
          </span>
          <ThemeToggle />
        </div>

        {/* Mobile header */}
        <div className="mb-4xl flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-sm-plus">
            <DebtshareLogoMark size="sm" />
            <span className="text-display-xs font-extrabold tracking-[-0.6px] text-text-primary">
              Debtshare
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Form container */}
        <div className="mx-auto w-full max-w-[400px]">
          {/* Mobile heading */}
          <h1 className="mb-sm-plus text-display-md font-extrabold leading-[1.15] tracking-[-1px] text-text-primary lg:hidden">
            Bienvenido
            <br />
            de vuelta
          </h1>
          <p className="mb-3xl text-lg leading-[1.45] text-text-tertiary lg:hidden">
            Gestiona los gastos compartidos
            <br />
            de tu grupo en segundos.
          </p>

          {/* Desktop heading */}
          <h1 className="mb-xs hidden text-[32px] font-extrabold tracking-[-0.8px] text-text-primary lg:block">
            Iniciar sesión
          </h1>
          <p className="mb-[28px] hidden text-lg text-text-tertiary lg:block">Retomamos donde lo dejaste.</p>

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
                ? "!bg-[#ffffff] !text-[#1f2937] !border-[#e5e7eb] hover:!bg-[#f9fafb]"
                : "!border-border-strong",
            )}
            onClick={() => googleLogin.mutate()}
            loading={googleLogin.isPending}
            disabled={isSubmitting}
            leftIcon={<GoogleIcon />}
          >
            Continuar con Google
          </Button>

          {/* Divider */}
          <div className="my-xl flex items-center gap-md lg:mb-xl lg:mt-sm">
            <div className="h-px flex-1 bg-border-strong [html[data-theme='dark']_&]:bg-[var(--color-neutral-825)]" />
            <span className="text-sm-plus font-medium tracking-[0.3px] text-text-muted">o con tu email</span>
            <div className="h-px flex-1 bg-border-strong [html[data-theme='dark']_&]:bg-[var(--color-neutral-825)]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="mb-md-plus">
              <label htmlFor="login-email" className="mb-xs block text-md font-semibold text-text-tertiary">
                Email
              </label>
              <div
                className={cn(
                  "flex items-center gap-sm-plus rounded-lg border px-md-plus",
                  "bg-surface-card transition-[border-color,box-shadow] duration-150",
                  "[html[data-theme='dark']_&]:bg-[var(--color-surface-dark-card)]",
                  errors.email
                    ? "border-feedback-danger shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                    : "border-border-strong focus-within:border-brand-default focus-within:shadow-[0_0_0_3px_rgba(59,110,246,0.12)] [html[data-theme='dark']_&]:border-[var(--color-neutral-775)] [html[data-theme='dark']_&]:focus-within:border-[var(--color-brand-primary-light)] [html[data-theme='dark']_&]:focus-within:shadow-[0_0_0_3px_rgba(91,138,246,0.18)]",
                )}
              >
                <MailIcon className="flex-none text-text-muted" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ana@email.com"
                  disabled={isSubmitting}
                  className="min-h-[44px] flex-1 bg-transparent text-lg font-medium text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
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
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-md font-semibold text-brand-default hover:text-brand-hover transition-colors duration-150"
                  tabIndex={-1}
                >
                  ¿Has olvidado tu contraseña?
                </button>
              </div>
              <div
                className={cn(
                  "flex items-center gap-sm-plus rounded-lg border px-md-plus",
                  "bg-surface-card transition-[border-color,box-shadow] duration-150",
                  "[html[data-theme='dark']_&]:bg-[var(--color-surface-dark-card)]",
                  errors.password
                    ? "border-feedback-danger shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                    : "border-border-strong focus-within:border-brand-default focus-within:shadow-[0_0_0_3px_rgba(59,110,246,0.12)] [html[data-theme='dark']_&]:border-[var(--color-neutral-775)] [html[data-theme='dark']_&]:focus-within:border-[var(--color-brand-primary-light)] [html[data-theme='dark']_&]:focus-within:shadow-[0_0_0_3px_rgba(91,138,246,0.18)]",
                )}
              >
                <LockIcon
                  className={cn("flex-none", errors.password ? "text-feedback-danger" : "text-text-muted")}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="min-h-[44px] flex-1 bg-transparent text-lg font-medium text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex-none text-text-tertiary hover:text-text-secondary transition-colors duration-150"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
                  rememberMe
                    ? "bg-brand-default"
                    : "border border-border-stronger bg-surface-card [html[data-theme='dark']_&]:bg-[var(--color-surface-dark-card)]",
                )}
              >
                {rememberMe && <CheckIcon />}
              </button>
              Recordarme en este dispositivo
            </label>

            {/* Submit */}
            <Button
              type="submit"
              intent="primary"
              fullWidth
              loading={login.isPending}
              disabled={isSubmitting}
              className="!font-bold !shadow-[0_6px_16px_rgba(59,110,246,0.32)] [html[data-theme='dark']_&]:!shadow-[0_6px_20px_rgba(91,138,246,0.4)]"
            >
              Iniciar sesión
            </Button>
          </form>

          {/* Terms — desktop */}
          <p className="mt-xl-plus hidden text-center text-sm-plus leading-[1.5] text-text-muted lg:block">
            Al continuar aceptas nuestros
            <br />
            <button
              type="button"
              className="font-semibold text-text-tertiary hover:text-text-secondary transition-colors duration-150"
            >
              Términos
            </button>
            {" y "}
            <button
              type="button"
              className="font-semibold text-text-tertiary hover:text-text-secondary transition-colors duration-150"
            >
              Política de privacidad
            </button>
          </p>
        </div>

        {/* Mobile sign-up link */}
        <p className="mt-2xl text-center text-base text-text-tertiary lg:hidden">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-bold text-brand-default no-underline">
            Crear cuenta
          </Link>
        </p>

        {/* Footer — desktop */}
        <div className="mt-auto hidden items-center justify-between text-sm-plus text-text-muted lg:flex">
          <span>© 2026 Debtshare</span>
          <div className="flex gap-lg">
            <span>ES</span>
            <span>Ayuda</span>
            <span>Estado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

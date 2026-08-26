import { zodResolver } from "@hookform/resolvers/zod";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useMemo, useState } from "react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import "react-day-picker/style.css";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useCategories } from "@/shared/api/use-categories";
import { convertAmount, useExchangeRate } from "@/shared/api/use-exchange-rate";
import { Avatar, Button, Modal } from "@/shared/components/ui";
import { ApiError } from "@/shared/lib/api";
import { cn } from "@/shared/lib/cn";
import type { Category, CurrencyCode, GroupMemberWithUser } from "@/types";

import { useCreateExpense } from "../api/use-create-expense";
import { useGroupMembers } from "../api/use-group-members";
import { getCategoryVisual } from "../lib/categories";
import { formatAmount } from "../lib/format";
import { computeEqualShares } from "../lib/split";
import { createExpenseSchema, type CreateExpenseFormData } from "../schemas/create-expense-schema";

export type NewExpenseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  groupCurrency: CurrencyCode;
  onCreated?: (expenseId: string) => void;
};

function todayISODate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function NewExpenseModal({
  open,
  onOpenChange,
  groupId,
  groupName,
  groupCurrency,
  onCreated,
}: NewExpenseModalProps) {
  const { t } = useTranslation("groups");
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);

  const { data: members, isPending: membersLoading } = useGroupMembers(groupId);
  const { data: categories } = useCategories();
  const createExpense = useCreateExpense(groupId);
  const resetMutation = createExpense.reset;

  const defaultPaidBy = useMemo(() => {
    if (!members) return "";
    const me = members.find((m) => m.userId === currentUserId);
    return me?.userId ?? members[0]?.userId ?? "";
  }, [members, currentUserId]);

  const defaultIncluded = useMemo(() => members?.map((m) => m.userId) ?? [], [members]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    mode: "onChange",
    delayError: 350,
    defaultValues: {
      description: "",
      amount: 0,
      currency: groupCurrency,
      categoryId: "",
      date: todayISODate(),
      paidBy: "",
      includedMembers: [],
    },
  });

  // Once members + categories are loaded, prime the default payer/included/category.
  useEffect(() => {
    if (!open) return;
    if (defaultPaidBy && !watch("paidBy")) setValue("paidBy", defaultPaidBy);
    if (defaultIncluded.length > 0 && watch("includedMembers").length === 0)
      setValue("includedMembers", defaultIncluded);
    if (categories && !watch("categoryId")) setValue("categoryId", "cat_food");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultPaidBy, defaultIncluded, categories]);

  useEffect(() => {
    if (!open) {
      reset({
        description: "",
        amount: 0,
        currency: groupCurrency,
        categoryId: "",
        date: todayISODate(),
        paidBy: "",
        includedMembers: [],
      });
      resetMutation();
    }
  }, [open, reset, resetMutation, groupCurrency]);

  const amount = watch("amount");
  const paidBy = watch("paidBy");
  const includedMembers = watch("includedMembers");
  const perPerson = useMemo(
    () => computeEqualShares(Number(amount) || 0, includedMembers, paidBy || null),
    [amount, includedMembers, paidBy],
  );

  const memberCount = includedMembers.length;
  const evenShare =
    memberCount > 0 && Number(amount) > 0 ? Math.floor((Number(amount) * 100) / memberCount) / 100 : 0;

  const onSubmit = (data: CreateExpenseFormData) => {
    const memberIds = members?.map((m) => m.userId) ?? [];
    const excludeMembers = memberIds.filter((id) => !data.includedMembers.includes(id));
    createExpense.mutate(
      {
        description: data.description,
        amount: Math.round(Number(data.amount) * 100) / 100,
        currency: data.currency,
        categoryId: data.categoryId,
        date: new Date(data.date).toISOString(),
        paidBy: data.paidBy,
        excludeMembers,
      },
      {
        onSuccess: (res) => {
          onOpenChange(false);
          onCreated?.(res.id);
        },
      },
    );
  };

  const serverError = createExpense.error instanceof ApiError ? t("expense.serverError") : null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("expense.title")}
      description={t("expense.groupContext", { name: groupName })}
      size="lg"
      footer={
        <>
          <div className="mr-auto text-md text-text-muted">
            {t("expense.total")}
            <span className="ml-xs font-extrabold text-text-primary">
              {formatAmount(Number(amount) || 0, watch("currency"))}
            </span>
          </div>
          <Button intent="ghost" onClick={() => onOpenChange(false)} disabled={createExpense.isPending}>
            {t("expense.cancel")}
          </Button>
          <Button
            intent="primary"
            type="submit"
            form="create-expense-form"
            loading={createExpense.isPending}
            disabled={!isDirty || membersLoading}
          >
            {t("expense.submit")}
          </Button>
        </>
      }
    >
      <form
        id="create-expense-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-xl md:grid-cols-[minmax(0,1fr)_260px]"
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-lg">
          {serverError && (
            <div className="rounded-lg border border-feedback-danger-subtle-strong bg-feedback-danger-subtle px-md py-sm-plus text-md font-medium text-feedback-danger">
              {serverError}
            </div>
          )}

          {/* Amount card */}
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <div
                className={cn(
                  "flex flex-col items-center rounded-2xl border p-lg text-center transition-colors duration-150",
                  errors.amount
                    ? "border-feedback-danger bg-feedback-danger-subtle"
                    : "border-brand-subtle-strong bg-brand-subtle",
                )}
              >
                <div className="text-xs font-bold uppercase tracking-[0.7px] text-brand-on-subtle">
                  {t("expense.amountLabel")}
                </div>
                <Controller
                  control={control}
                  name="currency"
                  render={({ field: currencyField }) => (
                    <label className="mt-xs flex items-baseline justify-center gap-xs">
                      {/* Invisible mirror of the picker: keeps the number visually
                          centered inside the card regardless of how wide the
                          currency label happens to be. */}
                      <span aria-hidden className="pointer-events-none invisible">
                        <CurrencyPicker value={currencyField.value} onChange={() => {}} />
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        autoFocus
                        placeholder="0,00"
                        size={Math.max((field.value ? String(field.value).replace(".", ",") : "").length, 4)}
                        value={field.value === 0 ? "" : String(field.value).replace(".", ",")}
                        onChange={(e) => {
                          const raw = e.target.value.replace(",", ".").replace(/[^\d.]/g, "");
                          const parts = raw.split(".");
                          const clean =
                            parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("").slice(0, 2) : "");
                          const n = clean === "" || clean === "." ? 0 : Number(clean);
                          field.onChange(Number.isFinite(n) ? n : 0);
                        }}
                        className={cn(
                          "w-auto max-w-full bg-transparent outline-none",
                          // Empty: right-aligned so caret sits away from the "0,00"
                          // placeholder. Filled: centered — the ghost picker mirror
                          // on the left keeps the overall block visually balanced.
                          field.value === 0 ? "text-right" : "text-center",
                          "text-display-lg font-extrabold tracking-[-2px] leading-none text-text-primary",
                          "placeholder:text-text-muted caret-brand-default",
                        )}
                        aria-label={t("expense.amountLabel")}
                      />
                      <CurrencyPicker value={currencyField.value} onChange={currencyField.onChange} />
                    </label>
                  )}
                />
                <ConversionHint amount={field.value} from={watch("currency")} to={groupCurrency} />
                {errors.amount && (
                  <p className="mt-xs text-sm-plus font-semibold text-feedback-danger">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Description */}
          <div>
            <label
              htmlFor="exp-desc"
              className="mb-xs block text-xs font-bold uppercase tracking-[0.6px] text-text-muted"
            >
              {t("expense.descriptionLabel")}
            </label>
            <input
              id="exp-desc"
              type="text"
              placeholder={t("expense.descriptionPlaceholder")}
              className={cn(
                "min-h-4xl w-full rounded-lg border bg-surface-card px-md-plus py-sm-plus",
                "text-md-plus font-medium text-text-primary outline-none placeholder:text-text-muted",
                "transition-[border-color,box-shadow] duration-150",
                errors.description
                  ? "border-feedback-danger shadow-[0_0_0_3px_var(--color-semantic-error-tint)]"
                  : "border-border-strong focus:border-brand-default focus:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
              )}
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-2xs text-sm-plus font-semibold text-feedback-danger">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date + Paid by — placed BEFORE categories so their popovers can overlay
              the categories area below without being clipped by the modal body. */}
          <div className="grid gap-md sm:grid-cols-2">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div>
                  <label className="mb-xs block text-xs font-bold uppercase tracking-[0.6px] text-text-muted">
                    {t("expense.dateLabel")}
                  </label>
                  <DateField value={field.value} onChange={field.onChange} hasError={!!errors.date} />
                  {errors.date && (
                    <p className="mt-2xs text-sm-plus font-semibold text-feedback-danger">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="paidBy"
              render={({ field }) => (
                <div>
                  <label className="mb-xs block text-xs font-bold uppercase tracking-[0.6px] text-text-muted">
                    {t("expense.paidByLabel")}
                  </label>
                  <PayerSelect
                    members={members ?? []}
                    currentUserId={currentUserId}
                    value={field.value}
                    onChange={field.onChange}
                    hasError={!!errors.paidBy}
                  />
                  {errors.paidBy && (
                    <p className="mt-2xs text-sm-plus font-semibold text-feedback-danger">
                      {errors.paidBy.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Category — last so date/payer dropdowns can cover it if needed. */}
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <div>
                <label className="mb-sm block text-xs font-bold uppercase tracking-[0.6px] text-text-muted">
                  {t("expense.categoryLabel")}
                </label>
                <div className="flex flex-wrap gap-xs">
                  {(categories ?? []).map((cat) => (
                    <CategoryChip
                      key={cat.id}
                      category={cat}
                      selected={field.value === cat.id}
                      onSelect={() => field.onChange(cat.id)}
                    />
                  ))}
                </div>
                {errors.categoryId && (
                  <p className="mt-xs text-sm-plus font-semibold text-feedback-danger">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* RIGHT COLUMN — split */}
        <Controller
          control={control}
          name="includedMembers"
          render={({ field }) => (
            <aside className="flex flex-col gap-sm rounded-2xl border border-border-divider bg-surface-subtle p-lg">
              <div className="flex items-baseline justify-between">
                <div className="text-md font-bold text-text-primary">{t("expense.splitTitle")}</div>
                <div className="text-xs font-semibold text-text-muted">{t("expense.equalSplit")}</div>
              </div>
              <div className="text-sm-plus font-bold text-brand-default">
                {t("expense.perPerson", {
                  count: memberCount,
                  amount: formatAmount(evenShare, watch("currency")),
                })}
              </div>

              <div className="mt-sm flex flex-col gap-2xs">
                {(members ?? []).map((m) => {
                  const included = field.value.includes(m.userId);
                  const isPayer = paidBy === m.userId;
                  const share = perPerson.get(m.userId) ?? 0;
                  return (
                    <MemberSplitRow
                      key={m.userId}
                      member={m}
                      included={included}
                      isPayer={isPayer}
                      isMe={m.userId === currentUserId}
                      share={share}
                      currency={watch("currency")}
                      onToggle={() => {
                        if (included) {
                          field.onChange(field.value.filter((id) => id !== m.userId));
                        } else {
                          field.onChange([...field.value, m.userId]);
                        }
                      }}
                    />
                  );
                })}
              </div>

              {errors.includedMembers && (
                <p className="mt-xs text-sm-plus font-semibold text-feedback-danger">
                  {errors.includedMembers.message}
                </p>
              )}

              <p className="mt-md text-xs text-text-muted">{t("expense.splitHelp")}</p>
            </aside>
          )}
        />
      </form>
    </Modal>
  );
}

function CategoryChip({
  category,
  selected,
  onSelect,
}: {
  category: Category;
  selected: boolean;
  onSelect: () => void;
}) {
  const visual = getCategoryVisual(category.id);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "inline-flex items-center gap-xs rounded-xl border px-sm-plus py-sm text-md-plus font-semibold transition-all duration-150",
        selected
          ? cn("border-current", visual.bg, visual.fg)
          : "border-border-strong bg-surface-card text-text-secondary hover:border-border-stronger hover:text-text-primary",
      )}
    >
      <span aria-hidden>{visual.emoji}</span>
      {category.name}
    </button>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M3 10h18M8 4v4M16 4v4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("text-text-muted transition-transform duration-150", open && "rotate-180")}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function DateField({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
}) {
  const { t, i18n } = useTranslation("groups");
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(value) : undefined;
  const today = new Date();

  const label = (() => {
    if (!value) return t("expense.dateLabel");
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    // Only add the year when the date is not from the current year — keeps
    // "11 ago" tight when possible but disambiguates "11 ago 1997".
    const dateStr = formatSmartDate(d, i18n.language, today);
    if (isSameDay(d, today)) return `${t("expense.today")} · ${dateStr}`;
    if (isSameDay(d, yesterday)) return `${t("expense.yesterday")} · ${dateStr}`;
    return dateStr;
  })();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={t("expense.dateLabel")}
          className={cn(
            "flex min-h-4xl w-full items-center gap-sm rounded-lg border bg-surface-card px-md-plus py-sm-plus text-left",
            "transition-[border-color,box-shadow] duration-150",
            hasError
              ? "border-feedback-danger shadow-[0_0_0_3px_var(--color-semantic-error-tint)]"
              : open
                ? "border-brand-default shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]"
                : "border-border-strong hover:border-border-stronger",
          )}
        >
          <span className="flex-none text-brand-default">
            <CalendarIcon />
          </span>
          <span className="flex-1 truncate text-md-plus font-semibold text-text-primary">{label}</span>
          <ChevronDown open={open} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          collisionPadding={16}
          className={cn(
            "z-[60] rounded-xl border border-border-strong bg-surface-card p-sm shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        >
          <DayPicker
            mode="single"
            locale={es}
            selected={selected}
            defaultMonth={selected ?? today}
            disabled={{ after: today }}
            captionLayout="dropdown"
            startMonth={new Date(today.getFullYear() - 5, 0)}
            endMonth={new Date(today.getFullYear(), 11)}
            components={{ MonthCaption: CalendarCaption }}
            onSelect={(d) => {
              if (!d) return;
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              onChange(`${y}-${m}-${day}`);
              setOpen(false);
            }}
            classNames={{
              root: "font-sans text-md text-text-primary",
              months: "flex flex-col gap-sm",
              month: "flex flex-col gap-xs",
              nav: "hidden",
              weekdays: "flex",
              weekday:
                "flex h-[28px] w-[36px] items-center justify-center text-[10.5px] font-bold uppercase tracking-[0.5px] text-text-muted",
              week: "flex",
              day: "h-[36px] w-[36px] p-0 text-center",
              day_button:
                "inline-flex h-full w-full items-center justify-center rounded-lg text-md font-semibold text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary",
              selected:
                "[&_button]:bg-brand-default [&_button]:text-text-on-brand [&_button:hover]:bg-brand-hover [&_button:hover]:text-text-on-brand",
              today: "[&_button]:font-extrabold [&_button]:text-brand-default",
              disabled:
                "[&_button]:cursor-not-allowed [&_button]:opacity-40 [&_button:hover]:bg-transparent [&_button:hover]:text-text-secondary",
              outside: "opacity-40",
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function formatSmartDate(d: Date, locale: string, reference: Date): string {
  const sameYear = d.getFullYear() === reference.getFullYear();
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(d);
}

// Custom caption for react-day-picker: month/year selects styled to match the app,
// plus native prev/next arrows on the sides. Replaces the default caption entirely.
function CalendarCaption({ calendarMonth }: { calendarMonth: { date: Date } }) {
  const { goToMonth, nextMonth, previousMonth, months } = useDayPicker();
  const displayed = calendarMonth.date;

  // Build the month + year option lists respecting startMonth/endMonth from DayPicker.
  const startYear = months[0]?.date.getFullYear() ?? displayed.getFullYear();
  const endYear = months[months.length - 1]?.date.getFullYear() ?? displayed.getFullYear();
  // If DayPicker exposes just one month, expand to a 6-year window ending at endYear.
  const yearFrom = Math.min(startYear, endYear - 5);
  const yearTo = endYear;
  const yearOptions: number[] = [];
  for (let y = yearFrom; y <= yearTo; y++) yearOptions.push(y);

  const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "long" });
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: monthFormatter.format(new Date(2000, i, 1)),
  }));

  const goPrev = () => previousMonth && goToMonth(previousMonth);
  const goNext = () => nextMonth && goToMonth(nextMonth);

  return (
    <div className="flex items-center justify-between gap-xs pb-xs">
      <button
        type="button"
        onClick={goPrev}
        disabled={!previousMonth}
        aria-label="Mes anterior"
        className={cn(
          "flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg text-text-secondary transition-colors",
          "hover:bg-surface-subtle hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
        )}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex flex-1 items-center justify-center gap-xs">
        <CaptionSelect
          value={displayed.getMonth()}
          onChange={(v) => goToMonth(new Date(displayed.getFullYear(), v, 1))}
          options={monthOptions}
        />
        <CaptionSelect
          value={displayed.getFullYear()}
          onChange={(v) => goToMonth(new Date(v, displayed.getMonth(), 1))}
          options={yearOptions.map((y) => ({ value: y, label: String(y) }))}
        />
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={!nextMonth}
        aria-label="Mes siguiente"
        className={cn(
          "flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg text-text-secondary transition-colors",
          "hover:bg-surface-subtle hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
        )}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function CaptionSelect<T extends number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-xs rounded-lg bg-surface-subtle px-sm-plus py-xs",
            "text-md-plus font-bold capitalize text-text-primary outline-none transition-colors",
            "hover:bg-surface-hover focus:ring-2 focus:ring-brand-default",
            open && "bg-surface-hover ring-2 ring-brand-default",
          )}
        >
          {current?.label ?? "—"}
          <svg
            width={11}
            height={11}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={cn("text-text-secondary transition-transform", open && "rotate-180")}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="center"
          collisionPadding={16}
          className={cn(
            "z-[70] max-h-[240px] min-w-[140px] overflow-y-auto rounded-xl",
            "border border-border-strong bg-surface-card p-xs shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          )}
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-sm rounded-lg px-sm-plus py-sm text-left transition-colors duration-100",
                  active
                    ? "bg-brand-subtle text-brand-on-subtle"
                    : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
                )}
              >
                <span className={cn("truncate capitalize", active ? "font-bold" : "font-semibold")}>
                  {o.label}
                </span>
                {active && (
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PayerSelect({
  members,
  currentUserId,
  value,
  onChange,
  hasError,
}: {
  members: GroupMemberWithUser[];
  currentUserId: string | null;
  value: string;
  onChange: (id: string) => void;
  hasError: boolean;
}) {
  const { t } = useTranslation("groups");
  const [open, setOpen] = useState(false);
  const selected = members.find((m) => m.userId === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={t("expense.paidByLabel")}
          className={cn(
            "flex min-h-4xl w-full items-center gap-sm rounded-lg border bg-surface-card px-md-plus py-sm-plus text-left",
            "transition-[border-color,box-shadow] duration-150",
            hasError
              ? "border-feedback-danger shadow-[0_0_0_3px_var(--color-semantic-error-tint)]"
              : open
                ? "border-brand-default shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]"
                : "border-border-strong hover:border-border-stronger",
          )}
        >
          {selected?.user ? (
            selected.user.avatarUrl ? (
              <Avatar
                variant="image"
                size="sm"
                src={selected.user.avatarUrl}
                alt={selected.user.name}
                fallbackInitials={selected.user.name}
              />
            ) : (
              <Avatar variant="initials" size="sm" name={selected.user.name} />
            )
          ) : (
            <Avatar variant="placeholder" size="sm" />
          )}
          <span className="flex-1 truncate text-md-plus font-semibold text-text-primary">
            {selected?.user?.name ?? "—"}
            {selected?.userId === currentUserId && (
              <span className="ml-xs text-xs font-bold uppercase tracking-[0.5px] text-text-muted">Tú</span>
            )}
          </span>
          <ChevronDown open={open} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          collisionPadding={16}
          className={cn(
            "z-[60] max-h-[280px] w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl",
            "border border-border-strong bg-surface-card p-xs shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          )}
        >
          {members.map((m) => {
            const active = m.userId === value;
            const isMe = m.userId === currentUserId;
            return (
              <button
                key={m.userId}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(m.userId);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-sm rounded-lg px-sm-plus py-sm text-left transition-colors duration-100",
                  active
                    ? "bg-brand-subtle text-brand-on-subtle"
                    : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
                )}
              >
                {m.user?.avatarUrl ? (
                  <Avatar
                    variant="image"
                    size="sm"
                    src={m.user.avatarUrl}
                    alt={m.user.name}
                    fallbackInitials={m.user.name}
                  />
                ) : (
                  <Avatar variant="initials" size="sm" name={m.user?.name ?? m.userId} />
                )}
                <span className="flex-1 truncate text-md-plus font-semibold">{m.user?.name ?? m.userId}</span>
                {isMe && (
                  <span className="text-xs font-bold uppercase tracking-[0.5px] text-text-muted">Tú</span>
                )}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function MemberSplitRow({
  member,
  included,
  isPayer,
  isMe,
  share,
  currency,
  onToggle,
}: {
  member: GroupMemberWithUser;
  included: boolean;
  isPayer: boolean;
  isMe: boolean;
  share: number;
  currency: CurrencyCode;
  onToggle: () => void;
}) {
  const { t } = useTranslation("groups");
  const name = member.user?.name ?? member.userId;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={included}
      className={cn(
        "flex items-center gap-xs rounded-xl border px-sm py-sm text-left transition-colors duration-150",
        included
          ? "border-brand-default/30 bg-brand-subtle"
          : "border-dashed border-border-strong bg-transparent hover:border-brand-default/50 hover:bg-surface-hover",
      )}
    >
      <div className="relative flex-none">
        <div
          className={cn(
            "rounded-pill",
            isMe && "ring-2 ring-brand-default ring-offset-2 ring-offset-surface-subtle",
          )}
        >
          {member.user?.avatarUrl ? (
            <Avatar
              variant="image"
              size="sm"
              src={member.user.avatarUrl}
              alt={name}
              fallbackInitials={name}
            />
          ) : (
            <Avatar variant="initials" size="sm" name={name} />
          )}
        </div>
        {included && (
          <span
            className={cn(
              "absolute -bottom-[2px] -right-[2px] flex h-[14px] w-[14px] items-center justify-center rounded-pill",
              "border-2 border-surface-subtle bg-brand-default text-text-on-brand",
            )}
            aria-hidden
          >
            <svg width={7} height={7} viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2xs">
          <span
            className={cn(
              "truncate text-md font-bold",
              included ? "text-text-primary" : "text-text-tertiary",
            )}
          >
            {name}
          </span>
          {isPayer && (
            <span
              className={cn(
                "inline-flex flex-none items-center rounded-md px-[5px] py-[2px] text-[9.5px] font-extrabold uppercase leading-none tracking-[0.3px]",
                included ? "bg-brand-default/15 text-brand-on-subtle" : "bg-surface-hover text-text-tertiary",
              )}
            >
              {t("expense.paidBadge")}
            </span>
          )}
        </div>
        {!included && (
          <div className="text-xs font-medium text-text-muted">{t("expense.memberExcluded")}</div>
        )}
      </div>

      <span
        className={cn(
          "flex-none whitespace-nowrap text-md font-extrabold tabular-nums",
          included ? "text-text-primary" : "text-text-muted",
        )}
      >
        {included ? formatAmount(share, currency) : "—"}
      </span>
    </button>
  );
}

const CURRENCY_OPTIONS: { code: CurrencyCode; label: string }[] = [
  { code: "EUR", label: "€" },
  { code: "USD", label: "US$" },
  { code: "GBP", label: "£" },
];

function CurrencyPicker({
  value,
  onChange,
}: {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = CURRENCY_OPTIONS.find((c) => c.code === value) ?? CURRENCY_OPTIONS[0];
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={value}
          className={cn(
            "inline-flex items-center gap-2xs rounded-lg px-sm-plus py-2xs transition-colors",
            "text-display-xs font-bold text-brand-on-subtle",
            "hover:bg-brand-subtle-strong focus:outline-none focus:ring-2 focus:ring-brand-default",
            open && "bg-brand-subtle-strong",
          )}
        >
          <span>{current.label}</span>
          <svg
            width={11}
            height={11}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={cn("text-brand-on-subtle transition-transform", open && "rotate-180")}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="center"
          collisionPadding={16}
          className={cn(
            "z-[70] min-w-[130px] rounded-xl border border-border-strong bg-surface-card p-xs shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          )}
        >
          {CURRENCY_OPTIONS.map((c) => {
            const active = c.code === value;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-sm rounded-lg px-sm-plus py-sm text-left transition-colors duration-100",
                  active
                    ? "bg-brand-subtle text-brand-on-subtle"
                    : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
                )}
              >
                <span className={cn("text-md-plus", active ? "font-bold" : "font-semibold")}>{c.code}</span>
                <span
                  className={cn(
                    "text-md-plus font-bold",
                    active ? "text-brand-on-subtle" : "text-text-muted",
                  )}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ConversionHint({ amount, from, to }: { amount: number; from: CurrencyCode; to: CurrencyCode }) {
  const { t } = useTranslation("groups");
  const { data, isPending } = useExchangeRate(from, to);
  if (!from || !to || from === to || !amount || amount <= 0) return null;
  if (isPending || !data) {
    return (
      <div className="mt-sm text-sm-plus font-semibold text-brand-on-subtle/70">
        {t("expense.convertingHint")}
      </div>
    );
  }
  const converted = convertAmount(amount, data.rate);
  return (
    <div className="mt-sm text-sm-plus font-semibold text-brand-on-subtle">
      ≈ {formatAmount(converted, to)}
      <span className="ml-xs text-xs font-medium text-brand-on-subtle/70">
        · {t("expense.simulatedRate")}
      </span>
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button, Modal } from "@/shared/components/ui";
import { ApiError } from "@/shared/lib/api";
import { cn } from "@/shared/lib/cn";

import { useCreateGroup } from "../api/use-create-group";
import { GROUP_ICON_EMOJI, GROUP_ICON_ORDER, type GroupIconKey } from "../lib/group-icons";
import {
  CURRENCY_OPTIONS,
  createGroupSchema,
  type CreateGroupFormData,
} from "../schemas/create-group-schema";

export type CreateGroupModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (groupId: string) => void;
};

const DEFAULT_VALUES: CreateGroupFormData = {
  name: "",
  description: "",
  currency: "EUR",
  icon: "flight",
};

export function CreateGroupModal({ open, onOpenChange, onCreated }: CreateGroupModalProps) {
  const { t } = useTranslation("groups");
  const createGroup = useCreateGroup();
  const resetMutation = createGroup.reset;

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
    delayError: 350,
  });

  useEffect(() => {
    if (!open) {
      reset(DEFAULT_VALUES);
      resetMutation();
    }
  }, [open, reset, resetMutation]);

  const onSubmit = (data: CreateGroupFormData) => {
    createGroup.mutate(
      {
        name: data.name,
        description: data.description.length > 0 ? data.description : null,
        currency: data.currency,
        icon: data.icon,
      },
      {
        onSuccess: (group) => {
          onOpenChange(false);
          onCreated?.(group.id);
        },
      },
    );
  };

  const serverError = createGroup.error instanceof ApiError ? t("create.serverError") : null;
  const descriptionLen = (watch("description") ?? "").length;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("create.title")}
      description={t("create.description")}
      size="md"
      footer={
        <>
          <Button intent="ghost" onClick={() => onOpenChange(false)} disabled={createGroup.isPending}>
            {t("create.cancel")}
          </Button>
          <Button
            intent="primary"
            type="submit"
            form="create-group-form"
            loading={createGroup.isPending}
            disabled={!isDirty}
          >
            {t("create.submit")}
          </Button>
        </>
      }
    >
      <form
        id="create-group-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-lg"
      >
        {serverError && (
          <div className="rounded-lg border border-feedback-danger-subtle-strong bg-feedback-danger-subtle px-md py-sm-plus text-md font-medium text-feedback-danger">
            {serverError}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="cg-name" className="mb-xs block text-md font-semibold text-text-tertiary">
            {t("create.nameLabel")}
          </label>
          <input
            id="cg-name"
            type="text"
            autoFocus
            placeholder={t("create.namePlaceholder")}
            className={cn(
              "min-h-4xl w-full rounded-lg border bg-surface-card px-md-plus py-sm-plus",
              "text-lg font-medium text-text-primary outline-none",
              "placeholder:text-text-muted transition-[border-color,box-shadow] duration-150",
              errors.name
                ? "border-feedback-danger shadow-[0_0_0_3px_var(--color-semantic-error-tint)]"
                : "border-border-strong focus:border-brand-default focus:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
            )}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-2xs text-md font-semibold text-feedback-danger">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="mb-xs flex items-center justify-between">
            <label htmlFor="cg-desc" className="text-md font-semibold text-text-tertiary">
              {t("create.descriptionLabel")}
            </label>
            <span
              className={cn(
                "text-sm-plus font-medium tabular-nums",
                descriptionLen > 140 ? "text-feedback-danger" : "text-text-muted",
              )}
            >
              {descriptionLen}/140
            </span>
          </div>
          <textarea
            id="cg-desc"
            rows={3}
            placeholder={t("create.descriptionPlaceholder")}
            className={cn(
              "w-full resize-none rounded-lg border bg-surface-card px-md-plus py-sm-plus",
              "text-md font-medium text-text-primary outline-none",
              "placeholder:text-text-muted transition-[border-color,box-shadow] duration-150",
              errors.description
                ? "border-feedback-danger shadow-[0_0_0_3px_var(--color-semantic-error-tint)]"
                : "border-border-strong focus:border-brand-default focus:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-2xs text-md font-semibold text-feedback-danger">{errors.description.message}</p>
          )}
        </div>

        {/* Currency */}
        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <fieldset>
              <legend className="mb-xs text-md font-semibold text-text-tertiary">
                {t("create.currencyLabel")}
              </legend>
              <div className="flex gap-xs" role="radiogroup">
                {CURRENCY_OPTIONS.map((code) => {
                  const active = field.value === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => field.onChange(code)}
                      className={cn(
                        "flex-1 rounded-lg border px-sm py-sm-plus text-md font-semibold transition-all duration-150",
                        active
                          ? "border-brand-default bg-brand-subtle text-brand-on-subtle shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]"
                          : "border-border-strong bg-surface-card text-text-secondary hover:border-border-stronger",
                      )}
                    >
                      {t(`currency.${code}`)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        />

        {/* Icon picker */}
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <fieldset>
              <legend className="mb-xs text-md font-semibold text-text-tertiary">
                {t("create.iconLabel")}
              </legend>
              <div className="grid grid-cols-5 gap-sm sm:grid-cols-10" role="radiogroup">
                {GROUP_ICON_ORDER.map((icon) => {
                  const active = field.value === icon;
                  return (
                    <button
                      key={icon}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-label={icon}
                      onClick={() => field.onChange(icon as GroupIconKey)}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-lg border text-lg transition-all duration-150",
                        active
                          ? "border-brand-default bg-brand-subtle shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]"
                          : "border-border-strong bg-surface-card hover:border-border-stronger hover:bg-surface-subtle",
                      )}
                    >
                      {GROUP_ICON_EMOJI[icon]}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        />
      </form>
    </Modal>
  );
}

import { BvToastOptions } from "bootstrap-vue";
import { CombinedVueInstance } from "vue/types/vue";

const variantTitles = {
  primary: "Notice",
  secondary: "Notice",
  danger: "Error",
  warning: "Warning",
  success: "Success",
  info: "Notice",
};

type Cmp = CombinedVueInstance<Vue, unknown, unknown, unknown, unknown>;
type Variant = keyof typeof variantTitles;

export function toast<T extends Cmp>(this: T, message: string, variant: Variant = "primary", title?: string, options?: BvToastOptions): void {
  this.$bvToast.toast(message, {
    title: title || variantTitles[variant],
    variant,
    ...options,
  });
}

export function toastSuccess<T extends Cmp>(this: T, message: string): void {
  toast.call(this, message, "success");
}

export function toastDanger<T extends Cmp>(this: T, message: string): void {
  toast.call(this, message, "danger", variantTitles.danger, {
    noAutoHide: true,
  });
}

export function toastError<T extends Cmp>(this: T, message: string): void {
  toast.call(this, message, "danger", variantTitles.danger, {
    noAutoHide: true,
  });
}

export function toastWarning<T extends Cmp>(this: T, message: string): void {
  toast.call(this, message, "warning", variantTitles.warning, {
    noAutoHide: true,
  });
}

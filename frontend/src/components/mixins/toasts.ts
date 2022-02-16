export function toast(..._args: any[]): void {
  throw new Error("Not implemented");
}

export function toastSuccess(..._args: any[]): void {
  throw new Error("Not implemented");
}

export function toastDanger(..._args: any[]): void {
  throw new Error("Not implemented");
}

export function toastError(..._args: any[]): void {
  throw new Error("Not implemented");
}

export function toastWarning(..._args: any[]): void {
  throw new Error("Not implemented");
}

// import { CombinedVueInstance } from "vue/types/vue";

// const variantTitles = {
//   primary: "Notice",
//   secondary: "Notice",
//   danger: "Error",
//   warning: "Warning",
//   success: "Success",
//   info: "Notice",
// };

// type Cmp = CombinedVueInstance<Vue, unknown, unknown, unknown, unknown>;
// type Variant = keyof typeof variantTitles;

// // TODO: remove
// type BvToastOptions = unknown;

// export function toast<T extends Cmp>(this: T, message: string, variant: Variant = "primary", title?: string, options?: BvToastOptions): void {
//   throw new Error("Not implemented");
//   // this.$bvToast.toast(message, {
//   //   title: title || variantTitles[variant],
//   //   variant,
//   //   ...options,
//   // });
// }

// export function toastSuccess<T extends Cmp>(this: T, message: string): void {
//   throw new Error("Not implemented");
//   // toast.call(this, message, "success");
// }

// export function toastDanger<T extends Cmp>(this: T, message: string): void {
//   throw new Error("Not implemented");
//   // toast.call(this, message, "danger", variantTitles.danger, {
//   //   noAutoHide: true,
//   // });
// }

// export function toastError<T extends Cmp>(this: T, message: string): void {
//   throw new Error("Not implemented");
//   // toast.call(this, message, "danger", variantTitles.danger, {
//   //   noAutoHide: true,
//   // });
// }

// export function toastWarning<T extends Cmp>(this: T, message: string): void {
//   throw new Error("Not implemented");
//   // toast.call(this, message, "warning", variantTitles.warning, {
//   //   noAutoHide: true,
//   // });
// }

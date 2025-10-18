declare module "sonner" {
  import type { ComponentType } from "react";

  export const Toaster: ComponentType<any>;
  export interface ToastFn {
    (message: string, options?: any): void;
    success(message: string, options?: any): void;
    error(message: string, options?: any): void;
    info?(message: string, options?: any): void;
    warning?(message: string, options?: any): void;
  }
  export const toast: ToastFn;
}



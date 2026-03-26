
import { toast } from "sonner"
import type { CSSProperties } from "react"

type ToastType = "success" | "error" | "warning" | "info"
type ToastOptions = Parameters<typeof toast.success>[1]

const toastStyles: Record<ToastType, CSSProperties> = {
    success: {
        "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
        "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
    } as CSSProperties,

    error: {
        "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))",
        "--normal-text":
            "light-dark(var(--color-red-600), var(--color-red-400))",
        "--normal-border":
            "light-dark(var(--color-red-600), var(--color-red-400))",
    } as CSSProperties,

    warning: {
        "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-yellow-600), var(--color-yellow-400)) 10%, var(--background))",
        "--normal-text":
            "light-dark(var(--color-yellow-600), var(--color-yellow-400))",
        "--normal-border":
            "light-dark(var(--color-yellow-600), var(--color-yellow-400))",
    } as CSSProperties,

    info: {
        "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-blue-600), var(--color-blue-400)) 10%, var(--background))",
        "--normal-text":
            "light-dark(var(--color-blue-600), var(--color-blue-400))",
        "--normal-border":
            "light-dark(var(--color-blue-600), var(--color-blue-400))",
    } as CSSProperties,
}

function showToast(
    type: ToastType,
    message: string,
    options?: ToastOptions
) {
    return toast[type](message, {
        ...options,
        style: {
            ...toastStyles[type],
            ...options?.style,
        },
    })
}

export const appToast = {
    success: (message: string, options?: ToastOptions) =>
        showToast("success", message, options),

    error: (message: string, options?: ToastOptions) =>
        showToast("error", message, options),

    warning: (message: string, options?: ToastOptions) =>
        showToast("warning", message, options),

    info: (message: string, options?: ToastOptions) =>
        showToast("info", message, options),
}

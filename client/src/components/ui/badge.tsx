import * as React from "react";

type Variant = "default" | "success" | "warning" | "danger";

const classes: Record<Variant, string> = {
  default:
    "bg-gray-50 text-gray-700 border-gray-200",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider ${classes[variant]} ${
        className || ""
      }`}
      {...props}
    />
  );
}


import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#3366FF] text-white shadow-lg shadow-blue-500/25 hover:bg-[#2952CC] hover:-translate-y-0.5",
  secondary:
    "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 hover:border-gray-300",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 rounded-xl text-[13px]",
  md: "h-12 px-6 rounded-2xl text-[14px]",
  lg: "h-[60px] px-8 rounded-2xl text-[16px]",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  const cls = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${
    className || ""
  }`;
  return <button ref={ref} className={cls} {...props} />;
});

Button.displayName = "Button";


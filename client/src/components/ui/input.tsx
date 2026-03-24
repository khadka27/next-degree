import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full h-12 bg-white border border-gray-200 rounded-2xl px-4 text-[14px] font-medium text-gray-900 outline-none transition-all focus:border-[#3366FF]/40 focus:ring-4 focus:ring-[#3366FF]/10 placeholder:text-gray-400 ${
        className || ""
      }`}
      {...props}
    />
  );
});

Input.displayName = "Input";


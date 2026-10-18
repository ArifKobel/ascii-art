import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
};

const VARIANTS = {
  primary: "bg-white text-neutral-950 hover:bg-neutral-200",
  ghost: "text-neutral-300 hover:bg-white/8 hover:text-white",
} as const;

export function Button({ variant = "ghost", className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

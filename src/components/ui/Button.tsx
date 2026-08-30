import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  asLink = false,
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-mono font-medium transition-all duration-150 text-center tracking-wider disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1 rounded-[3px] gap-1.5",
    md: "text-xs px-3.5 py-1.5 rounded-[4px] gap-2",
    lg: "text-sm px-5 py-2.5 rounded-[4px] gap-2.5",
  };

  const variantStyles = {
    primary: "bg-[#7090B0] text-[#050505] font-semibold hover:bg-[#D0F0F0] active:scale-[0.98]",
    secondary: "bg-[#101020] border border-[#203050] text-[#D0F0F0] hover:border-[#7090B0] hover:bg-[#16192E]",
    outline: "bg-transparent border border-[#203050] text-[#9090A0] hover:text-[#D0F0F0] hover:border-[#304F70]",
    ghost: "bg-transparent text-[#9090A0] hover:text-[#D0F0F0] hover:bg-[#101020]",
    danger: "bg-[#E24C4C]/10 border border-[#E24C4C]/40 text-[#E24C4C] hover:bg-[#E24C4C]/20",
  };

  const combinedClasses = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if (asLink && href) {
    return (
      <a href={href} target={target} rel={rel} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}

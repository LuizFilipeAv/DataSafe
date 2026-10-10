"use client";

import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from "react";

// ── Button ─────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 justify-center font-semibold rounded-xl transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const sizes = { sm: "px-3 py-2 text-xs", md: "px-4 py-2.5 text-sm" };
  const variants = {
    primary:
      "bg-[#FF8C00] hover:bg-[#f59e0b] text-slate-950 shadow-lg shadow-orange-950/30",
    ghost:
      "bg-slate-800/70 hover:bg-slate-700 text-slate-100 border border-slate-700",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-400">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-[border-color,box-shadow,background-color] duration-150 focus:border-[#FF8C00]/80 focus:bg-slate-950 focus:ring-4 focus:ring-orange-500/10 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export function Select({
  label,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-400">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={`w-full appearance-none bg-slate-950/50 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pr-9 text-sm text-slate-100 outline-none transition-[border-color,box-shadow,background-color] duration-150 focus:border-[#FF8C00]/80 focus:bg-slate-950 focus:ring-4 focus:ring-orange-500/10 cursor-pointer ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 4L6 8L10 4"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-[#FF8C00] transition-all duration-200"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-slate-800/70 border border-slate-700/70 rounded-2xl p-5 shadow-panel backdrop-blur-sm sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────
type BadgeColor = "orange" | "green" | "red" | "slate";
export function Badge({
  children,
  color = "slate",
}: {
  children: ReactNode;
  color?: BadgeColor;
}) {
  const colors: Record<BadgeColor, string> = {
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    slate: "bg-slate-700 text-slate-300 border-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${colors[color]}`}
    >
      {children}
    </span>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 bg-slate-950/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="bg-slate-800 border border-slate-600/80 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-700/80">
          <h3 className="font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-700 hover:text-slate-200 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-950/50 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
        {icon}
      </div>
      <p className="text-slate-300 font-medium">{title}</p>
      <p className="text-slate-500 text-sm mt-1">{description}</p>
    </div>
  );
}

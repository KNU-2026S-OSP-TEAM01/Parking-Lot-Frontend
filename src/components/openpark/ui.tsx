import { Icon } from "@iconify/react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import Skeleton from "../ui/Skeleton";

type LogoProps = {
  compact?: boolean;
};

export const Logo = ({ compact = false }: LogoProps) => (
  <div className="flex items-center gap-1.5">
    <Icon
      icon="material-symbols:parking-sign"
      className="size-6 shrink-0 text-blue-500"
    />
    <span
      className={`font-['Overpass_Mono',monospace] leading-6 tracking-normal text-slate-800 ${
        compact ? "text-2xl font-normal" : "text-2xl font-semibold"
      }`}
    >
      OpenPark
    </span>
  </div>
);

export const CenterPage = ({ children }: { children: ReactNode }) => (
  <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-2.5">
    {children}
  </main>
);

export const Panel = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={`w-full overflow-hidden border bg-white ${className}`}
  >
    {children}
  </section>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "danger";
};

export const Button = ({
  tone = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  const toneClass =
    tone === "danger"
      ? "bg-red-500 text-white"
      : tone === "secondary"
        ? "bg-slate-50 text-slate-800"
        : "bg-blue-500 text-white";

  return (
    <button
      type={type}
      className={`flex h-9 items-center justify-center overflow-hidden rounded-lg py-2 text-sm font-semibold leading-5 ${toneClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: string;
};

export const Field = ({ label, icon, className = "", ...props }: FieldProps) => (
  <label className={`flex w-full flex-col gap-1 ${className}`}>
    <span className="text-sm font-normal leading-5 text-slate-800">{label}</span>
    <span className="flex h-10 w-full items-center justify-between overflow-hidden rounded bg-slate-100 px-2.5 text-sm font-medium leading-5 text-slate-500">
      <input
        className="min-w-0 flex-1 bg-transparent text-sm font-medium leading-5 text-slate-800 outline-none placeholder:text-slate-500"
        {...props}
      />
      {icon ? <Icon icon={icon} className="size-[18px] shrink-0 text-slate-500" /> : null}
    </span>
  </label>
);

type DataTextProps = {
  children: ReactNode;
  loading?: boolean;
  height?: number;
  className?: string;
};

export const DataText = ({
  children,
  loading = false,
  height = 16,
  className = "",
}: DataTextProps) => {
  if (loading) {
    return <Skeleton height={height} className={className} />;
  }

  return <span className={className}>{children}</span>;
};

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h1 className="text-sm font-semibold leading-5 text-slate-500">{children}</h1>
);

export const ModalBackdrop = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) => (
  <div
    className="fixed inset-0 z-40 flex items-center justify-center bg-slate-800/20 p-2.5 backdrop-blur-[2px]"
    onClick={onClose}
  >
    <div
      className="flex w-full justify-center"
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

export const visuallyHiddenButtonClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

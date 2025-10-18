import { ReactNode, HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...rest
}: {
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`bg-white border border-[#e5e5e5] rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>;
}

export function CardTitle({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={`text-sm font-semibold text-[#333] ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({
  className = "",
  children,
  ...rest
}: {
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={`px-6 pb-6 ${className}`}>{children}</div>;
}

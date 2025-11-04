import { ReactNode } from "react";

interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Card({ title, description, children, footer }: CardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-card/80 p-6 shadow-lg backdrop-blur">
      <header className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? <p className="text-sm text-slate-300">{description}</p> : null}
      </header>
      <div className="flex flex-col gap-4">{children}</div>
      {footer ? <footer className="mt-6 border-t border-white/5 pt-4 text-sm text-slate-300">{footer}</footer> : null}
    </section>
  );
}

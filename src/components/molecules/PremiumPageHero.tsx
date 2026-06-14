import { cn } from "@/lib/utils";

export function PremiumPageHero({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <div className="relative mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-cream via-white to-brand-yellow/20 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
      <div
        className="pointer-events-none absolute -start-16 -top-16 h-48 w-48 rounded-full bg-brand-blue/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -end-10 h-56 w-56 rounded-full bg-brand-orange/10 blur-3xl"
        aria-hidden
      />
      <div className="relative max-w-3xl">
        {badge && (
          <span className="inline-block rounded-full border border-brand-blue/20 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-blue">
            {badge}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-neutral-950 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="h-1 w-14 rounded-full bg-brand-orange" />
          <span className="h-1 w-6 rounded-full bg-brand-blue" />
        </div>
        {description && (
          <p className="mt-5 text-base leading-relaxed text-neutral-700 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function PremiumPanel({
  icon,
  label,
  title,
  children,
  className,
  gradient = "from-brand-blue/10 via-white to-brand-blue-light/5",
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-gradient-to-br p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-[0_28px_60px_-24px_rgba(66,76,243,0.35)]",
        gradient,
        className
      )}
    >
      <div className="absolute -top-10 -start-10 h-32 w-32 rounded-full bg-brand-blue/5 transition-transform group-hover:scale-110" aria-hidden />
      <div className="relative">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-black/5">
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
            {label}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-neutral-950">{title}</h3>
        <div className="mt-6 text-base leading-relaxed text-neutral-700">{children}</div>
      </div>
    </div>
  );
}

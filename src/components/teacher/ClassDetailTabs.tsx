"use client";

import { cn } from "@/lib/utils";
import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";

export type ClassTab = "grades" | "homework" | "quizzes";

const tabs: { id: ClassTab; label: string; icon: typeof GraduationCap }[] = [
  { id: "grades", label: "العلامات", icon: GraduationCap },
  { id: "homework", label: "الواجبات", icon: BookOpen },
  { id: "quizzes", label: "الاختبارات", icon: ClipboardList },
];

export function ClassDetailTabs({
  active,
  onChange,
  counts,
}: {
  active: ClassTab;
  onChange: (tab: ClassTab) => void;
  counts?: Partial<Record<ClassTab, number>>;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-1.5">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none",
            active === id
              ? "bg-white text-brand-blue shadow-sm ring-1 ring-neutral-200"
              : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
          {counts?.[id] != null && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                active === id ? "bg-brand-blue/10 text-brand-blue" : "bg-neutral-200 text-neutral-600"
              )}
            >
              {counts[id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

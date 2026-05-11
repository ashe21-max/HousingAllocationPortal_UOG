"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type OverviewMetric = {
  label: string;
  value: string;
  hint: string;
};

type OverviewAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type DashboardOverviewProps = {
  eyebrow: string;
  intro: string;
  metrics: OverviewMetric[];
  actions: OverviewAction[];
};

export function DashboardOverview({
  eyebrow,
  intro,
  metrics,
  actions,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-white/15 bg-white/8 p-6 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{eyebrow}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/85">{intro}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/15 bg-black/10 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{metric.value}</p>
              <p className="mt-2 text-sm text-white/70">{metric.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-[26px] border border-white/15 bg-gradient-to-br from-white/12 to-white/6 p-6 text-white shadow-[0_16px_50px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/14"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{action.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/75">{action.description}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Open section
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

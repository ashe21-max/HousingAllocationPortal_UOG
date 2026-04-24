import Image from "next/image";
import Link from "next/link";

type BrandLockupProps = {
  href?: string;
  className?: string;
  textClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  logoSize?: number;
  stacked?: boolean;
  subtitle?: string;
};

function BrandContent({
  className,
  textClassName,
  titleClassName,
  subtitleClassName,
  logoSize = 56,
  stacked = false,
  subtitle = "House Allocation Portal",
}: Omit<BrandLockupProps, "href">) {
  return (
    <div
      className={[
        "flex items-center gap-4",
        stacked ? "flex-col items-start" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/logo.png"
        alt="University of Gondar logo"
        width={logoSize}
        height={logoSize}
        className="shrink-0 rounded-none border border-[rgba(61,52,78,0.12)] bg-white object-contain"
        priority
      />
      <div className={["grid gap-1", textClassName ?? ""].filter(Boolean).join(" ")}>
        <span
          className={[
            "font-mono text-[11px] uppercase tracking-[0.24em] text-muted",
            subtitleClassName ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          University of Gondar
        </span>
        <span
          className={[
            "font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-tight text-[var(--color-primary)]",
            titleClassName ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export function BrandLockup({ href, ...props }: BrandLockupProps) {
  if (href) {
    return (
      <Link href={href} className="w-fit">
        <BrandContent {...props} />
      </Link>
    );
  }
  return <BrandContent {...props} />;
}

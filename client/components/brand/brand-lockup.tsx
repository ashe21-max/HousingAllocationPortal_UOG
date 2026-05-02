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
  title?: string;
};

function BrandContent({
  className,
  textClassName,
  titleClassName,
  subtitleClassName,
  logoSize = 56,
  stacked = false,
  subtitle = "House Allocation Portal",
  title = "University of Gondar",
}: Omit<BrandLockupProps, "href">) {
  return (
    <div
      className={[
        "flex items-center gap-4",
        stacked ? "flex-col items-center" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/ashuman.png"
        alt="University of Gondar logo"
        width={logoSize * 4}
        height={logoSize * 2.5}
        className="object-contain flex-shrink-0"
        style={{
          width: `${logoSize * 4}px`,
          height: `${logoSize * 2.5}px`,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        priority
      />
      <div className={["grid gap-1", textClassName ?? ""].filter(Boolean).join(" ")}>
        <span
          className={[
            "font-mono text-[14px] uppercase tracking-[0.24em] text-muted font-semibold",
            subtitleClassName ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
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

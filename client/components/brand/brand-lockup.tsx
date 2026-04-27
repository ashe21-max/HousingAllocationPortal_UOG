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
        src="/ashuman.png"
        alt="University of Gondar logo"
        width={logoSize * 4} // Increased horizontal size
        height={logoSize * 2.5} // Increased vertical size
        className="shrink-0 object-contain"
        style={{
          width: "auto", // Maintain aspect ratio
          height: "auto", // Maintain aspect ratio
          maxWidth: `${logoSize * 4}px`, // Horizontal expansion
          maxHeight: `${logoSize * 2.5}px`, // Vertical expansion
          padding: 0,
          margin: 0,
          border: "none",
          background: "transparent"
        }}
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

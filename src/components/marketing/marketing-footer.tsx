import Link from "next/link";

const columns: Array<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Support", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "#" },
      { label: "X", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary/80 to-primary shadow-sm" />
            <span className="text-sm font-semibold tracking-tight">
              FitTrack
            </span>
          </div>
          <p className="mt-3 text-sm text-foreground/60">
            A modern fitness tracker built for clarity.
          </p>
        </div>

        {columns.map((c) => (
          <div key={c.title} className="space-y-3">
            <div className="text-sm font-semibold">{c.title}</div>
            <ul className="space-y-2 text-sm text-foreground/70">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href as any} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/60 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            © {new Date().getFullYear()} FitTrack. All rights reserved.
          </span>
          <span className="text-xs">Made for training, built for focus.</span>
        </div>
      </div>
    </footer>
  );
}

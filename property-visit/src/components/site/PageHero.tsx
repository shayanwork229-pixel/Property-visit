import heroImg from "@/assets/hero-villa.jpg";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image = heroImg,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <img src={image} alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="container-page relative py-14 md:py-20">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl font-display text-4xl text-on-dark md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-on-dark-muted md:text-lg">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

import { siteConfig } from "@/config/site";

export const metadata = {
  title: `${siteConfig.name} - Enterprise SaaS Template`,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Welcome to {siteConfig.name}
      </h1>
      <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
        {siteConfig.description}
      </p>
    </div>
  );
}

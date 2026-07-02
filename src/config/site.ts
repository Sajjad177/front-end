export const siteConfig = {
  name: "Enterprise SaaS App",
  description: "A production-ready SaaS application architecture built with Next.js 15.",
  url: "https://example.com",
  ogImage: "https://example.com/og.jpg",
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example/project",
  },
  mainNav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Pricing", href: "/pricing" },
    { title: "Contact", href: "/contact" },
  ],
};

export type SiteConfig = typeof siteConfig;

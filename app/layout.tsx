import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORBIS — Grow Together | Premium AI & Software Freelancing",
  description:
    "ORBIS is a premium AI and software freelancing studio. Travel through our solar system to explore our mission, services, projects, technologies, and team.",
  keywords: [
    "ORBIS",
    "AI development",
    "software freelancing",
    "web development",
    "machine learning studio",
  ],
  openGraph: {
    title: "ORBIS — Grow Together",
    description: "A cinematic journey through the solar system.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-white font-body antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

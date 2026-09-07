import "./globals.css";

const SITE_URL = process.env.SITE_URL || "https://frictionpoint.example.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Friction Point — Trust What You Carry",
    template: "%s | Friction Point",
  },
  description: "Knives, EDC, range gear and everyday equipment—curated without the noise.",
  icons: {
    icon: [
      { url: "/images/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/images/brand/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Friction Point — Trust What You Carry",
    description: "Knives, EDC, range gear and everyday equipment—curated without the noise.",
    url: SITE_URL,
    siteName: "Friction Point",
    images: ["/images/brand/apple-touch-icon.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport = {
  themeColor: "#0d0c0b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Friction Point",
              url: SITE_URL,
              logo: `${SITE_URL}/images/brand/logo-mark.png`,
              sameAs: ["https://instagram.com/Frictionpointco"],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

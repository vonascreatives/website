import type { Metadata } from "next";
import {
  Syne,
  Aladin,
  Marcellus,
} from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { ErrorProvider } from "@/contexts/error-context";
import { ErrorNotification } from "@/components/error/error-notification";
import "./globals.scss";
import "../styles/globals.css";

const gellery = localFont({
  src: [
    {
      path: "../../public/assets/fonts/gallerymodern-webfont.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gallerymodern-webfont.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gallerymodern-webfont.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--tp-ff-gallery",
});

const aladin = Aladin({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--tp-ff-aladin",
});
const syne_body = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-body",
});
const syne_heading = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-heading",
});
const syne_p = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-p",
});
const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-syne",
});
const marcellus = Marcellus({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--tp-ff-marcellus",
});

export const metadata: Metadata = {
  title: {
    default: "Vonas Media - Content Channel Lab",
    template: "%s | Vonas Media"
  },
  description: "Building digital success stories through content creation and channel management. Discover top creators, exclusive content, and innovative digital strategies.",
  keywords: ["content creation", "digital marketing", "creators", "channel management", "social media", "influencer marketing"],
  authors: [{ name: "Vonas Media" }],
  creator: "Vonas Media",
  publisher: "Vonas Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vonasmedia.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vonasmedia.com',
    title: 'Vonas Media - Content Channel Lab',
    description: 'Building digital success stories through content creation and channel management. Discover top creators, exclusive content, and innovative digital strategies.',
    siteName: 'Vonas Media',
    images: [
      {
        url: '/images/og-homepage.svg',
        width: 1200,
        height: 630,
        alt: 'Vonas Media - Premium Content Creator Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vonas Media - Content Channel Lab',
    description: 'Building digital success stories through content creation and channel management.',
    images: ['/images/og-homepage.svg'],
    creator: '@vonasmedia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body
        id="body"
        suppressHydrationWarning={true}
        className={`${gellery.variable} ${aladin.variable} ${syne_body.variable} ${syne_heading.variable} ${syne_p.variable} ${syne.variable} ${marcellus.variable}`}
      >
        <ErrorProvider>
          <ThemeProvider defaultTheme="light">
            {children}
            <ErrorNotification position="top-right" maxVisible={3} autoHideDuration={5000} />
          </ThemeProvider>
        </ErrorProvider>
        <Analytics />
        <Script id="chatwoot-sdk" strategy="lazyOnload">
          {`(function(d,t){
            var BASE_URL="https://chatwoot-wse0g-u26413.vm.elestio.app";
            var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=BASE_URL+"/packs/js/sdk.js";
            g.async=true;
            s.parentNode.insertBefore(g,s);
            g.onload=function(){
              if (window && window.chatwootSDK) {
                window.chatwootSDK.run({
                  websiteToken: 'mnaXD34NLuxvH31qRvoqjge3',
                  baseUrl: BASE_URL
                });
              }
            };
          })(document,"script");`}
        </Script>
      </body>
    </html>
  );
}

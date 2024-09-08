import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "../components/client-providers";
import CustomQueryClientProvider from "../components/custom-query-client-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";

const satoshi = localFont({
  src: [
    {
      path: "/fonts/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "/fonts/Satoshi-Bold.woff2",
      weight: "700",
    },
    {
      path: "/fonts/Satoshi-Black.woff2",
      weight: "900",
    },
    {
      path: "/fonts/Satoshi-Light.woff2",
      weight: "300",
    },
    {
      path: "/fonts/Satoshi-Regular.woff2",
      weight: "400",
    },
    {
      path: "/fonts/Satoshi-Medium.woff2",
      weight: "500",
    },
  ],
});

export const metadata: Metadata = {
  title: "Mint Your Dynamic Irys + Berachain NFT",
  description:
    "Back the ecosystem project you believe in—your NFT evolves with your $BGT, reflecting your growing commitment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en bg-primary h-full">
      <body className={satoshi.className}>
        <CustomQueryClientProvider>
          <ClientProviders>{children}</ClientProviders>
        </CustomQueryClientProvider>
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-1T5RB911RD" />
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import ClientProviders from "./components/client-providers";
const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Irys the Bera",
  description: "There's a new Bera in town and her name is Irys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en bg-primary h-full">
      <body className={roboto.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

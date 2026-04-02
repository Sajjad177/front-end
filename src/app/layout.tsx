import Provider from "@/providers/Providers";
import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "News feed",
  description: "This is a news feed website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoCondensed.variable}  font-sans antialiased`}>
        <Provider>{children}</Provider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}

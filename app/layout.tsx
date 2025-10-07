import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import TopBar from "@/components/TopBar";
import SideNav from "@/components/SideNav";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/components/I18nProvider";
import { detectLocale } from "@/lib/i18n/server";

const fontSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Magellan",
  description:
    "Magellan, carnet d’explorations intérieures avec intégration guidée."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = detectLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-magellan-smoky text-[#EEE] font-sans",
          fontSans.variable
        )}
      >
        <I18nProvider locale={locale}>
          <div className="flex min-h-screen w-full flex-col lg:flex-row">
            <SideNav />
            <div className="flex flex-1 flex-col">
              <TopBar />
              <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}

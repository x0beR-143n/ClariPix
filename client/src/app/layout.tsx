import type { Metadata } from "next";
import { Montserrat  } from "next/font/google";
import "../style/globals.css";
import AppSideBar from "../components/shared/AppSideBar";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "sonner"

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '800', '700', '900'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "ClairFix",
  description: "Image Sharing Cloud Platform",
  icons: {
    icon: "/camera1.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased relative`}
      >
        <AppSideBar/>
        <div className="ml-24" >
          {children}
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

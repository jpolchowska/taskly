import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { ACCENT_STORAGE_KEY, THEME_STORAGE_KEY } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Taskly",
  description: "Personal Kanban board with daily quotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark")document.documentElement.classList.add("dark");var a=localStorage.getItem("${ACCENT_STORAGE_KEY}");if(a)document.documentElement.style.setProperty("--brand",a);}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

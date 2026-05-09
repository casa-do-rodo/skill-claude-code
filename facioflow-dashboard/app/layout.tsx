import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/base.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import shellStyles from "@/components/layout/dashboard-shell.module.css";

export const metadata: Metadata = {
  title: "FacioFlow Dashboard",
  description: "Analytics interno da agência FacioFlow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tomorrow:wght@700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Sidebar />
        <div className={shellStyles.shell}>
          <Topbar />
          <main className={shellStyles.content}>{children}</main>
        </div>
      </body>
    </html>
  );
}

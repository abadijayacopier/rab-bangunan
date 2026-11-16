import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "RAB Bangunan | Estimasi Anggaran",
  description: "Aplikasi manajemen proyek dan rencana anggaran biaya bangunan."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
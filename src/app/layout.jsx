// app/layout.jsx
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="container mx-auto">{children}</main>
          <Footer  />
        </Providers>
      </body>
    </html>
  );
}
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Imobiliária Huambo",
  description: "A sua plataforma de imóveis no Huambo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: "#22c55e",
                  color: "white",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                  color: "white",
                },
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}

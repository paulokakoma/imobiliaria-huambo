// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import AppFlowManager from "@/components/AppFlowManager"; // <-- 1. IMPORTAR

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  /* ... */
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={
              {
                /* ... */
              }
            }
          />
          <AppFlowManager>
            {" "}
            {/* <-- 2. ENVOLVER */}
            {children}
          </AppFlowManager>
        </Providers>
      </body>
    </html>
  );
}

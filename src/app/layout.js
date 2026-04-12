import "./globals.css";
import { cookies } from "next/headers"; // Cookies import karein
import NextLoader from "@/components/NextTopLoader";
import { Geist, Geist_Mono } from "next/font/google";
import { SnackbarProvider } from "@/components/Snackbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Expense Tracker",
  description: "Professional Expense Management",
};

export default async function RootLayout({ children }) {
  // Server-side par cookie read karein
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    // Yahan data-theme add karne se flash khatam ho jayega
    <html lang="en" data-theme={theme}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <SnackbarProvider>
          <NextLoader />
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}
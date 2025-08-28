// app/layout.js (ya layout.tsx)
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Head from "next/head";

const Layout = async ({ children }) => {
  // Server-side cookies fetch
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  const firstName = cookieStore.get("firstName")?.value || null;
  const lastName = cookieStore.get("lastName")?.value || null;

  return (
    <>
      {/* Meta for mobile responsiveness */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="description" content="My Next.js App" />
      </Head>

      {/* Header */}
      <Header
        initialTheme={theme}
        initialFirstName={firstName}
        initialLastName={lastName}
      />

      {/* Page content */}
      <main>{children}</main>
    </>
  );
};

export default Layout;

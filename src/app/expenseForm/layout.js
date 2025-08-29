import { cookies } from "next/headers";
import Header from "@/components/Header";
import styles from "@/css/Header.module.css";
const Layout = async ({ children }) => {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  const firstName = cookieStore.get("firstName")?.value || null;
  const lastName = cookieStore.get("lastName")?.value || null;

  return (
    <>
      <Header initialTheme={theme} />

      <div className={styles.centerText}>
        Welcome {firstName || "Guest"} {lastName || ""}
      </div>
      {children}
    </>
  );
};

export default Layout;

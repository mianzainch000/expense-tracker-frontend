import { useEffect, useState } from "react";
import styles from "@/css/Loader.module.css";

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Dummy simulation of progress increase
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
        <span className={styles.percent}>{progress}%</span>
      </div>
    </div>
  );
};

export default Loader;

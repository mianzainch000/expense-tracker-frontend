"use client";
import styles from "@/css/Snackbar.module.css";
import React, { createContext, useContext, useEffect, useState } from "react";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("error");
  const [duration, setDuration] = useState(4000);
  const [position, setPosition] = useState("top-right");
  const [animation, setAnimation] = useState("slide-left");

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  const showAlertMessage = ({
    message,
    type = "error",
    duration = 4000,
    position = "top-right",
    animation = "slide-right",
  }) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setPosition(position);
    setAnimation(animation);
    setOpen(true);
  };

  const getClasses = () => {
    return `${styles.snackbar} ${styles[type]} ${styles[position]} ${styles[animation]}`;
  };

  return (
    <SnackbarContext.Provider value={showAlertMessage}>
      {children}
      {open && (
        <div className={getClasses()}>
          <span dangerouslySetInnerHTML={{ __html: message }} />
          <button className={styles.close} onClick={() => setOpen(false)}>
            &times;
          </button>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

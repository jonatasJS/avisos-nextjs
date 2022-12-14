import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
// import bcpt from 'bcrypt';

import Clock from "../Clock";
import Logo from "../Logo";

import { FaArrowCircleUp } from "react-icons/fa";

import styles from "./styles.module.scss";

let lay: HTMLElement | null = null;

export default function Layout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [isVisibled, setIsVisibled] = useState(false);
  const [isLogo, setIsLogo] = useState<"logo" | "clock">("logo");

  const scrollToTop = () => {
    lay = document.getElementById("layout");
    if (lay !== null) {
      lay.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    setIsVisibled(false);
  };

  useEffect(() => {
    lay = window.document.getElementById("layout");

    const toggleVisibility = () => {
      const scroll = window.document.getElementById("layout");
      if (scroll !== null) {
        if (scroll.scrollTop > 300) {
          setIsVisibled(true);
        } else {
          setIsVisibled(false);
        }
      }
    };

    window.document
      .getElementById(styles.dashboard)
      ?.addEventListener("scroll", toggleVisibility);
  }, []);

  // alterar o logo acada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLogo((isLogo) => (isLogo === "logo" ? "clock" : "logo"));
    }, 10000);

    return () => clearInterval(interval);
  }, [isLogo]);

  return (
    <AnimatePresence exitBeforeEnter>
      {route.pathname === "/" && (
        <Link href="/dashboard">
          <motion.a
            // flicker animation
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: .5,
            }}
            key={`${isLogo + Math.random()}`}
            className="mt-20"
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
              marginTop: "60px",
              marginBottom: "60px",
              letterSpacing: "5px",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            {isLogo === "logo" ? <Logo /> : <Clock />}
          </motion.a>
        </Link>
      )}
      {route.pathname === "/" ? (
        <div
          id="layout"
          style={{
            position: "relative",
            height: "100% !important",
            overflowY: route.pathname === "/" ? "hidden" : "auto",
          }}
          className={styles.container}
        >
          {children}
        </div>
      ) : (
        <div
          style={{
            height: "100% !important",
            width: route.pathname !== "/" ? "100%" : "90% !important",
          }}
          id="layout"
        >
          {children}
        </div>
      )}
      <ToastContainer />
      <div
        className={styles.button}
        style={{
          display: isVisibled && route.pathname !== "/" ? "inline" : "none",
        }}
      >
        <FaArrowCircleUp onClick={scrollToTop} />
      </div>
    </AnimatePresence>
  );
}

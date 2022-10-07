import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";

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

    console.log(lay);

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
      .getElementById("layout")
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
    <>
      {route.pathname === "/" && (
        <Link href="/dashboard">
          <motion.a
            // flicker animation
            animate={{
              opacity: [1, 1.1, 1.1, 1, 1],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1]
            }}
            key={isLogo}
            className="mt-20"
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginTop: "60px",
              marginBottom: "60px",
              letterSpacing: "5px",
              cursor: "pointer",
            }}
          >
            {isLogo === "logo" ? <Logo /> : <Clock />}
          </motion.a>
        </Link>
      )}
      <div
        id="layout"
        style={{
          position: "relative",
          overflowY:
            route.pathname === "/" || route.pathname.includes("/login")
              ? "hidden"
              : "auto",
        }}
        className={styles.container}
      >
        {children}
        <ToastContainer />
      </div>
      <div
        className={styles.button}
        style={{
          display: isVisibled && route.pathname !== "/" ? "inline" : "none",
        }}
      >
        <FaArrowCircleUp onClick={scrollToTop} />
      </div>
    </>
  );
}

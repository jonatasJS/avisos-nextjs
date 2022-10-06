import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

import { FaArrowCircleUp } from "react-icons/fa";

import Logo from "../Logo";
import styles from "./styles.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  const route = useRouter();
  const [isVisibled, setIsVisibled] = useState(false);

  const lay = window.document.getElementById("layout");

  const scrollToTop = () => {
    if (lay !== null) {
      lay.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    setIsVisibled(false);
  };

  useEffect(() => {
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

  return (
    <>
      {route.pathname === "/" && (
        <div
          className="mt-20"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
            marginBottom: "-20px",
          }}
        >
          <Logo />
        </div>
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

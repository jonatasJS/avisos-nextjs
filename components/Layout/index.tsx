import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import Logo from "../Logo";
import styles from "./styles.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  const route = useRouter();

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
    </>
  );
}

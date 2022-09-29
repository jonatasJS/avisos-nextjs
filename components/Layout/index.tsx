import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import styles from "./styles.module.scss";

export default function Layout({ children }: {
  children: React.ReactNode;
}) {
  const route = useRouter();
 
  return (
    <div style={{
      overflowY: route.pathname === "/" ? "hidden" : "auto",
    }} className={styles.container}>
      {children}

      <ToastContainer />
    </div>
  );
}
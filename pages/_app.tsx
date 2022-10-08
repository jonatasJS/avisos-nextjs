import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import { io } from "socket.io-client";

import Layout from "../components/Layout";

// import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.scss";


export const socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
  transports: ["websocket"],
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Layout>
      <style>
        {`
          #__next {
            justify-content: ${router.pathname.includes("/login") ? "center" : "start"};
            align-items: center;
          }
        `}
      </style>
      <link
        href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet" />
      <Script
        src="https://kit.fontawesome.com/52b387c788.js"
        crossOrigin="anonymous"
      />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

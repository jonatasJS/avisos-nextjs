import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import NextNProgress from "nextjs-progressbar";

import Layout from "../components/Layout";

import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.scss";
import Head from "next/head";

export const socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
  transports: ["websocket"],
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Layout>
      <Head
        key={router.pathname}
      >
        <style>
          {`
          #__next {
            justify-content: ${
              router.pathname.includes("/login") ? "center" : "start"
            };
            align-items: center;
          }
        `}
        </style>
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet" />
        <script
          src="https://kit.fontawesome.com/52b387c788.js"
          crossOrigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"
          crossOrigin="anonymous"
        />

        <script
          src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
          crossOrigin="anonymous"
        />

        <script
          src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
          integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextNProgress
        color="#FF6F21"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{
          showSpinner: false,
        }}
      />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

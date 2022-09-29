import type { AppProps } from "next/app";
import Script from "next/script";

import Layout from "../components/Layout";

import 'react-toastify/dist/ReactToastify.css';
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout> 
      <link
        href="https://emoji-css.afeld.me/emoji.css"
        rel="stylesheet"
      />
      <Script
        src="https://kit.fontawesome.com/52b387c788.js"
        crossOrigin="anonymous"
      />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

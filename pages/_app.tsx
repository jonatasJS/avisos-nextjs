import type { AppProps } from "next/app";
import Script from "next/script";

import Layout from "../components/Layout";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Script
        src="https://kit.fontawesome.com/52b387c788.js"
        crossOrigin="anonymous"
      />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

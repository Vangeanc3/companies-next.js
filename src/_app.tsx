import GlobalStyle from "./theme/GlobalStyle";
import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}

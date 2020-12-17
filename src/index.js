import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { init as webGLInit } from "./webgl";

const showWebGL = window.location.pathname === "/webgl";
if (showWebGL) {
  webGLInit();
} else {
  const rootElement = document.getElementById("root");
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
}

import React from "react";
import ReactDOM from "react-dom";
//import "./index.css";
import { App } from "./App.jsx";
import { Helmet, HelmetProvider } from "react-helmet-async";

ReactDOM.render(
  <HelmetProvider>
    <App>
      <Helmet>
        <title>3D Pulsar Generator</title>
      </Helmet>
    </App>
  </HelmetProvider>,
  document.getElementById("root")
);

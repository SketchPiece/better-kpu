import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./global.css";

const injectedBody = `
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
`;

document
  .querySelectorAll('link[rel="stylesheet"]')
  .forEach((link) => link.remove());

document.body.innerHTML = injectedBody;
const root = document.getElementById("root")!;
document.body.classList.add("show");

// Add Inter font
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

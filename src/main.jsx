import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "/src/App.jsx";
import "/src/styles/theme.css";
import { AuthProvider } from '/src/context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set favicon dynamically (works even if index.html isn't edited)
const setFavicon = (href) => {
  try {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = href;
  } catch (e) {
    // ignore during SSR or non-browser envs
  }
};

setFavicon('/assets/ITO.png');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={4000} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

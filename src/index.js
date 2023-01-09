import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTlxXgLK6ehXyFeR4VwuQQHRMCbv4FXZ8",
  authDomain: "guestbook-f6b49.firebaseapp.com",
  projectId: "guestbook-f6b49",
  storageBucket: "guestbook-f6b49.appspot.com",
  messagingSenderId: "484229230563",
  appId: "1:484229230563:web:7306e9a8d5a76bcb5bfad6",
  measurementId: "G-QND7MF83H7",
};

firebase.initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

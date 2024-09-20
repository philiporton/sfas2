import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Navigation from "./components/Navigation";

import "./styles/index.css";
import "bootstrap/dist/css/bootstrap.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Navigation />
                <App />
            </>
        )
    },
    {
        path: "/newPage",
        element: (
            <>
                <Navigation />
                <App />
                <App />
                <App />
            </>
        )
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

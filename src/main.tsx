import "@/index.css";
import router from "@/router";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F65F42",
          colorLink: "#F65F42",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>
);

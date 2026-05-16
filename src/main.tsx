import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { ConfigProvider } from "antd";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <ConfigProvider>
    <RouterProvider router={router} />
  </ConfigProvider>,
);

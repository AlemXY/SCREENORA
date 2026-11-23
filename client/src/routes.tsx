import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Directores from "./pages/Directores";
import Catalogo from "./pages/Catalogo";
import Pagina404 from "./pages/Pagina404";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "directores",
        element: <Directores />,
      },
      {
        path: "catalogo",
        element: <Catalogo />,
      },
      {
        path: "*",
        element: <Pagina404 />,
      },
    ],
  },
]);

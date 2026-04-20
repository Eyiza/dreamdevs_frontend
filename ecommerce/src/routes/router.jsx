import { createBrowserRouter } from "react-router";
import Login from "../auth/Login";
import Products from "../components/products/Products";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/products",
        element: <Products />
    },
])

export default router;
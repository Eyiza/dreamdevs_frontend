import { createBrowserRouter } from "react-router";
import Login from "../auth/Login";
import Product from "../components/products/Product";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/products",
        element: <Product />
    },
])

export default router;
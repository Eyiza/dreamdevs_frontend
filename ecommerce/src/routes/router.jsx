import { createBrowserRouter } from "react-router";
import Login from "../auth/Login";
import Products from "../components/products/Products";
import Product from "../components/products/Product";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/products",
        element: <Products />
    },
    {
        path: "/product/:id",
        element: <Product />
    }

])

export default router;
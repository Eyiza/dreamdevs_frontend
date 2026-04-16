import { createBrowserRouter } from "react-router";
import Login from "../auth/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    }
])

export default router;
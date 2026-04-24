import { createBrowserRouter } from "react-router";
import Home from "../components/Home";
import CreateElection from "../components/CreateElection";
import ElectionDetail from "../components/ElectionDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/elections/create",
        element: <CreateElection />
    },
    {
        path: "/election/:id",
        element: <ElectionDetail />
    }
])

export default router;
import { createBrowserRouter } from "react-router";
import Home from "../components/Home";
import CreateElection from "../components/CreateElection";
import ElectionDetail from "../components/ElectionDetail";
import RegisterVoter from "../components/RegisterVoter";
import Candidates from "../components/Candidates";

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
    },
    {
        path: "/register",
        element: <RegisterVoter />
    },
    {
        path: "/election/:electionId/candidates", 
        element: <Candidates />
    }
])

export default router;
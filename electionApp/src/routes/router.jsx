import { createBrowserRouter } from "react-router";
import Home from "../components/Home";
import CreateElection from "../components/CreateElection";
import ElectionDetail from "../components/ElectionDetail";
import RegisterVoter from "../components/RegisterVoter";
import Candidates from "../components/Candidates";
import Vote from "../components/Vote";

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
    },
    {
        path: "/vote",
        element: <Vote />
    },
    {
        path: "/election/:electionId/vote",
        element: <Vote />
    }
])

export default router;
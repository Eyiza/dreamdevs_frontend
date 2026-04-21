import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8080";

export const electionAppApi = createApi({
    reducerPath: "electionAppApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),

    endpoints: (build) => ({
        // Elections
        getElections: build.query({
            query: () => "/elections"
        }),
        createElection: build.mutation({
            query: (body) => ({
                url: "/elections",
                method: "POST",
                body
            })
        }),
        getElectionById: build.query({
            query: (id) => `/elections/${id}`
        }),
        // Positions
        createPosition: build.mutation({
            query: (body) => ({
                url: "/position",
                method: "POST",
                body
            })
        }),
        getPositionById: build.query({
            query: (id) => `/position/${id}`
        }),
        getPositionsByElectionId: build.query({
            query: (electionId) => `/election/${electionId}/positions`
        }),
        // Candidates
        createCandidate: build.mutation({
            query: (body) => ({
                url: "/candidate",
                method: "POST",
                body
            })
        }),
        getCandidates: build.query({
            query: (electionId) => `/election/${electionId}/candidates`
        }),
        getCandidateById: build.query({
            query: (id) => `/candidate/${id}`
        }),
        searchCandidates: build.query({
            query: ({ electionId, firstName, lastName }) => ({
                url: `/election/${electionId}/candidates/search`,
                params: {firstName, lastName }
            })
        }),
        getResults: build.query({
            query: () => "/results"
        }),
        getResultByPosition: build.query({
            query: (position) => `/results/${positionId}`
        }),
        // Voters
        createVoter: build.mutation({
            query: (body) => ({
                url: "/voter",
                method: "POST",
                body
            })
        }),
        getVoters: build.query({
            query: () => "/voters"
        }),
        getVoterById: build.query({
            query: (id) => `/voter/${id}`
        }),
        vote: build.mutation({
            query: (body) => ({
                url: "/vote",
                method: "PATCH",
                body
            })
        })
    })
});

// The name useCreateElectionMutation is generated based on the name of the endpoint, "createElection", and the type of operation, "mutation".
export const { 
    useGetElectionsQuery, useCreateElectionMutation, useGetElectionByIdQuery,
    useCreatePositionMutation, useGetPositionByIdQuery, useGetPositionsByElectionIdQuery,
    useCreateCandidateMutation, useGetCandidatesQuery, useGetCandidateByIdQuery, useSearchCandidatesQuery,
    useGetResultsQuery, useGetResultByPositionQuery,
    useCreateVoterMutation, useGetVotersQuery, useGetVoterByIdQuery, useVoteMutation 
} = electionAppApi;
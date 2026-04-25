import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8080";

export const electionAppApi = createApi({
    reducerPath: "electionAppApi",

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),

    tagTypes: ["Elections", "Positions", "Candidates", "Voters", "Results"],
    refetchOnFocus: true,
    refetchOnReconnect: true,

    endpoints: (build) => ({
        // Elections
        getElections: build.query({
            query: () => "/elections",
            providesTags: ["Elections"] // This will mark the "Elections" tag as provided whenever this query is successful
        }),
        createElection: build.mutation({
            query: (body) => ({
                url: "/election",
                method: "POST",
                body
            }),
            invalidatesTags: ["Elections"] // This will mark the "Elections" tag as invalidated whenever this mutation is successful, prompting a refetch of any queries that provide this tag (like getElections)
        }),
        getElectionById: build.query({
            query: (id) => `/election/${id}`
        }),
        // Positions
        createPosition: build.mutation({
            query: (body) => ({
                url: "/position",
                method: "POST",
                body
            }),
            invalidatesTags: (result, error, body) => [
                { type: "Positions", id: body.electionId }
            ]
        }),
        getPositionById: build.query({
            query: (id) => `/position/${id}`
        }),
        getPositionsByElectionId: build.query({
            query: (electionId) => `/election/${electionId}/positions`,
            providesTags: (result, error, id) => [
                { type: "Positions", id },
            ],
        }),
        // Candidates
        createCandidate: build.mutation({
            query: (body) => ({
                url: "/candidate",
                method: "POST",
                body
            }),
            invalidatesTags: (result, error, body) => [
                { type: "Candidates", id: body.electionId }
            ]
        }),
        getCandidates: build.query({
            query: (electionId) => `/election/${electionId}/candidates`,
            providesTags: (result, error, id) => [
                { type: "Candidates", id },
            ],
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
            query: () => "/results",
            providesTags: ["Results"]
        }),
        getResultByPosition: build.query({
            query: (positionId) => `/results/${positionId}`,
            providesTags: (result, error, id) => [
                { type: "Results", id },
            ],
        }),
        // Voters
        createVoter: build.mutation({
            query: (body) => ({
                url: "/voter",
                method: "POST",
                body
            }),
            invalidatesTags: ["Voters"]
        }),
        getVoters: build.query({
            query: () => "/voters",
            providesTags: ["Voters"]
        }),
        getVoterById: build.query({
            query: (id) => `/voter/${id}`
        }),
        vote: build.mutation({
            query: (body) => ({
                url: "/vote",
                method: "PATCH",
                body
            }),
            invalidatesTags: ["Voters", "Results"]
        })
    })
});

export const { 
    useGetElectionsQuery, useCreateElectionMutation, useGetElectionByIdQuery,
    useCreatePositionMutation, useGetPositionByIdQuery, useGetPositionsByElectionIdQuery,
    useCreateCandidateMutation, useGetCandidatesQuery, useGetCandidateByIdQuery, useSearchCandidatesQuery,
    useGetResultsQuery, useGetResultByPositionQuery,
    useCreateVoterMutation, useGetVotersQuery, useGetVoterByIdQuery, useVoteMutation 
} = electionAppApi;
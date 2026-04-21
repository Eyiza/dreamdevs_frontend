import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8080";

export const electionAppApi = createApi({
    reducerPath: "electionAppApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),

    endpoints: (build) => ({
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
        })
    })
});

// The name useCreateElectionMutation is generated based on the name of the endpoint, "createElection", and the type of operation, "mutation".
export const { useGetElectionsQuery, useCreateElectionMutation, useGetElectionByIdQuery } = electionAppApi;
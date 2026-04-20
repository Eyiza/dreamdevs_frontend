import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://fakestoreapi.com";

export const fakeStoreApi = createApi({
    // Unique key that defines where the Redux store will store our cache.
    reducerPath: "fakeApi",

    // Initial state of the API slice
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),

    // The "endpoints" represent operations and requests for this server.
    endpoints: (build) => ({
        login: build.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body
            })
        }),
        getAllProducts: build.query({
            query: () => "/products"
        }),
        getProductById: build.query({
            query: (id) => `/products/${id}`
        })
    })
});

// The name useLoginMutation is generated based on the name of the endpoint, "login", and the type of operation, "mutation".
export const { useLoginMutation, useGetAllProductsQuery, useGetProductByIdQuery } = fakeStoreApi;
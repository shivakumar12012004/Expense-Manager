import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURI = 'http://localhost:5000';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseURI }),
    tagTypes: ['categories', 'transactions'], // Declare tag types for consistency
    endpoints: (builder) => ({
        // get categories
        getCategories: builder.query({
            // GET: 'http://localhost:5000/api/categories'
            query: () => '/api/categories',
            providesTags: ['categories'],
        }),

        // get labels (or transactions)
        getLabels: builder.query({
            // GET: 'http://localhost:5000/api/transaction'
            query: () => '/api/transaction',
            providesTags: ['transactions'], // Changed tag for consistency
        }),

        // add new Transaction
        addTransaction: builder.mutation({
            query: (initialTransaction) => ({
                // POST: 'http://localhost:5000/api/transaction'
                url: '/api/transaction',
                method: 'POST',
                body: initialTransaction,
            }),
            invalidatesTags: ['transactions'], // Updated tag for consistency
        }),

        // delete record
        deleteTransaction: builder.mutation({
            query: (recordId) => ({
                url: `/api/transaction/${recordId}`, // Pass the recordId in the URL
                method: 'DELETE',
            }),
            invalidatesTags: ['transactions'], // Updated tag for consistency
        }),
    }),
});

export default apiSlice;

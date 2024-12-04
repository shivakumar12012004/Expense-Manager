import React, { useEffect, useState } from 'react';
import { default as api } from '../store/apiSlice';

export default function List() {
    const [transactions, setTransactions] = useState("");
    const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();

    // Update the UI based on the query state
    useEffect(() => {
        if (isFetching) {
            setTransactions(<div>Fetching...</div>);
        } else if (isSuccess && data) {
            setTransactions(
                data.map((v, i) => <Transaction key={i} category={v}></Transaction>)
            );
        } else if (isError) {
            setTransactions(<div>Error in fetching data.</div>);
        }
    }, [data, isFetching, isSuccess, isError]);

    return (
        <div className='flex flex-col py-6 gap-3'>
            <h1 className='py-4 font-bold text-xl'>History</h1>
            {transactions}
        </div>
    );
}

function Transaction({ category }) {
    const [deleteTransaction] = api.useDeleteTransactionMutation();

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id).unwrap(); // Perform the delete operation
            console.log('Transaction deleted:', id);
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    if (!category) return null; // Return null if no category data is available

    return (
        <div
            className='item flex justify-center bg-gray-50 py-2 rounded-r'
            style={{ borderRight: `8px solid ${category.color ?? "#e5e5e5"}` }}
        >
            <button
                className="Delete px-3 bg-red-500 text-white rounded"
                onClick={() => handleDelete(category._id)} // Use category._id to delete
            >
                Delete
            </button>
            <span className='block w-full'>{category.name ?? ""}</span>
            <span className='block w-full'>{category.amount ?? 0}</span>
        </div>
    );
}

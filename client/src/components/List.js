import React, { useEffect, useState } from 'react';
import { default as api } from '../store/apiSlice';

export default function List() {
    const [transactions, setTransactions] = useState("");
    const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();

    useEffect(() => {
        if (isFetching) {
            setTransactions(<div className="text-gray-500">Loading...</div>);
        } else if (isSuccess && data) {
            setTransactions(
                data.map((v, i) => <Transaction key={i} category={v} />)
            );
        } else if (isError) {
            setTransactions(
                <div className="text-red-500">Failed to fetch data. Please try again later.</div>
            );
        }
    }, [data, isFetching, isSuccess, isError]);

    return (
        <div className="history-container bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h1>
            <div className="flex flex-col gap-4">{transactions}</div>
        </div>
    );
}

function Transaction({ category }) {
    const [deleteTransaction] = api.useDeleteTransactionMutation();

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id).unwrap();
            console.log('Transaction deleted:', id);
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    if (!category) return null;

    return (
        <div
            className="transaction-item flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-all"
            style={{ borderLeft: `8px solid ${category.color ?? "#e5e5e5"}` }}
        >
            <span className="text-md font-medium text-gray-700">{category.name ?? "Unknown"}</span>
            <span className="text-md font-medium text-gray-700">${category.amount ?? 0}</span>
            <button
                className="delete-btn bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md shadow-sm transition-all"
                onClick={() => handleDelete(category._id)}
            >
                Delete
            </button>
        </div>
    );
}

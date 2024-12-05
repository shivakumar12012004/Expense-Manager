import React from 'react';
import { useForm } from 'react-hook-form';
import { default as api } from '../store/apiSlice';
import List from './List';

export default function Form() {
    const { register, handleSubmit, resetField } = useForm();
    const [addTransaction] = api.useAddTransactionMutation();

    const onSubmit = async (data) => {
        if (!data) return;
        await addTransaction(data).unwrap();
        resetField('name');
        resetField('amount');
    };

    return (
        <div className="form-container bg-white shadow-lg rounded-lg p-6 mx-auto max-w-sm w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h1>
            <form id="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="input-group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        placeholder="e.g., Salary, Rent, Groceries"
                        className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                    </label>
                    <select
                        id="type"
                        className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...register('type')}
                    >
                        <option value="Investment">Investment</option>
                        <option value="Expense">Expense</option>
                        <option value="Savings">Savings</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <input
                        id="amount"
                        type="text"
                        {...register('amount')}
                        placeholder="e.g., 5000"
                        className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="submit-btn">
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                    >
                        Add Transaction
                    </button>
                </div>
            </form>
            <div className="mt-8">
                <List />
            </div>
        </div>
    );
}

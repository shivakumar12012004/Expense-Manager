import React from 'react';
import { default as api } from '../store/apiSlice';

export default function Labels() {
    const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();

    let Transactions;

    if (isFetching) {
        Transactions = <div>Loading...</div>;
    } else if (isSuccess) {
        // Aggregate data by type
        const aggregatedData = data.reduce((acc, item) => {
            const { type, amount } = item;
            if (!acc[type]) {
                acc[type] = 0;
            }
            acc[type] += amount;
            return acc;
        }, {});

        // Calculate total amount
        const totalAmount = Object.values(aggregatedData).reduce((sum, val) => sum + val, 0);

        // Add percentage calculation to each type
        const aggregatedWithPercentages = Object.entries(aggregatedData).map(([type, amount]) => ({
            type,
            amount,
            percentage: ((amount / totalAmount) * 100).toFixed(2), // Keep two decimal points
            color: getColorForType(type), // Assign a distinct color
        }));

        // Map the aggregated data into components
        Transactions = aggregatedWithPercentages.map((entry, index) => (
            <LabelComponent key={index} data={entry} />
        ));
    } else if (isError) {
        Transactions = <div className="text-red-500">Error fetching data. Please try again.</div>;
    }

    return (
        <div className="labels-container py-4 px-6 bg-white rounded-md shadow-md">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Transaction Breakdown</h3>
            {Transactions}
        </div>
    );
}

function LabelComponent({ data }) {
    if (!data) {
        return <div className="text-red-500">Error loading label.</div>;
    }

    return (
        <div className="label-item flex flex-col py-2 gap-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: data.color ?? '#f9c74f' }}
                        title={`Type: ${data.type}`}
                    ></div>
                    <h3 className="text-md font-medium text-gray-700 capitalize">{data.type ?? 'N/A'}</h3>
                </div>
                <h3 className="font-semibold text-gray-800">{data.percentage ?? 0}%</h3>
            </div>
            <div
                className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                title={`Amount: ${data.amount}`}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${data.percentage}%`,
                        background: data.color ?? '#f9c74f',
                    }}
                ></div>
            </div>
        </div>
    );
}

// Utility function to assign distinct colors
function getColorForType(type) {
    const colors = {
        food: '#ff6384',
        rent: '#36a2eb',
        shopping: '#ffce56',
        travel: '#4bc0c0',
        other: '#9966ff',
    };

    return colors[type.toLowerCase()] ?? '#f9c74f'; // Default color
}


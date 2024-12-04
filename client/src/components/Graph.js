import { ArcElement, Chart } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { default as api1 } from '../store/apiSlice';
import Labels from './Lables';

Chart.register(ArcElement);

export default function Graph() {
    const [chartData, setChartData] = useState(null); // For Doughnut data
    const [totalAmount, setTotalAmount] = useState(0); // For total amount display
    const { data, isFetching, isSuccess, isError } = api1.useGetLabelsQuery();

    useEffect(() => {
        if (isSuccess && data) {
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
            const total = Object.values(aggregatedData).reduce((sum, val) => sum + val, 0);
            setTotalAmount(total);

            // Prepare chart data
            const doughnutData = {
                labels: Object.keys(aggregatedData), // Types
                datasets: [
                    {
                        data: Object.values(aggregatedData).map(
                            (amount) => ((amount / total) * 100).toFixed(2) // Percentages
                        ),
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 255)',
                        ],
                        hoverOffset: 4,
                        borderRadius: 30,
                        spacing: 10,
                    },
                ],
            };

            setChartData(doughnutData);
        }
    }, [data, isSuccess]);

    if (isFetching) return <div>Loading...</div>;
    if (isError) return <div>Error in fetching data.</div>;

    return (
        <>
            <div className="flex justify-content max-w-xs mx-auto">
                <div className="item">
                    <div className="chart relative">
                        {chartData && <Doughnut data={chartData} options={{ cutout: 115 }} />}
                        <h3 className="title mt-4 mb-4 font-bold text-4xl">
                        Total
                        <span className="block text-5xl text-emerald-400 mt-2">${totalAmount}</span>
                        </h3>

                    </div>
                    <div className="flex flex-col py-10 gap-4">
                        {/* Labels */}
                        <Labels />
                    </div>
                </div>
            </div>
        </>
    );
}
import { ArcElement, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { default as api1 } from '../store/apiSlice';
import Labels from './Lables';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale);

export default function Graph() {
    const [chartData, setChartData] = useState(null); // For chart data
    const [totalAmount, setTotalAmount] = useState(0); // For total amount display
    const [graphType, setGraphType] = useState('Doughnut'); // Track selected graph type
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
            const chartDataset = {
                labels: Object.keys(aggregatedData), // Types
                datasets: [
                    {
                        data: Object.values(aggregatedData),
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

            setChartData(chartDataset);
        }
    }, [data, isSuccess]);

    if (isFetching) return <div>Loading...</div>;
    if (isError) return <div>Error in fetching data.</div>;

    const renderGraph = () => {
        switch (graphType) {
            case 'Doughnut':
                return <Doughnut data={chartData} options={{ cutout: 115 }} />;
            case 'Pie':
                return <Pie data={chartData} />;
            case 'Bar':
                return (
                    <Bar
                        data={chartData}
                        options={{
                            indexAxis: 'y', // Horizontal Bar
                            scales: {
                                x: { beginAtZero: true },
                            },
                        }}
                    />
                );
            default:
                return <Doughnut data={chartData} options={{ cutout: 115 }} />;
        }
    };

    return (
        <>
            <div className="flex justify-content max-w-xs mx-auto">
                <div className="item">
                    <div className="chart relative">
                        <div className="mb-4">
                            {/* Dropdown to select graph type */}
                            <select
                                className="p-2 border rounded-md"
                                value={graphType}
                                onChange={(e) => setGraphType(e.target.value)}
                            >
                                <option value="Doughnut">Doughnut</option>
                                <option value="Pie">Pie</option>
                                <option value="Bar">Bar</option>
                            </select>
                        </div>
                        {chartData && renderGraph()}
                        <h3 className="title mt-4 mb-4 font-bold text-4xl">
                            Total
                            <span className="block text-5xl text-emerald-400 mt-2">
                                ${totalAmount}
                            </span>
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

import React from 'react';
import { default as api } from '../store/apiSlice';


export default function Labels() {

    const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();

let Transactions;

if (isFetching) {
    Transactions = <div>Fetching...</div>;
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
    }));

    // Map the aggregated data into components
    Transactions = aggregatedWithPercentages.map((entry, index) => (
        <LableComponent key={index} data={entry} ></LableComponent>
    ));
} else if (isError) {
    Transactions = <div>Error in fetching</div>;
}



return (
    <div className=' justify-between py-3'>
    {Transactions}
    </div>
)
}

function LableComponent({data}){
    if(!data){
        return<>Error in featching in LableComponents</>;}
    return(
        <div className='labels flex justify-between'>
            <div className='flex gap-2'>
                <div className='w-2 h-2 rounded py-3' style={{background:data.color??'#f9c74f'}}></div>
                <h3 className='text-md shadow-md rounded px-1 '>{data.type??""}</h3>
            </div>
            <h3 className='font-bold'>{data.percentage??0}%</h3>
        </div>
    )
}




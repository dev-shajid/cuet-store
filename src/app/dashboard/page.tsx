import DashboardAreaChart from '@/components/DashboardAreaChart'
import { Card, CardHeader } from '@/components/ui/card'
import { RefreshCcw, TrendingDown, TrendingUp, Truck } from 'lucide-react'
import React from 'react'

const statisticData = [
    {
        title: "Total Revenue",
        value: 50450,
        icon: <div className='flex justify-center items-center rounded-full size-12 bg-green-500/20 text-green-500'>
            <TrendingUp size={24} />
        </div>
    },
    {
        title: "Total Spend",
        value: 3020,
        icon: <div className='flex justify-center items-center rounded-full size-12 bg-red-500/20 text-red-500'>
            <TrendingDown size={24} />
        </div>
    },
    {
        title: "Total Order",
        value: 52,
        icon: <div className='flex justify-center items-center rounded-full size-12 bg-indigo-500/20 text-indigo-500'>
            <RefreshCcw size={24} />
        </div>
    },
    {
        title: "Processing Order",
        value: 12,
        icon: <div className='flex justify-center items-center rounded-full size-12 bg-orange-500/20 text-orange-600'>
            <Truck size={24} />
        </div>
    },
]

export default function DashboardPage() {
    return (
        <div className='space-y-12'>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    statisticData.map((data, index) => (
                        <Card key={index} className="bg-background/40 backdrop-blur-md text-foreground">
                            <CardHeader className='sm:flex-row flex-col-reverse gap-4 justify-between items-center'>
                                <div>
                                    <span className='text-sm'>{data.title}</span>
                                    <h4>{data.value}</h4>
                                </div>
                                {data.icon}
                            </CardHeader>
                        </Card>

                    ))
                }
            </div>

            <DashboardAreaChart />
        </div>
    )
}

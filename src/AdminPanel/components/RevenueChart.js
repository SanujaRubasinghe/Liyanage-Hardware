import React, {useEffect, useState} from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

import API from "../api";

const RevenueChart = () => {
    const [data, setData] = useState([])
    const [range, setRange] = useState('month')

    useEffect(() => {
        const getRevenueData = async () => {
            const {data} = await API.get(`/revenue/${range}`)
            setData(data)
        }
        getRevenueData()
    }, [range])

    return(
        <div className="w-full h-[400px] bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Revenue ({range})</h3>
          <div className="space-x-2">
            {['day', 'month', 'year'].map((option) => (
              <button
                key={option}
                onClick={() => setRange(option)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  range === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {option === 'day' ? 'Today' : option === 'month' ? 'This Month' : 'This Year'}
              </button>
            ))}
          </div>
        </div>
  
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis tickFormatter={(value) => `Rs.${value}`} className="text-xs" />
              <Tooltip formatter={(value) => `Rs.${value}`} />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
}

export default RevenueChart;
'use client'

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'

type TrendPoint = { date: string; bookings: number; revenue: number }
type NamedCount = { name: string; value: number }

const COLORS = ['#3B2285', '#22c55e', '#f59e0b', '#ef4444', '#767575']

export default function DashboardCharts({
  trendData,
  statusData,
  categoryData,
}: {
  trendData: TrendPoint[]
  statusData: NamedCount[]
  categoryData: NamedCount[]
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-secondary rounded-2xl p-5 lg:col-span-2">
        <h2 className="font-heading font-bold mb-4">Bookings & Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis yAxisId="left" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" fontSize={12} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3B2285" name="Bookings" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue (₦)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-secondary rounded-2xl p-5">
        <h2 className="font-heading font-bold mb-4">Booking Status</h2>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-secondary rounded-2xl p-5">
        <h2 className="font-heading font-bold mb-4">Bookings by Category</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={11} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#3B2285" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
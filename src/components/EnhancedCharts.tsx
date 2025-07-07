
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend } from 'recharts';

interface Metrics {
  leads: number;
  qualifiedLeads: number;
  siteVisits: number;
  bookings: number;
  cpl: number;
  cpql: number;
  cpsv: number;
  cpb: number;
  totalBudget: number;
}

interface EnhancedChartsProps {
  metrics: Metrics;
  chartData: any[];
  duration: string;
}

const COLORS = ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981'];

const EnhancedCharts: React.FC<EnhancedChartsProps> = ({ metrics, chartData, duration }) => {
  // Data for donut chart showing conversion funnel
  const conversionData = [
    { name: 'Leads', value: metrics.leads, color: '#ec4899' },
    { name: 'Qualified Leads', value: metrics.qualifiedLeads, color: '#8b5cf6' },
    { name: 'Site Visits', value: metrics.siteVisits, color: '#f59e0b' },
    { name: 'Bookings', value: metrics.bookings, color: '#10b981' }
  ];

  // Data for horizontal bar chart showing cost comparison
  const costData = [
    { name: 'CPL', value: metrics.cpl, color: '#ec4899' },
    { name: 'CPQL', value: metrics.cpql, color: '#8b5cf6' },
    { name: 'CPSV', value: metrics.cpsv, color: '#f59e0b' },
    { name: 'CPB', value: metrics.cpb / 1000, color: '#10b981' } // Convert to thousands for better visualization
  ];

  // Custom tooltip for donut chart
  const CustomDonutTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = conversionData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white">
          <p className="font-semibold">{data.name}</p>
          <p className="text-lg">₹{data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-300">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const actualValue = data.dataKey === 'CPB' ? data.value * 1000 : data.value;
      
      return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white">
          <p className="font-semibold">{data.payload.name}</p>
          <p className="text-lg">₹{actualValue.toLocaleString()}</p>
          <p className="text-sm text-gray-300">per unit</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Donut Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion Funnel Donut Chart */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <h3 className="text-lg font-bold text-white text-center">Conversion Funnel</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomDonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {conversionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Efficiency Horizontal Bar Chart */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <h3 className="text-lg font-bold text-white text-center">Cost Efficiency Comparison</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costData}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#d1d5db', fontSize: 12 }} 
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#d1d5db', fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 4, 4, 0]}
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Timeline Chart */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <h3 className="text-xl font-bold text-white text-center">
            Performance Trend Over {duration}
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#d1d5db', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#d1d5db', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                  name="Leads"
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="qualifiedLeads" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  name="Qualified Leads"
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="siteVisits" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                  name="Site Visits"
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  name="Bookings"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCharts;

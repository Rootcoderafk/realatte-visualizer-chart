
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend, Area, AreaChart } from 'recharts';
import { Users } from 'lucide-react';

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

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; duration?: number; icon?: string }> = ({ 
  value, 
  duration = 1500,
  icon 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  const getIcon = () => {
    switch(icon) {
      case 'leads':
        return '👥';
      case 'qualified':
        return '✅';
      case 'bookings':
        return '🏠';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{getIcon()}</span>
      <span className="text-3xl font-bold">{count.toLocaleString()}</span>
    </div>
  );
};

const EnhancedCharts: React.FC<EnhancedChartsProps> = ({ metrics, chartData, duration }) => {
  // Data for donut chart showing conversion funnel
  const conversionData = [
    { name: 'Leads', value: metrics.leads, color: '#ec4899' },
    { name: 'Qualified Leads', value: metrics.qualifiedLeads, color: '#8b5cf6' },
    { name: 'Site Visits', value: metrics.siteVisits, color: '#f59e0b' },
    { name: 'Bookings', value: metrics.bookings, color: '#10b981' }
  ];

  // Data for horizontal bar chart showing cost comparison with pastel colors
  const costData = [
    { name: 'CPL', value: metrics.cpl, color: '#A7C7E7', fullValue: metrics.cpl },
    { name: 'CPQL', value: metrics.cpql, color: '#B8E6B8', fullValue: metrics.cpql },
    { name: 'CPSV', value: metrics.cpsv, color: '#FFCCCB', fullValue: metrics.cpsv },
    { name: 'CPB', value: metrics.cpb / 1000, color: '#E6E6FA', fullValue: metrics.cpb }
  ];

  // Data for CPL trend line with gradient
  const cplTrendData = chartData.map((item, index) => ({
    ...item,
    cpl: metrics.cpl * (1 + (index * 0.05)) // Sample CPL variation over time
  }));

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

  // Custom tooltip for cost efficiency bar chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      
      return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white">
          <p className="font-semibold">{data.payload.name}</p>
          <p className="text-lg">₹{data.payload.fullValue.toLocaleString()}</p>
          <p className="text-sm text-gray-300">per unit</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for CPL trend line
  const CustomCPLTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white">
          <p className="font-semibold">{label}</p>
          <p className="text-lg text-yellow-400">CPL: ₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Animated Counter Tiles */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
          <CardContent className="p-4">
            <AnimatedCounter value={metrics.leads} icon="leads" />
            <div className="text-sm text-purple-300 mt-2">Total Leads</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
          <CardContent className="p-4">
            <AnimatedCounter value={metrics.qualifiedLeads} icon="qualified" />
            <div className="text-sm text-purple-300 mt-2">Qualified Leads</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
          <CardContent className="p-4">
            <AnimatedCounter value={metrics.bookings} icon="bookings" />
            <div className="text-sm text-purple-300 mt-2">Bookings</div>
          </CardContent>
        </Card>
      </div>

      {/* CPL Trend Line Chart */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <h3 className="text-lg font-bold text-white text-center">CPL Trend Over {duration}</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cplTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="cplGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
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
                <Tooltip content={<CustomCPLTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cpl"
                  stroke="url(#cplGradient)"
                  fill="url(#areaGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Efficiency Comparison - Enhanced */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20" style={{ backgroundColor: 'rgba(255, 249, 230, 0.1)' }}>
        <CardHeader>
          <h3 className="text-lg font-bold text-white text-center">Cost Efficiency Comparison</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={costData}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
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
                  width={60}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 8, 8, 0]}
                  animationDuration={1500}
                  animationBegin={300}
                >
                  {costData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                    animationDuration={1500}
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

        {/* Enhanced Timeline Chart */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <h3 className="text-lg font-bold text-white text-center">
              Performance Trend Over {duration}
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
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
    </div>
  );
};

export default EnhancedCharts;

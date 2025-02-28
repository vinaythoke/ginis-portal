"use client"

import * as React from 'react'
// @ts-ignore - Suppressing TypeScript errors for recharts imports
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats } from '@/lib/services/mockData'
import DateRangeFilter, { DateFilterType } from '../filters/DateRangeFilter'
import { exportToExcel } from '@/lib/utils'

// Define type for chart data
interface ChartData {
  name: string;
  value: number;
  color: string;
}

/**
 * WorkOrderStatusChart component
 * 
 * Displays a pie chart showing distribution of work orders by status
 * Helps authorities visualize the proportion of completed, in-progress, and not-started work orders
 */
const WorkOrderStatusChart = () => {
  // State for chart data
  const [data, setData] = React.useState([])
  
  // State for loading
  const [loading, setLoading] = React.useState(true)
  
  // State for current filter
  const [currentFilter, setCurrentFilter] = React.useState('all')
  
  // State for custom date range
  const [dateRange, setDateRange] = React.useState(undefined)
  
  // Colors for different status types - using standard color conventions:
  // Green for completed, yellow/amber for in-progress, red for not-started
  const STATUS_COLORS = {
    completed: '#22c55e', // bright green
    inProgress: '#f59e0b', // amber/yellow
    notStarted: '#ef4444'  // red
  }
  
  // Fetch work order status data
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call with filter parameters
        const stats = getDashboardStats()
        
        // Filter data based on selected filter
        // Note: In a real application, you'd filter the data on the server side
        // or filter here based on the dates of the work orders
        
        // Format data for pie chart with consistent color assignments
        const chartData = [
          { name: 'Completed', value: stats.completedWorkOrders, color: STATUS_COLORS.completed },
          { name: 'In-Progress', value: stats.inProgressWorkOrders, color: STATUS_COLORS.inProgress },
          { name: 'Not Started', value: stats.notStartedWorkOrders, color: STATUS_COLORS.notStarted }
        ]
        
        setData(chartData)
      } catch (error) {
        console.error('Error fetching work order status data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [currentFilter, dateRange]) // Refetch when filter or date range changes
  
  // Handle filter change
  const handleFilterChange = (filter: DateFilterType, range?: { from: Date; to: Date }) => {
    setCurrentFilter(filter)
    setDateRange(range)
  }
  
  // Handle export
  const handleExport = () => {
    // Convert chart data to a format suitable for export
    const exportData = data.map((item: ChartData) => ({
      Status: item.name,
      Count: item.value
    }))
    
    // Export the data
    exportToExcel(exportData, 'work-order-status')
  }
  
  // Custom label for pie sections
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, value } = props
    
    if (!cx || !cy || !innerRadius || !outerRadius || !percent) return null
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    // Calculate total to get a more accurate percentage
    const total = data.reduce((sum: number, item: ChartData) => sum + item.value, 0)
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
        style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}
      >
        {`${percentage}%`}
      </text>
    )
  }
  
  // Show loading skeleton if data is not yet available
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-0">
          <div>
            <CardTitle>Work Order Status</CardTitle>
            <CardDescription className="mb-2">Distribution by completion status</CardDescription>
            
            {/* Skeleton legend */}
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-muted"></div>
                <div className="w-14 h-4 bg-muted rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-muted"></div>
                <div className="w-14 h-4 bg-muted rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-muted"></div>
                <div className="w-14 h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
          <DateRangeFilter 
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />
        </CardHeader>
        <CardContent className="p-0 mt-3">
          <div className="h-80 w-full rounded-lg bg-muted animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-0">
        <div>
          <CardTitle>Work Order Status</CardTitle>
          <CardDescription className="mb-2">Distribution by completion status</CardDescription>
          
          {/* Custom legend similar to MonthlyProgressChart */}
          <div className="flex items-center gap-4 mt-1">
            {data.map((item: ChartData) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <DateRangeFilter 
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <div className="h-80 w-full">
          {/* @ts-ignore - Suppressing TypeScript errors for recharts components */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true}
                paddingAngle={1}
              >
                {data.map((entry: ChartData) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => {
                  return [`${value} orders`, name]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkOrderStatusChart 
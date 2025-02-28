"use client"

import * as React from 'react'
// Replacing recharts with Nivo pie chart
import { ResponsivePie } from '@nivo/pie'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats } from '@/lib/services/mockData'
import DateRangeFilter, { DateFilterType } from '../filters/DateRangeFilter'
import { exportToExcel } from '@/lib/utils'

// Define type for chart data
interface ChartData {
  id: string;       // Changed from 'name' to 'id' for Nivo
  label: string;    // Added for Nivo
  value: number;
  color: string;
  total: number;
}

// Colors for different status types - using standard color conventions - moved outside component
// Green for completed, yellow/amber for in-progress, red for not-started
const STATUS_COLORS = {
  completed: '#22c55e', // bright green
  inProgress: '#f59e0b', // amber/yellow
  notStarted: '#ef4444'  // red
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
  
  // Fetch work order status data
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call with filter parameters
        const stats = getDashboardStats()
        
        // Use totalWorkOrders as the base for percentages
        const totalWorkOrders = stats.totalWorkOrders
        
        // Format data for pie chart with consistent color assignments
        // Adjusted format for Nivo pie chart
        const chartData = [
          { 
            id: 'completed', 
            label: 'Completed', 
            value: stats.completedWorkOrders,
            color: STATUS_COLORS.completed,
            // Store the total for percentage calculations
            total: totalWorkOrders
          },
          { 
            id: 'in-progress', 
            label: 'In-Progress', 
            value: stats.inProgressWorkOrders, 
            color: STATUS_COLORS.inProgress,
            total: totalWorkOrders
          },
          { 
            id: 'not-started', 
            label: 'Not Started', 
            value: stats.notStartedWorkOrders, 
            color: STATUS_COLORS.notStarted,
            total: totalWorkOrders
          }
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
    const exportData = data.map((item) => ({
      Status: item.label,
      Count: item.value
    }))
    
    // Export the data
    exportToExcel(exportData, 'work-order-status')
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
      <CardHeader className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 pb-0">
        <div>
          <CardTitle>Work Order Status</CardTitle>
          <CardDescription className="mb-2">Distribution by completion status</CardDescription>
          
          {/* Custom legend similar to MonthlyProgressChart */}
          <div className="flex flex-wrap items-center gap-4 mt-1 mb-2 sm:mb-0">
            {data.map((item) => (
              <div key={item.id} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <DateRangeFilter 
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <div className="h-80 w-full overflow-hidden">
          {/* Nivo Pie Chart */}
          <ResponsivePie
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            innerRadius={0.3}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ datum: 'data.color' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="white"
            arcLabelsRadiusOffset={0.55}
            // Display percentages on pie slices
            arcLabel={d => {
              // Calculate percentage using the total stored in each data item
              const percentage = d.data.total > 0 
                ? Math.floor((d.value / d.data.total) * 100) 
                : 0
              return `${percentage}%`
            }}
            enableArcLinkLabels={false}
            // Custom tooltip
            tooltip={({datum}) => (
              <div style={{
                background: 'white',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.25)'
              }}>
                <strong style={{ textTransform: 'capitalize' }}>{datum.label}</strong>: {datum.value} orders
                <div>
                  <strong>{Math.floor((datum.value / datum.data.total) * 100)}%</strong> of total allotted
                </div>
              </div>
            )}
            theme={{
              labels: {
                text: {
                  fontSize: 14,
                  fontWeight: 700,
                  textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                }
              }
            }}
            legends={[]}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkOrderStatusChart 
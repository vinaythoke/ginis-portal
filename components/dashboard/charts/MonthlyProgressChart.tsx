"use client"

import * as React from 'react'
import { ResponsiveLine as NivoResponsiveLine } from '@nivo/line'
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, eachWeekOfInterval, startOfMonth, endOfMonth } from 'date-fns'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateMonthlyProgress } from '@/lib/services/mockData'
import DateRangeFilter, { DateFilterType } from '../filters/DateRangeFilter'
import { exportToExcel } from '@/lib/utils'
import { FilterOptions } from '@/lib/types'

// Define the monthly progress data shape
interface MonthlyProgressItem {
  name: string;
  allotted: number;
  completed: number;
}

// Define the nivo data format
interface NivoLineData {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

// First, fix the DataItem type to match what's used in the code
type DataItem = {
  name: string;  // Changed from 'time' to 'name' to match actual usage
  allotted: number;  // Changed from 'Allotted' to 'allotted' to match actual usage
  completed: number; // Changed from 'Completed' to 'completed' to match actual usage
};

// Update NivoDataPoint to include serieId for tooltip
type NivoDataPoint = {
  x: string;
  y: number;
  serieId?: string;
};

type NivoDataSeries = {
  id: string;
  data: NivoDataPoint[];
};

/**
 * MonthlyProgressChart component
 * 
 * Displays a line chart showing work orders allotted vs completed over time
 * Provides filtering by All time, Monthly, Weekly, or Custom date range
 * Helps users track progress metrics over different time periods
 */
const MonthlyProgressChart = () => {
  // State for raw data (original format)
  const [rawData, setRawData] = React.useState([])
  
  // State for processed display data (based on the filter)
  const [displayData, setDisplayData] = React.useState([])
  
  // State for nivo formatted data
  const [nivoData, setNivoData] = React.useState([])
  
  // State for loading
  const [loading, setLoading] = React.useState(true)
  
  // State for current filter
  const [currentFilter, setCurrentFilter] = React.useState('all')
  
  // State for date range (for custom filter)
  const [dateRange, setDateRange] = React.useState(undefined)
  
  // State for total completed work orders
  const [totalCompleted, setTotalCompleted] = React.useState(0)
  
  // Process the raw data based on filter type
  React.useEffect(() => {
    if (rawData.length === 0) return;
    
    // Final data to display after processing
    let processedData: MonthlyProgressItem[] = [];
    
    if (currentFilter === 'weekly') {
      // For weekly filter, show daily data for past 7 days
      const now = new Date();
      const sevenDaysAgo = subDays(now, 7);
      
      // Create an array of the last 7 days
      const days = eachDayOfInterval({ start: sevenDaysAgo, end: now });
      
      // Map to format needed for chart with daily breakdown
      processedData = days.map(day => {
        const dayStr = format(day, 'dd MMM'); // e.g., "01 Mar"
        
        // Find corresponding data or use zero values
        const dayData = rawData.find((d: MonthlyProgressItem) => d.name === format(day, 'MMM')) || { name: dayStr, allotted: 0, completed: 0 };
        
        // For demonstration, divide monthly data by approximate days in month to get daily values
        // In a real app, you would have actual daily data
        const daysInMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
        
        return {
          name: dayStr,
          allotted: Math.round(dayData.allotted / daysInMonth),
          completed: Math.round(dayData.completed / daysInMonth)
        };
      });
    } else if (currentFilter === 'monthly') {
      // For monthly filter, show weekly data for past month
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      // Create an array of weeks in the past month
      const startDate = startOfMonth(monthAgo);
      const endDate = endOfMonth(now);
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
      
      // Map to format needed for chart with weekly breakdown
      processedData = weeks.map((weekStart, i) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const weekLabel = `W${i+1}: ${format(weekStart, 'dd MMM')}`;
        
        // Find all months this week spans (usually just one)
        const month = format(weekStart, 'MMM');
        const monthData = rawData.find((d: MonthlyProgressItem) => d.name === month) || { name: month, allotted: 0, completed: 0 };
        
        // For demonstration, divide monthly data by approximate weeks in month
        // In a real app, you would have actual weekly data
        const weeksInMonth = 4;
        
        return {
          name: weekLabel,
          allotted: Math.round(monthData.allotted / weeksInMonth),
          completed: Math.round(monthData.completed / weeksInMonth)
        };
      });
      
      // Limit to last 4-5 weeks (one month)
      processedData = processedData.slice(-5);
    } else {
      // For 'all' or 'custom', use the original monthly data
      processedData = [...rawData];
    }
    
    setDisplayData(processedData);
    
    // Calculate total completed for display
    const total = processedData.reduce((sum, item) => sum + item.completed, 0);
    setTotalCompleted(total);
  }, [rawData, currentFilter, dateRange]);
  
  // Convert display data to nivo format when it changes
  React.useEffect(() => {
    if (displayData.length > 0) {
      // Show both Allotted and Completed lines
      const formattedData: NivoDataSeries[] = [
        {
          id: 'Allotted',
          data: displayData.map((item: MonthlyProgressItem) => ({
            x: item.name,
            y: item.allotted
          })),
        },
        {
          id: 'Completed',
          data: displayData.map((item: MonthlyProgressItem) => ({
            x: item.name,
            y: item.completed
          })),
        },
      ]
      setNivoData(formattedData)
    }
  }, [displayData])
  
  // Fetch monthly progress data
  React.useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      try {
        // Create filter options based on current filter
        const filterOptions: FilterOptions = {}
        
        // Apply appropriate date filtering
        if (currentFilter === 'weekly') {
          // Get only last 7 days of data
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          filterOptions.startDate = weekAgo.toISOString().split('T')[0]
        } else if (currentFilter === 'monthly') {
          // Get only last 30 days of data
          const monthAgo = new Date()
          monthAgo.setDate(monthAgo.getDate() - 30)
          filterOptions.startDate = monthAgo.toISOString().split('T')[0]
        } else if (currentFilter === 'custom' && dateRange) {
          // Get data within custom date range
          filterOptions.startDate = dateRange.from.toISOString().split('T')[0]
          filterOptions.endDate = dateRange.to.toISOString().split('T')[0]
        }
        
        // Get monthly data with applied filters
        const progressData = calculateMonthlyProgress(filterOptions)
        
        setRawData(progressData)
      } catch (error) {
        console.error('Error fetching monthly progress data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [currentFilter, dateRange])
  
  // Handle filter change
  const handleFilterChange = (filter: DateFilterType, range?: { from: Date; to: Date }) => {
    setCurrentFilter(filter)
    setDateRange(range)
  }
  
  // Handle export
  const handleExport = () => {
    // Convert chart data to a format suitable for export
    const exportData = displayData.map((item: MonthlyProgressItem) => ({
      Period: item.name,
      Allotted: item.allotted,
      Completed: item.completed
    }))
    
    // Export the data
    exportToExcel(exportData, 'progress-data')
  }
  
  // Define colors for the chart - using teal color to match reference
  const colors = { 
    Allotted: '#a855f7', // Purple for allotted (matching our established color scheme)
    Completed: '#10b981'  // Green for completed (matching our established color scheme)
  }
  
  // Custom tooltip to match reference design
  const customTooltip = ({ point }: { point: any }) => {
    return (
      <div className="bg-white p-2 shadow rounded border text-xs">
        <strong>{point.serieId}:</strong> {point.data.y}
      </div>
    );
  }
  
  // Get the time period text based on current filter
  const getTimePeriodText = () => {
    if (currentFilter === 'weekly') return 'in past week';
    if (currentFilter === 'monthly') return 'in past month';
    if (currentFilter === 'custom' && dateRange) {
      return `from ${format(dateRange.from, 'dd MMM')} to ${format(dateRange.to, 'dd MMM')}`;
    }
    return 'in past six months';
  }
  
  // Show loading skeleton if data is not yet available
  if (loading) {
    return (
      <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderColor: '#f3f4f6' }}>
        <CardHeader className="flex flex-row items-start justify-between pb-0">
          <div>
            <CardTitle>Progress</CardTitle>
            <CardDescription className="mb-2">{getTimePeriodText()}</CardDescription>
            
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
            </div>
          </div>
          <DateRangeFilter 
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />
        </CardHeader>
        <CardContent className="p-0 mt-3">
          <div className="h-[300px] w-full rounded-lg bg-muted animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderColor: '#f3f4f6' }}>
      <CardHeader className="flex flex-row items-start justify-between pb-0">
        <div>
          <CardTitle className="text-2xl font-bold">{totalCompleted}</CardTitle>
          <CardDescription className="mb-2">{getTimePeriodText()}</CardDescription>
          
          {/* Legend moved to left side below title */}
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.Allotted }}></div>
              <span className="text-xs font-medium">Allotted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.Completed }}></div>
              <span className="text-xs font-medium">Completed</span>
            </div>
          </div>
        </div>
        <DateRangeFilter 
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />
      </CardHeader>
      
      {/* Remove the standalone legend div and directly go to CardContent */}
      <CardContent className="p-0 mt-3">
        <div className="h-[300px] w-full">
          {displayData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No data available for the selected time period
            </div>
          ) : (
            <div style={{ height: '100%', width: '100%' }}>
              {/* @ts-ignore - Nivo component typing issue */}
              <NivoResponsiveLine
                data={nivoData}
                margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={null} // Completely remove x-axis
                axisLeft={null}
                colors={({ id }: { id: string }) => colors[id as keyof typeof colors]}
                lineWidth={3}
                enablePoints={true}
                pointSize={0}
                pointColor={{ from: 'color' }}
                pointBorderWidth={0}
                pointBorderColor={{ from: 'color' }}
                enablePointLabel={false}
                enableArea={true}
                areaBaselineValue={0}
                areaOpacity={0.1}
                enableGridX={false}
                enableGridY={true}
                gridYValues={6}
                crosshairType="x"
                useMesh={true}
                tooltip={customTooltip}
                legends={[]} // Remove built-in legend
                theme={{
                  grid: {
                    line: {
                      stroke: '#f1f5f9',
                      strokeWidth: 1
                    }
                  },
                  crosshair: {
                    line: {
                      stroke: '#94a3b8',
                      strokeWidth: 1,
                      strokeOpacity: 0.5
                    }
                  },
                  tooltip: {
                    container: {
                      background: 'white',
                      fontSize: 12,
                    }
                  }
                }}
                animate={true}
                enableSlices="x"
                sliceTooltip={({ slice }: { slice: any }) => {
                  return (
                    <div className="bg-white border border-gray-200 rounded-md shadow-md p-3">
                      <div className="font-semibold text-sm text-gray-600 mb-2">{slice.points[0].data.x}</div>
                      {slice.points.map((point: any) => (
                        <div 
                          key={point.id} 
                          className="flex items-center my-1"
                        >
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: point.serieColor }}
                          /> 
                          <span className="text-sm">{point.serieId}: <strong>{point.data.y}</strong></span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MonthlyProgressChart 
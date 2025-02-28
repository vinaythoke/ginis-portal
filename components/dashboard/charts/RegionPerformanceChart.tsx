"use client"

import { useEffect, useState } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { format } from 'date-fns'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateRegionPerformance } from '@/lib/services/mockData'
import DateRangeFilter, { DateFilterType } from '../filters/DateRangeFilter'
import { exportToExcel } from '@/lib/utils'
import { FilterOptions } from '@/lib/types'

// Define the data shape for region performance
interface RegionPerformanceData {
  name: string;
  regionName: string;
  completed: number;
  inProgress: number;
  notStarted: number;
  total: number;
}

/**
 * RegionPerformanceChart component
 * 
 * Displays a stacked bar chart showing work order status distribution by region
 * Helps authorities compare performance across different regions
 */
const RegionPerformanceChart = () => {
  // State for chart data
  const [data, setData] = useState<RegionPerformanceData[]>([])
  
  // State for loading
  const [loading, setLoading] = useState(true)
  
  // State for current filter
  const [currentFilter, setCurrentFilter] = useState<DateFilterType>('all')
  
  // State for custom date range
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined)
  
  // Fetch region performance data
  useEffect(() => {
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
        
        // Get region data with applied filters
        const regionData = calculateRegionPerformance(filterOptions)
        
        // Filter out regions with no data
        const filteredData = regionData.filter(region => region.total > 0)
          .map(region => ({
            ...region,
            // Replace long name with shorter acronym
            regionName: region.regionName === "Pimpri-Chinchwad Taluka" ? "PCMC" : region.regionName
          }))
        
        setData(filteredData)
      } catch (error) {
        console.error('Error fetching region performance data:', error)
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
    const exportData = data.map(item => ({
      Region: item.regionName,
      Completed: item.completed,
      InProgress: item.inProgress,
      NotStarted: item.notStarted,
      Total: item.total
    }))
    
    // Export the data
    exportToExcel(exportData, 'region-performance')
  }
  
  // Define colors for the chart
  const colors = {
    completed: '#22c55e',   // Green
    inProgress: '#f59e0b',  // Amber
    notStarted: '#ef4444'   // Red
  }

  // Create an array of legend items for easy rendering
  const legendItems = [
    { id: 'completed', label: 'Completed', color: colors.completed },
    { id: 'inProgress', label: 'In Progress', color: colors.inProgress },
    { id: 'notStarted', label: 'Not Started', color: colors.notStarted }
  ]

  // Custom tooltip to display data
  const customTooltip = (point: any) => {
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-3">
        <strong>{point.data.regionName || point.indexValue}</strong>
        <div className="mt-2">
          <div><span className="inline-block w-3 h-3 mr-2 bg-[#22c55e] rounded-sm"></span> Completed: {point.data.completed}</div>
          <div><span className="inline-block w-3 h-3 mr-2 bg-[#f59e0b] rounded-sm"></span> In Progress: {point.data.inProgress}</div>
          <div><span className="inline-block w-3 h-3 mr-2 bg-[#ef4444] rounded-sm"></span> Not Started: {point.data.notStarted}</div>
          <div className="mt-1 font-semibold">Total: {point.data.total}</div>
        </div>
      </div>
    )
  }
  
  // Show loading skeleton if data is not yet available
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-0">
          <div>
            <CardTitle>Region Performance</CardTitle>
            <CardDescription className="mb-2">Work order distribution by region</CardDescription>
            
            {/* Skeleton legend */}
            <div className="flex items-center gap-4 mt-1">
              {legendItems.map(item => (
                <div key={item.id} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-muted"></div>
                  <div className="w-14 h-4 bg-muted rounded"></div>
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
          <div className="h-96 w-full rounded-lg bg-muted animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }
  
  // Get appropriate subtitle based on filter
  const getSubtitle = () => {
    if (currentFilter === 'weekly') return 'Work order status for past week';
    if (currentFilter === 'monthly') return 'Work order status for past month';
    if (currentFilter === 'custom' && dateRange) {
      return `From ${format(dateRange.from, 'dd MMM yyyy')} to ${format(dateRange.to, 'dd MMM yyyy')}`;
    }
    return 'All time work order distribution by region';
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-0">
        <div>
          <CardTitle>Region Performance</CardTitle>
          <CardDescription className="mb-2">{getSubtitle()}</CardDescription>
          
          {/* Custom legend similar to other charts */}
          <div className="flex items-center gap-4 mt-1">
            {legendItems.map(item => (
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
        <DateRangeFilter 
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <div className="h-96 w-full">
          {data.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No data available for the selected time period
            </div>
          ) : (
            <ResponsiveBar
              data={data}
              keys={['completed', 'inProgress', 'notStarted']}
              indexBy="regionName"
              margin={{ top: 20, right: 10, bottom: 50, left: 40 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={({ id }) => colors[id as keyof typeof colors]}
              borderRadius={0}
              enableLabel={false}
              borderWidth={0}
              layers={[
                'grid',
                'axes',
                'bars',
                'markers',
                'legends',
                'annotations',
                ({ bars }) => {
                  return (
                    <g>
                      {bars
                        .filter(bar => {
                          const isTopBar = bars.filter(
                            b => b.data.indexValue === bar.data.indexValue
                          ).reduce((max, b) => Math.max(max, b.y), 0) === bar.y;
                          return isTopBar;
                        })
                        .map(bar => {
                          return (
                            <rect
                              key={`${bar.key}-top-rounded`}
                              x={bar.x}
                              y={bar.y}
                              width={bar.width}
                              height={Math.min(2, bar.height)}
                              rx={2}
                              ry={2}
                              fill={bar.color}
                            />
                          );
                        })}
                    </g>
                  );
                }
              ]}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: null, // Removed legend
                truncateTickAt: 0,
                format: (value) => value.length > 12 ? `${value.substring(0, 12)}...` : value
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: null, // Removed legend
                truncateTickAt: 0
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
              }}
              legends={[]} // Removed the built-in legend since we have our custom one
              role="application"
              ariaLabel="Region performance chart"
              barAriaLabel={e => `${e.indexValue}: ${e.formattedValue} work orders (${e.id})`}
              tooltip={point => (
                <div className="bg-white p-2 shadow rounded border text-xs">
                  <strong className="block mb-1">
                    {(point.data.regionName === "Pimpri-Chinchwad Taluka" ? "PCMC" : point.data.regionName) || point.indexValue}
                  </strong>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.completed }}></div>
                      <span>Completed: {point.data.completed}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.inProgress }}></div>
                      <span>In Progress: {point.data.inProgress}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.notStarted }}></div>
                      <span>Not Started: {point.data.notStarted}</span>
                    </div>
                    <div className="font-medium mt-1 pt-1 border-t border-gray-100">
                      Total: {point.data.total}
                    </div>
                  </div>
                </div>
              )}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fontSize: 11
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: '#f1f5f9', // Lighter grid lines
                    strokeWidth: 1
                  }
                }
              }}
              motionConfig="gentle"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RegionPerformanceChart 
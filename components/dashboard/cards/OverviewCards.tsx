"use client"

import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'
import { calculateStatistics } from '@/lib/services/mockData'
import { getWorkOrders } from '@/lib/services/mockData'
import { WorkOrder, DashboardStats } from '@/lib/types'

// Cache for statistics data to keep it consistent between renders
let statsCache: {
  stats: DashboardStats | null;
  trends: {
    totalWorkOrders: number;
    notStartedWorkOrders: number;
    inProgressWorkOrders: number;
    completedWorkOrders: number;
  } | null;
  timestamp: number;
} = {
  stats: null,
  trends: null,
  timestamp: 0
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * OverviewCards component
 * 
 * Displays key statistics about work orders in a clean, modern card layout
 * Shows total allotted, completed, in progress, and not started work orders
 * Now includes actual trend calculations based on last month's data
 */
const OverviewCards = () => {
  // State for statistics data
  const [stats, setStats] = useState({
    totalWorkOrders: 0,
    notStartedWorkOrders: 0,
    inProgressWorkOrders: 0,
    completedWorkOrders: 0
  })
  
  // State for trend percentages
  const [trends, setTrends] = useState({
    totalWorkOrders: 0,
    notStartedWorkOrders: 0,
    inProgressWorkOrders: 0,
    completedWorkOrders: 0
  })
  
  // State for loading
  const [loading, setLoading] = useState(true)
  
  // Calculate trend percentage based on current and previous values
  const calculateTrendPercentage = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }
  
  // Fetch statistics data and calculate trends
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // Check if we have valid cached data
        const currentTime = Date.now();
        if (statsCache.stats && statsCache.trends && (currentTime - statsCache.timestamp < CACHE_EXPIRATION)) {
          // Use cached data
          setStats(statsCache.stats);
          setTrends(statsCache.trends);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch fresh data
        // In a real app, this would be an API call
        const statistics = calculateStatistics()
        
        // Get all work orders to calculate last month's data
        const allWorkOrders = getWorkOrders()
        
        // Get current date and last month's date
        const currentDate = new Date()
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        
        // Format dates to YYYY-MM format for comparison
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
        const previousMonth = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`
        
        // Filter work orders for current month and previous month
        const currentMonthOrders = allWorkOrders.filter(wo => 
          wo.dateIssued.startsWith(currentMonth)
        )
        
        const previousMonthOrders = allWorkOrders.filter(wo => 
          wo.dateIssued.startsWith(previousMonth)
        )
        
        // Calculate current month stats
        const currentTotalOrders = currentMonthOrders.length
        const currentCompleted = currentMonthOrders.filter(wo => wo.status === 'completed').length
        const currentInProgress = currentMonthOrders.filter(wo => wo.status === 'in-progress').length
        const currentNotStarted = currentMonthOrders.filter(wo => wo.status === 'not-started').length
        
        // Calculate previous month stats
        const previousTotalOrders = previousMonthOrders.length
        const previousCompleted = previousMonthOrders.filter(wo => wo.status === 'completed').length
        const previousInProgress = previousMonthOrders.filter(wo => wo.status === 'in-progress').length
        const previousNotStarted = previousMonthOrders.filter(wo => wo.status === 'not-started').length
        
        // Calculate trend percentages
        const newTrends = {
          totalWorkOrders: calculateTrendPercentage(currentTotalOrders, previousTotalOrders),
          completedWorkOrders: calculateTrendPercentage(currentCompleted, previousCompleted),
          inProgressWorkOrders: calculateTrendPercentage(currentInProgress, previousInProgress),
          notStartedWorkOrders: calculateTrendPercentage(currentNotStarted, previousNotStarted)
        };
        
        // Update state
        setStats(statistics)
        setTrends(newTrends)
        
        // Cache the results
        statsCache = {
          stats: statistics,
          trends: newTrends,
          timestamp: Date.now()
        };
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Show loading skeleton if data is not yet available
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatsCard
            key={i}
            title="Loading..."
            value=""
            className="animate-pulse"
          />
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Allotted Card */}
      <StatsCard 
        title="Total Allotted"
        value={stats.totalWorkOrders}
        icon={<div className="h-4 w-4 rounded-full bg-purple-500" />}
        trend={{
          value: trends.totalWorkOrders,
          label: "vs last month",
          // For total work orders, increase is considered positive
          positive: trends.totalWorkOrders >= 0
        }}
      />
      
      {/* Total Completed Card */}
      <StatsCard 
        title="Total Completed"
        value={stats.completedWorkOrders}
        icon={<div className="h-4 w-4 rounded-full bg-teal-500" />}
        trend={{
          value: Math.abs(trends.completedWorkOrders),
          label: "vs last month",
          // For completed orders, increase is always positive
          positive: trends.completedWorkOrders >= 0
        }}
      />
      
      {/* In Progress Card */}
      <StatsCard 
        title="In Progress"
        value={stats.inProgressWorkOrders}
        icon={<div className="h-4 w-4 rounded-full bg-amber-500" />}
        trend={{
          value: Math.abs(trends.inProgressWorkOrders),
          label: "vs last month",
          // For in-progress, it's context-dependent, but generally neutral
          // We'll use the raw value to determine if it's positive or negative
          positive: trends.inProgressWorkOrders >= 0
        }}
      />
      
      {/* Not Started Card */}
      <StatsCard 
        title="Not Started"
        value={stats.notStartedWorkOrders}
        icon={<div className="h-4 w-4 rounded-full bg-red-500" />}
        trend={{
          value: Math.abs(trends.notStartedWorkOrders),
          label: "vs last month",
          // For not started orders:
          // - Increase = RED with UP arrow - more unstarted orders is a problem but still shows growth
          // - Decrease = GREEN with DOWN arrow - fewer unstarted orders means progress
          positive: trends.notStartedWorkOrders <= 0, // Controls color (≤0 is good/green, >0 is bad/red)
          isIncrease: trends.notStartedWorkOrders > 0 // Controls arrow direction (>0 shows up arrow)
        }}
      />
    </div>
  )
}

export default OverviewCards 
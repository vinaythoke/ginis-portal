"use client"

import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Download, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format, subDays } from 'date-fns'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./datepicker-custom.css" // Import custom styles

// Available filter types
export type DateFilterType = 'all' | 'monthly' | 'weekly' | 'custom';

// Props for the DateRangeFilter component
export interface DateRangeFilterProps {
  onFilterChange: (filter: DateFilterType, dateRange?: { from: Date; to: Date } | undefined) => void
  onExport?: () => void
  className?: string
}

/**
 * DateRangeFilter component
 * 
 * Provides time filtering options for dashboard charts
 * Includes dropdown for "All", "Monthly", and "Weekly" views and custom date picker
 * Also provides calendar picker and download options
 */
const DateRangeFilter = ({ onFilterChange, onExport, className }: DateRangeFilterProps) => {
  // Current selected filter
  const [selectedFilter, setSelectedFilter] = useState<DateFilterType>('all')
  
  // Date range for custom filter - using any type to avoid TS errors with react-datepicker
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  
  // Flag to indicate if calendar is open
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  // Filter option labels
  const filterLabels = {
    all: 'All',
    monthly: 'Monthly',
    weekly: 'Weekly',
    custom: 'Custom'
  }
  
  // Get the current filter label
  const getCurrentFilterLabel = (): string => {
    if (selectedFilter === 'custom' && startDate && endDate) {
      return `${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM')}`;
    }
    return filterLabels[selectedFilter as keyof typeof filterLabels];
  }
  
  // Handle filter change
  const handleFilterChange = (filter: DateFilterType) => {
    // If the filter is not custom, close the calendar
    if (filter !== 'custom') {
      setIsCalendarOpen(false)
    }
    
    // Update selected filter
    setSelectedFilter(filter)
    
    // Call the onFilterChange callback
    onFilterChange(filter, 
      filter === 'custom' && startDate && endDate 
        ? { from: startDate, to: endDate } 
        : undefined
    )
  }
  
  // Apply the date range selection
  const applyDateRange = () => {
    if (startDate && endDate) {
      // Update filter type to custom
      setSelectedFilter('custom')
      
      // Call the onFilterChange callback with the new range
      onFilterChange('custom', { 
        from: startDate, 
        to: endDate 
      })
      
      // Close the calendar
      setIsCalendarOpen(false)
    }
  }
  
  // Cancel and close the calendar without applying changes
  const cancelDateRange = () => {
    // Close the calendar without applying changes
    setIsCalendarOpen(false)
  }
  
  // Whether the custom filter is active
  const isCustomActive = selectedFilter === 'custom'
  
  // Get formatted custom date range text if applicable
  const getCustomDateRangeText = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM')}`;
    }
    return '';
  }

  // Handle date changes from the date picker
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  
  // Custom header for the date picker
  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
  }: any) => (
    <div className="flex items-center justify-between px-2 py-1">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className="flex items-center justify-center p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft className="h-3 w-3" />
      </button>
      <h2 className="text-xs font-medium text-slate-900">
        {format(date, 'MMMM yyyy')}
      </h2>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="flex items-center justify-center p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
  
  // New handler to clear the custom date filter and reset to "All"
  const clearCustomFilter = () => {
    // Reset the filter to "All"
    setSelectedFilter('all')
    
    // Clear the date range
    setStartDate(null)
    setEndDate(null)
    
    // Call the onFilterChange callback with the new filter
    onFilterChange('all', undefined)
  }
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Date picker with react-datepicker */}
      {startDate && endDate && isCustomActive ? (
        <div className="flex items-center">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-md pl-3 pr-3 h-9 bg-slate-100 text-slate-900 rounded-r-none border-r-0"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {getCustomDateRangeText()}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 min-w-[260px]" align="end">
              <div className="p-0">
                {/* Calendar title */}
                <div className="px-3 py-2 border-b">
                  <h2 className="text-sm font-semibold text-center">
                    Select date range
                  </h2>
                </div>
                
                {/* React DatePicker */}
                <div className="p-2">
                  {/* @ts-ignore - Ignoring type errors with DatePicker */}
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    monthsShown={1}
                    maxDate={new Date()}
                    minDate={subDays(new Date(), 365)} // Limit to last year
                    calendarClassName="custom-calendar"
                    renderCustomHeader={renderCustomHeader}
                    dayClassName={() => "text-sm"}
                  />
                </div>
                
                {/* Calendar footer with actions */}
                <div className="flex items-center justify-between p-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelDateRange}
                    className="flex-1 mr-2 h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={applyDateRange}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 h-8 text-xs"
                    disabled={!startDate || !endDate}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Separate X button */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-md rounded-l-none h-9 bg-slate-100 px-2 border-l-0"
            onClick={clearCustomFilter}
            aria-label="Clear date filter"
          >
            <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
      ) : (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-md",
                isCustomActive && "bg-slate-100"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 min-w-[260px]" align="end">
            <div className="p-0">
              {/* Calendar title */}
              <div className="px-3 py-2 border-b">
                <h2 className="text-sm font-semibold text-center">
                  Select date range
                </h2>
              </div>
              
              {/* React DatePicker */}
              <div className="p-2">
                {/* @ts-ignore - Ignoring type errors with DatePicker */}
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  monthsShown={1}
                  maxDate={new Date()}
                  minDate={subDays(new Date(), 365)} // Limit to last year
                  calendarClassName="custom-calendar"
                  renderCustomHeader={renderCustomHeader}
                  dayClassName={() => "text-sm"}
                />
              </div>
              
              {/* Calendar footer with actions */}
              <div className="flex items-center justify-between p-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelDateRange}
                  className="flex-1 mr-2 h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={applyDateRange}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 h-8 text-xs"
                  disabled={!startDate || !endDate}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      {/* Dropdown for All, Monthly, Weekly options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "rounded-md px-4 h-9",
              !isCustomActive && "bg-slate-100 text-slate-900"
            )}
          >
            {!isCustomActive ? getCurrentFilterLabel() : "All"} 
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className={cn("cursor-pointer", selectedFilter === 'all' && "bg-muted")}
            onClick={() => handleFilterChange('all')}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={cn("cursor-pointer", selectedFilter === 'monthly' && "bg-muted")}
            onClick={() => handleFilterChange('monthly')}
          >
            Monthly
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={cn("cursor-pointer", selectedFilter === 'weekly' && "bg-muted")}
            onClick={() => handleFilterChange('weekly')}
          >
            Weekly
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Download button */}
      {onExport && (
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-md" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default DateRangeFilter
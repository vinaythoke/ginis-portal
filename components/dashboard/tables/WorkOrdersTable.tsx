"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  Download, 
  ChevronDown, 
  Search, 
  Calendar,
  Check,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  X
} from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { WorkOrder, WorkOrderStatus, FilterOptions } from '@/lib/types'
import { mockWorkOrders, mockRegions, mockVendors, filterWorkOrders } from '@/lib/services/mockData'
import { exportAndDownloadWorkOrders } from '@/lib/utils/exportUtils'
import DateRangeFilter, { DateFilterType } from '../filters/DateRangeFilter'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"

/**
 * WorkOrdersTable component
 * 
 * Displays a table of work orders with filtering, sorting, pagination, and export capabilities
 * Allows government authorities to view and analyze work order data
 */
const WorkOrdersTable = () => {
  // State for work orders data
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  
  // State for table view
  const [view, setView] = useState('all')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  
  // State for selected work order and sidebar
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    regionIds: undefined,
    vendorIds: undefined,
  })
  
  // State for filtered data (before pagination)
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>([])
  
  // Filter state for date range
  const [currentFilter, setCurrentFilter] = useState<DateFilterType>('all')
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined)
  
  // State variables declarations
  const [currentRegion, setCurrentRegion] = useState<string>('all')
  const [currentStatus, setCurrentStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentDateFilter, setCurrentDateFilter] = useState<'weekly' | 'monthly' | 'custom' | 'all'>('all')
  
  // Calculate total items on initial component mount (and when date filter changes)
  useEffect(() => {
    const calculateTotalItems = () => {
      // Only use date filters for total count, ignore status filters
      const countOptions = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        region: currentRegion !== 'all' ? currentRegion : undefined,
      }
      
      // Get total count of all work orders (unfiltered by status)
      const allWorkOrders = filterWorkOrders(countOptions)
      const totalItems = allWorkOrders.totalCount
      
      // Set total pages based on all work orders
      setTotalPages(Math.ceil(totalItems / itemsPerPage))
    }
    
    calculateTotalItems()
  }, [filters.startDate, filters.endDate, currentRegion, itemsPerPage])
  
  // Fetch work orders data with current filters and pagination
  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      try {
        // Create filter options based on current filters BUT WITHOUT pagination first
        // This way we can get all filtered data and then paginate it properly
        const filterOptions: FilterOptions = {
          region: currentRegion !== 'all' ? currentRegion : undefined,
          status: currentStatus !== 'all' ? currentStatus : undefined,
          search: searchQuery
        }
        
        // Apply appropriate date filtering
        if (currentDateFilter === 'weekly') {
          // Get only last 7 days of data
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          filterOptions.startDate = weekAgo.toISOString().split('T')[0]
        } else if (currentDateFilter === 'monthly') {
          // Get only last 30 days of data
          const monthAgo = new Date()
          monthAgo.setDate(monthAgo.getDate() - 30)
          filterOptions.startDate = monthAgo.toISOString().split('T')[0]
        } else if (currentDateFilter === 'custom' && dateRange) {
          // Get data within custom date range
          filterOptions.startDate = dateRange.from.toISOString().split('T')[0]
          filterOptions.endDate = dateRange.to.toISOString().split('T')[0]
        }
        // No date filters are applied when currentDateFilter is 'all'
        // which loads all data regardless of date
        
        /*
         * PERFORMANCE OPTIMIZATION NOTE:
         * 
         * This demo loads all data at once for simplicity and better user experience
         * during demonstrations. In a production environment with large datasets,
         * consider implementing these optimizations:
         * 
         * 1. Use server-side pagination to load only what's displayed (current approach
         *    still loads all data and then paginates client-side)
         * 2. Default to a limited date range (like 'monthly') instead of 'all'
         * 3. Implement data caching for previously loaded pages
         * 4. Add loading indicators for background data fetching
         * 5. Consider virtual scrolling for very large tables
         */
        
        // First, get all filtered items to know how many total filtered items we have
        const allFilteredResult = filterWorkOrders(filterOptions)
        setFilteredOrders(allFilteredResult.data)
        
        // Now, add pagination and get the specific page data
        const paginatedOptions: FilterOptions = {
          ...filterOptions,
          page: currentPage,
          limit: itemsPerPage
        }
        
        // Get paginated work orders with all filters
        const paginatedResult = filterWorkOrders(paginatedOptions)
        
        // Update state with the current page data
        setWorkOrders(paginatedResult.data)
      } catch (error) {
        console.error('Error fetching work orders:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [currentPage, itemsPerPage, currentRegion, currentStatus, searchQuery, currentDateFilter, dateRange])
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setFilters((prevFilters: FilterOptions) => ({ ...prevFilters, searchTerm: newSearchTerm }))
    // Update searchQuery which is used in fetchData
    setSearchQuery(newSearchTerm)
    
    // Reset to first page when changing search query
    setCurrentPage(1)
  }
  
  // Handle view change
  const handleViewChange = (value: string) => {
    setView(value)
    // Update both filters state and currentStatus state
    setFilters(prev => ({
      ...prev,
      status: value !== 'all' ? value as WorkOrderStatus : undefined
    }))
    // This is the key line that was missing - we need to update currentStatus which is used in fetchData
    setCurrentStatus(value)
    
    // Reset to first page when changing filters
    setCurrentPage(1)
  }
  
  // Handle row click to show sidebar
  const handleRowClick = (order: WorkOrder) => {
    setSelectedWorkOrder(order)
    setIsSidebarOpen(true)
  }
  
  // Handle export button click
  const handleExport = () => {
    const filterOptions: FilterOptions = {
      region: currentRegion !== 'all' ? currentRegion : undefined,
      status: currentStatus !== 'all' ? currentStatus : undefined,
      search: searchQuery,
      sortBy: 'dateIssued',
      sortOrder: 'desc'
    }
    
    // Add date range filters
    if (currentDateFilter === 'weekly') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      filterOptions.startDate = weekAgo.toISOString().split('T')[0]
    } else if (currentDateFilter === 'monthly') {
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      filterOptions.startDate = monthAgo.toISOString().split('T')[0]
    } else if (currentDateFilter === 'custom' && dateRange) {
      filterOptions.startDate = dateRange.from.toISOString().split('T')[0]
      filterOptions.endDate = dateRange.to.toISOString().split('T')[0]
    }
    
    // Export all data matching the current filters
    exportAndDownloadWorkOrders(filterOptions)
  }
  
  // Get a description of the current date filter
  const getDateFilterDescription = () => {
    if (currentDateFilter === 'weekly') return 'past week';
    if (currentDateFilter === 'monthly') return 'past month';
    if (currentDateFilter === 'all') return 'all time';
    if (currentDateFilter === 'custom' && dateRange) {
      return `${format(dateRange.from, 'dd MMM yyyy')} to ${format(dateRange.to, 'dd MMM yyyy')}`;
    }
    return 'all time';
  }
  
  // Get region name by ID
  const getRegionName = (regionId: string) => {
    return mockRegions.find(r => r.id === regionId)?.name || 'Unknown Region'
  }
  
  // Get vendor name by ID
  const getVendorName = (vendorId: string) => {
    return mockVendors.find(v => v.id === vendorId)?.name || 'Unknown Vendor'
  }
  
  // Helper to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  // Render status badge with appropriate color and updated text
  const renderStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-teal-500 hover:bg-teal-500 text-white border-0"><Check className="mr-1 h-3 w-3" /> Complete</Badge>
      case 'in-progress':
        return <Badge variant="outline" className="bg-amber-500 hover:bg-amber-500 text-white border-0"><Clock className="mr-1 h-3 w-3" /> In-Progress</Badge>
      case 'not-started':
        return <Badge variant="outline" className="bg-red-500 hover:bg-red-500 text-white border-0"><AlertTriangle className="mr-1 h-3 w-3" /> Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  // Handle date filter change
  const handleDateFilterChange = (filterType: DateFilterType, range?: { from: Date; to: Date } | undefined) => {
    // Update the current date filter type
    setCurrentDateFilter(filterType as 'weekly' | 'monthly' | 'custom' | 'all')
    
    // Update the date range if provided (for custom filter)
    if (range && range.from && range.to) {
      setDateRange(range)
    } else {
      // Reset date range if not a custom filter
      setDateRange(undefined)
    }
    
    // Reset to first page when filter changes
    setCurrentPage(1)
  }
  
  // Close sidebar when pagination changes
  useEffect(() => {
    setIsSidebarOpen(false)
    setSelectedWorkOrder(null)
  }, [currentPage])
  
  // Show loading skeleton if data is not yet available
  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Work Orders</CardTitle>
          <CardDescription>View and manage all work orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full rounded-lg bg-muted animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <>
      <Card className="col-span-full relative overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>
                {currentStatus !== 'all' 
                  ? `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace('-', ' ')} work orders for ${getDateFilterDescription()}`
                  : `All work orders for ${getDateFilterDescription()}`
                }
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <DateRangeFilter 
                onFilterChange={handleDateFilterChange}
                onExport={handleExport}
                className="mr-2"
              />
              
              {/* View selector */}
              <Select value={currentStatus} onValueChange={handleViewChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Orders</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Export button */}
              <Button 
                variant="outline"
                onClick={handleExport}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </div>
          
          {/* Search row - simplified without the dropdown filters */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                value={filters.searchTerm || ''}
                onChange={handleSearchChange}
                className="pl-8 w-full"
              />
            </div>
            
            {/* Removed the additional filter dropdown */}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {workOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No work orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  workOrders.map((order: WorkOrder) => (
                    <TableRow 
                      key={order.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(order)}
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.title}</TableCell>
                      <TableCell>{getRegionName(order.regionId)}</TableCell>
                      <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(order.dateIssued)}</TableCell>
                      <TableCell>{renderStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-muted-foreground">
              Showing {workOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} 
              to {Math.min(currentPage * itemsPerPage, (currentPage - 1) * itemsPerPage + workOrders.length)} 
              {currentStatus !== 'all' ? (
                <span> of {filteredOrders.length} filtered work orders (from {totalPages * itemsPerPage} total)</span>
              ) : (
                <span> of {totalPages * itemsPerPage} work orders</span>
              )}
              {filters.searchTerm && ` matching "${filters.searchTerm}"`}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              
              <div className="text-sm">
                {currentStatus !== 'all' ? (
                  <span>Page {currentPage} of {Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage))}</span>
                ) : (
                  <span>Page {currentPage} of {totalPages}</span>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentStatus !== 'all'
                    ? currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)
                    : currentPage >= totalPages
                }
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Work Order Details Sidebar - implemented as a global Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="mb-4">
            <SheetTitle>Work Order Details</SheetTitle>
          </SheetHeader>
          
          {selectedWorkOrder && (
            <div className="space-y-4">
              {/* Work Order ID */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">ID</h4>
                <p className="text-sm font-semibold">{selectedWorkOrder.id}</p>
              </div>
              
              {/* Title */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
                <p className="text-sm">{selectedWorkOrder.title}</p>
              </div>
              
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="text-sm">{selectedWorkOrder.description}</p>
              </div>
              
              <Separator />
              
              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <div className="mt-1">{renderStatusBadge(selectedWorkOrder.status)}</div>
              </div>
              
              {/* Region */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Region</h4>
                <p className="text-sm">{getRegionName(selectedWorkOrder.regionId)}</p>
              </div>
              
              {/* Amount */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                <p className="text-sm">₹{selectedWorkOrder.amount.toLocaleString()}</p>
              </div>
              
              {/* Vendor */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Vendor</h4>
                <p className="text-sm">{getVendorName(selectedWorkOrder.vendorId)}</p>
              </div>
              
              <Separator />
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date Issued</h4>
                  <p className="text-sm">{formatDate(selectedWorkOrder.dateIssued)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
                  <p className="text-sm">{formatDate(selectedWorkOrder.dueDate)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                <p className="text-sm">{selectedWorkOrder.createdBy}</p>
              </div>
              
              <Separator />
              
              {/* Download Buttons */}
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Downloads</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button size="sm" variant="outline" className="flex items-center justify-center">
                    <Image className="mr-2 h-4 w-4" alt="Photo 1 thumbnail" />
                    Photo 1
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center justify-center">
                    <Image className="mr-2 h-4 w-4" alt="Photo 2 thumbnail" />
                    Photo 2
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center justify-center">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default WorkOrdersTable; 
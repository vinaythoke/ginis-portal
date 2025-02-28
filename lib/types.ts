/**
 * Type definitions for the dashboard application
 */

/**
 * Work order status types
 */
export type WorkOrderStatus = 'completed' | 'in-progress' | 'not-started'

/**
 * Work order priority types
 */
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent'

/**
 * Region/Taluka data
 */
export interface Region {
  id: string
  name: string
  type: 'city' | 'taluka'
}

/**
 * Vendor/Contractor data
 */
export interface Vendor {
  id: string
  name: string
  contactPerson: string
  contactNumber: string
  email: string
}

/**
 * Location data
 */
export interface Location {
  address: string
  latitude: number
  longitude: number
}

/**
 * Work order data
 */
export interface WorkOrder {
  id: string
  title: string
  description: string
  status: WorkOrderStatus
  dateIssued: string
  dueDate: string
  dateCompleted?: string
  regionId: string
  vendorId: string
  budget: number
  actualCost?: number
  amount: number
  tags: string[]
  location?: Location
  photoUrl?: string
  pdfUrl?: string
  priority?: WorkOrderPriority
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalWorkOrders: number
  notStartedWorkOrders: number
  inProgressWorkOrders: number
  completedWorkOrders: number
  overdueWorkOrders: number
  totalBudget: number
  totalSpent: number
}

/**
 * Region performance data
 */
export interface RegionPerformanceData {
  regionName: string
  completed: number
  inProgress: number
  notStarted: number
  total: number
}

/**
 * Monthly progress data
 */
export interface MonthlyProgressData {
  month: string
  completed: number
  allotted: number
}

/**
 * Filter options for work orders
 */
export interface FilterOptions {
  startDate?: string
  endDate?: string
  status?: WorkOrderStatus | WorkOrderStatus[]
  regionIds?: string[]
  vendorIds?: string[]
  searchTerm?: string
  search?: string
  page?: number
  limit?: number
  region?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
} 
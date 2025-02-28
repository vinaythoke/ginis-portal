/**
 * Type definitions for Work Order Dashboard
 * These types define the shape of data used throughout the application
 */

/**
 * Status options for a work order
 */
export type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

/**
 * Priority options for a work order
 */
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Represents a location/region where work orders are tracked
 */
export type Region = {
  id: string;
  name: string;
  type: 'city' | 'taluka' | 'district';
};

/**
 * Represents a vendor that performs work orders
 */
export type Vendor = {
  id: string;
  name: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
};

/**
 * Represents a work order assigned to a vendor
 */
export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  dateIssued: string;
  dateCompleted?: string;
  dueDate: string;
  regionId: string;
  vendorId: string;
  budget: number;
  actualCost?: number;
  attachments?: string[];
  tags?: string[];
  comments?: WorkOrderComment[];
};

/**
 * Represents a comment on a work order
 */
export type WorkOrderComment = {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
};

/**
 * Statistics for dashboard overview cards
 */
export type DashboardStats = {
  totalWorkOrders: number;
  pendingWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  cancelledWorkOrders: number;
  urgentWorkOrders: number;
  overdueWorkOrders: number;
  totalBudget: number;
  totalSpent: number;
};

/**
 * Filter options for tables and charts
 */
export type FilterOptions = {
  startDate?: string;
  endDate?: string;
  status?: WorkOrderStatus[];
  priority?: WorkOrderPriority[];
  regionIds?: string[];
  vendorIds?: string[];
  searchTerm?: string;
};

/**
 * Data for region performance chart
 */
export type RegionPerformanceData = {
  regionName: string;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  total: number;
};

/**
 * Data for monthly progress chart
 */
export type MonthlyProgressData = {
  month: string;
  completed: number;
  issued: number;
}; 
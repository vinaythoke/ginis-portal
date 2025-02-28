/**
 * Mock data for GINIS Portal
 * This file contains sample data to demonstrate dashboard functionality
 * In a real application, this would be replaced with API calls
 */

import {
  WorkOrderStatus,
  WorkOrderPriority,
  Region,
  Vendor,
  WorkOrder,
  DashboardStats,
  RegionPerformanceData,
  MonthlyProgressData,
  FilterOptions
} from '../types';

// Sample titles for work orders
const sampleTitles = [
  'Road Repair',
  'Water Pipeline Installation',
  'Streetlight Maintenance',
  'Drainage System Cleaning',
  'Bridge Maintenance',
  'Public Park Development',
  'Traffic Signal Installation',
  'Footpath Construction',
  'Public Toilet Construction',
  'Government Building Renovation'
];

// Helper function to generate random dates
const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random tags
const generateRandomTags = (): string[] => {
  const tags = ['repair', 'maintenance', 'construction', 'installation', 'development', 'renovation'];
  const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
  const selectedTags: string[] = [];
  
  for (let i = 0; i < numTags; i++) {
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    if (!selectedTags.includes(randomTag)) {
      selectedTags.push(randomTag);
    }
  }
  
  return selectedTags;
};

// Mock Regions (Cities/Talukas)
export const regions: Region[] = [
  { id: 'r1', name: 'Pune City', type: 'city' },
  { id: 'r2', name: 'Pimpri-Chinchwad', type: 'city' },
  { id: 'r3', name: 'Haveli', type: 'taluka' },
  { id: 'r4', name: 'Mulshi', type: 'taluka' },
  { id: 'r5', name: 'Maval', type: 'taluka' },
  { id: 'r6', name: 'Bhor', type: 'taluka' },
  { id: 'r7', name: 'Velhe', type: 'taluka' },
  { id: 'r8', name: 'Khed', type: 'taluka' },
  { id: 'r9', name: 'Junnar', type: 'taluka' },
  { id: 'r10', name: 'Ambegaon', type: 'taluka' },
  { id: 'r11', name: 'Shirur', type: 'taluka' },
  { id: 'r12', name: 'Baramati', type: 'taluka' },
  { id: 'r13', name: 'Indapur', type: 'taluka' },
  { id: 'r14', name: 'Daund', type: 'taluka' },
];

// Mock Vendors
export const vendors: Vendor[] = [
  { id: 'v1', name: 'Infra Solutions Pvt Ltd', contactPerson: 'Rajesh Kumar', contactNumber: '9876543210', email: 'rajesh@infrasolutions.com' },
  { id: 'v2', name: 'City Builders', contactPerson: 'Amit Patil', contactNumber: '8765432109', email: 'amit@citybuilders.com' },
  { id: 'v3', name: 'Road Works Corp', contactPerson: 'Sunil Sharma', contactNumber: '7654321098', email: 'sunil@roadworks.com' },
  { id: 'v4', name: 'Water Systems Ltd', contactPerson: 'Priya Verma', contactNumber: '6543210987', email: 'priya@watersystems.com' },
  { id: 'v5', name: 'Electric Grid Maintenance', contactPerson: 'Ramesh Joshi', contactNumber: '5432109876', email: 'ramesh@egm.com' },
];

/**
 * Get work orders from storage or generate a fresh set
 */
export const getWorkOrders = (): WorkOrder[] => {
  // Note: In browsers we would use localStorage, but for simplicity, we'll generate new data each time
  // We're not using localStorage here since it might not be available in all environments
  
  // Generate 246 work orders
  const statuses: WorkOrderStatus[] = ['completed', 'in-progress', 'not-started'];
  const newWorkOrders: WorkOrder[] = [];

  // Current date is February 2025
  const currentDate = new Date(2025, 1, 15); // February 15, 2025
  
  // Start date is 12 months ago from current date
  const startDate = new Date(currentDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  for (let i = 1; i <= 246; i++) {
    const status: WorkOrderStatus = statuses[Math.floor(Math.random() * statuses.length)];
    // Generate dates spanning the last 12 months
    const dateIssued = generateRandomDate(startDate, currentDate);
    const dueDate = new Date(dateIssued);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) + 30); // Due date 30-90 days after issue
    
    // Only completed orders have a completion date
    let dateCompleted: string | undefined = undefined;
    if (status === 'completed') {
      const completionDate = new Date(dateIssued);
      completionDate.setDate(completionDate.getDate() + Math.floor(Math.random() * 30) + 15); // 15-45 days after issue
      dateCompleted = completionDate.toISOString().split('T')[0];
    }

    const priority: WorkOrderPriority = ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as WorkOrderPriority;

    newWorkOrders.push({
      id: `GP/2425/${i.toString().padStart(4, '0')}`,
      title: `${sampleTitles[Math.floor(Math.random() * sampleTitles.length)]} - ${i}`,
      description: `Detailed description for work order ${i}. This work includes necessary repairs and maintenance.`,
      status: status,
      dateIssued: dateIssued.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      dateCompleted: dateCompleted,
      regionId: regions[Math.floor(Math.random() * regions.length)].id,
      vendorId: vendors[Math.floor(Math.random() * vendors.length)].id,
      budget: Math.floor(Math.random() * 500000) + 100000, // Budget between 100k and 600k
      actualCost: status === 'completed' ? Math.floor(Math.random() * 500000) + 100000 : undefined,
      amount: Math.floor(Math.random() * 1000000) + 200000, // Amount between 200k and 1.2M
      tags: generateRandomTags(),
      location: {
        address: `${Math.floor(Math.random() * 1000) + 1} Main St, Pune, Maharashtra`,
        latitude: 18.52 + (Math.random() * 0.1 - 0.05),
        longitude: 73.85 + (Math.random() * 0.1 - 0.05)
      },
      photoUrl: status === 'completed' ? `https://example.com/photos/work-order-${i}.jpg` : undefined,
      pdfUrl: status === 'completed' ? `https://example.com/reports/work-order-${i}.pdf` : undefined,
      priority: priority
    });
  }
  
  return newWorkOrders;
};

/**
 * Calculate dashboard statistics based on work orders
 */
export const getDashboardStats = (): DashboardStats => {
  const workOrders = getWorkOrders();
  const now = new Date();
  
  const totalWorkOrders = workOrders.length;
  const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed').length;
  const inProgressWorkOrders = workOrders.filter(wo => wo.status === 'in-progress').length;
  const notStartedWorkOrders = workOrders.filter(wo => wo.status === 'not-started').length;
  
  const overdueWorkOrders = workOrders.filter(wo => {
    if (wo.status === 'completed') return false;
    const dueDate = new Date(wo.dueDate);
    return dueDate < now;
  }).length;
  
  const totalBudget = workOrders.reduce((sum, wo) => sum + wo.budget, 0);
  const totalSpent = workOrders
    .filter(wo => wo.actualCost !== undefined)
    .reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
  
  return {
    totalWorkOrders,
    completedWorkOrders,
    inProgressWorkOrders,
    notStartedWorkOrders,
    overdueWorkOrders,
    totalBudget,
    totalSpent
  };
};

/**
 * Get region performance data
 */
export const getRegionPerformance = (): RegionPerformanceData[] => {
  const workOrders = getWorkOrders();
  const regionMap = new Map<string, {
    completed: number,
    inProgress: number,
    notStarted: number,
    total: number
  }>();
  
  // Initialize with all regions
  regions.forEach(region => {
    regionMap.set(region.id, {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      total: 0
    });
  });
  
  // Count work orders by region and status
  workOrders.forEach(wo => {
    const regionStats = regionMap.get(wo.regionId);
    if (regionStats) {
      regionStats.total += 1;
      
      if (wo.status === 'completed') {
        regionStats.completed += 1;
      } else if (wo.status === 'in-progress') {
        regionStats.inProgress += 1;
      } else if (wo.status === 'not-started') {
        regionStats.notStarted += 1;
      }
    }
  });
  
  // Convert to array and join with region names
  return Array.from(regionMap.entries()).map(([regionId, stats]) => {
    const region = regions.find(r => r.id === regionId);
    return {
      regionName: region ? region.name : 'Unknown Region',
      completed: stats.completed,
      inProgress: stats.inProgress,
      notStarted: stats.notStarted,
      total: stats.total
    };
  });
};

/**
 * Get monthly progress data for the current year
 */
export const getMonthlyProgressData = (): MonthlyProgressData[] => {
  const workOrders = getWorkOrders();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Initialize monthly data
  const monthlyData = months.map(month => ({
    month,
    completed: 0,
    allotted: 0
  }));
  
  // Count work orders by month
  workOrders.forEach(wo => {
    const issueDate = new Date(wo.dateIssued);
    const monthIndex = issueDate.getMonth();
    
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyData[monthIndex].allotted += 1;
      
      if (wo.status === 'completed') {
        monthlyData[monthIndex].completed += 1;
      }
    }
  });
  
  return monthlyData;
};

/**
 * Helper functions for charts
 */

/**
 * Calculate region performance data for charts
 */
export const calculateRegionPerformance = (filters?: FilterOptions) => {
  // Get all work orders
  const workOrders = getWorkOrders();
  
  // Apply filters if provided
  let filteredWorkOrders = workOrders;
  if (filters) {
    filteredWorkOrders = workOrders.filter(order => {
      // Date range filtering
      if (filters.startDate && new Date(order.dateIssued) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(order.dateIssued) > new Date(filters.endDate)) {
        return false;
      }
      return true;
    });
  }
  
  // Calculate region statistics based on filtered work orders
  const regionMap = new Map<string, {
    completed: number,
    inProgress: number,
    notStarted: number,
    total: number
  }>();
  
  // Initialize all regions
  regions.forEach(region => {
    regionMap.set(region.id, {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      total: 0
    });
  });
  
  // Count filtered work orders by region and status
  filteredWorkOrders.forEach(wo => {
    const regionStats = regionMap.get(wo.regionId);
    if (regionStats) {
      regionStats.total += 1;
      
      if (wo.status === 'completed') {
        regionStats.completed += 1;
      } else if (wo.status === 'in-progress') {
        regionStats.inProgress += 1;
      } else if (wo.status === 'not-started') {
        regionStats.notStarted += 1;
      }
    }
  });
  
  // Format data for chart
  return Array.from(regionMap.entries()).map(([regionId, stats]) => {
    const region = regions.find(r => r.id === regionId);
    return {
      name: region ? region.name : 'Unknown Region',
      regionName: region ? region.name : 'Unknown Region',
      completed: stats.completed,
      inProgress: stats.inProgress,
      notStarted: stats.notStarted,
      total: stats.total
    };
  });
};

/**
 * Calculate monthly progress data for charts
 */
export const calculateMonthlyProgress = (filters?: FilterOptions) => {
  // Get all work orders
  const workOrders = getWorkOrders();
  
  // Apply filters if provided
  let filteredWorkOrders = workOrders;
  if (filters) {
    filteredWorkOrders = workOrders.filter(order => {
      // Date range filtering
      if (filters.startDate && new Date(order.dateIssued) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(order.dateIssued) > new Date(filters.endDate)) {
        return false;
      }
      return true;
    });
  }
  
  // Use the last 12 months for chart
  const months = [
    'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'
  ];
  
  // Initialize monthly data
  const monthlyData = months.map(month => ({
    name: month,
    allotted: 0,
    completed: 0
  }));
  
  // Current date is February 2025
  const currentDate = new Date(2025, 1, 15);
  
  // Count work orders by month
  filteredWorkOrders.forEach(wo => {
    const issueDate = new Date(wo.dateIssued);
    
    // Calculate the month index relative to current date
    // (months are 0-indexed, so February is 1)
    const monthsDiff = (currentDate.getFullYear() - issueDate.getFullYear()) * 12 + 
                       (currentDate.getMonth() - issueDate.getMonth());
    
    // Only include data from the past 12 months
    if (monthsDiff >= 0 && monthsDiff < 12) {
      // Map to the correct index in our months array
      // For February 2025, current month is index 0, last month (January) is index 11
      const index = 11 - monthsDiff;
      
      monthlyData[index].allotted += 1;
      
      if (wo.status === 'completed') {
        monthlyData[index].completed += 1;
      }
    }
  });
  
  return monthlyData;
};

/**
 * Filter work orders based on criteria
 */
export const filterWorkOrders = (filters: FilterOptions): { data: WorkOrder[], totalCount: number } => {
  const workOrders = getWorkOrders();
  
  const filteredOrders = workOrders.filter(order => {
    // Filter by date range
    if (filters.startDate && new Date(order.dateIssued) < new Date(filters.startDate)) {
      return false;
    }
    
    if (filters.endDate && new Date(order.dateIssued) > new Date(filters.endDate)) {
      return false;
    }
    
    // Filter by status
    if (filters.status) {
      // Handle both string and array types
      if (Array.isArray(filters.status)) {
        if (filters.status.length > 0 && !filters.status.includes(order.status)) {
          return false;
        }
      } else if (filters.status !== order.status) {
        return false;
      }
    }
    
    // Filter by region (handle both region and regionIds)
    if (filters.region && order.regionId !== filters.region) {
      return false;
    }
    
    if (filters.regionIds && filters.regionIds.length > 0 && !filters.regionIds.includes(order.regionId)) {
      return false;
    }
    
    // Filter by vendor
    if (filters.vendorIds && filters.vendorIds.length > 0 && !filters.vendorIds.includes(order.vendorId)) {
      return false;
    }
    
    // Filter by search term (handle both search and searchTerm)
    const searchQuery = filters.search || filters.searchTerm;
    if (searchQuery && searchQuery.trim() !== '') {
      const searchTerm = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchTerm) ||
        order.title.toLowerCase().includes(searchTerm) ||
        order.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });
  
  // Apply pagination if needed
  const totalCount = filteredOrders.length;
  let paginatedData = filteredOrders;
  
  if (filters.page && filters.limit) {
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    paginatedData = filteredOrders.slice(startIndex, endIndex);
  }
  
  return {
    data: paginatedData,
    totalCount: totalCount
  };
};

/**
 * Get available regions for filtering
 */
export const getRegions = (): Region[] => {
  return regions;
};

/**
 * Get available vendors for filtering
 */
export const getVendors = (): Vendor[] => {
  return vendors;
};

// Export renamed variables for backward compatibility
export const mockRegions = regions;
export const mockVendors = vendors;
export const mockWorkOrders = getWorkOrders();

/**
 * Calculate statistics for dashboard cards
 * This is for backward compatibility with existing components
 */
export const calculateStatistics = (): DashboardStats => {
  return getDashboardStats();
}; 
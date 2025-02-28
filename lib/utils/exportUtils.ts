/**
 * Utility functions for exporting dashboard data
 * These functions help export work order data to Excel format
 */

import { WorkOrder, Region, Vendor } from '../types';

/**
 * Export work orders to Excel and trigger download
 * 
 * @param workOrders - Array of work orders to export
 * @param regions - Array of regions for lookup
 * @param vendors - Array of vendors for lookup
 * @param filename - Name of the file to download (without extension)
 */
export const exportAndDownloadWorkOrders = (
  workOrders: WorkOrder[],
  regions: Region[],
  vendors: Vendor[],
  filename: string = 'work_orders'
) => {
  // In a real application, we would use a library like xlsx or exceljs
  // For this demo, we'll create a CSV file
  
  // Get region and vendor names by ID
  const getRegionName = (regionId: string) => {
    return regions.find(r => r.id === regionId)?.name || 'Unknown Region'
  }
  
  const getVendorName = (vendorId: string) => {
    return vendors.find(v => v.id === vendorId)?.name || 'Unknown Vendor'
  }
  
  // Format date for better readability
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  // Define CSV headers
  const headers = [
    'ID',
    'Title',
    'Description',
    'Status',
    'Priority',
    'Region',
    'Vendor',
    'Date Issued',
    'Due Date',
    'Completion Date',
    'Budget',
    'Location'
  ]
  
  // Create CSV rows from work orders
  const rows = workOrders.map(order => [
    order.id,
    order.title,
    order.description,
    order.status,
    order.priority,
    getRegionName(order.regionId),
    getVendorName(order.vendorId),
    formatDate(order.dateIssued),
    formatDate(order.dueDate),
    order.completionDate ? formatDate(order.completionDate) : 'N/A',
    formatCurrency(order.budget),
    order.location.address
  ])
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create a download link and trigger the download
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Trigger download of exported data
 * @param blob - Blob containing export data
 * @param filename - Name for the downloaded file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Generate a timestamped filename for exports
 * @param prefix - Prefix for the filename
 * @returns Filename with timestamp
 */
export const generateExportFilename = (prefix: string): string => {
  const date = new Date();
  const timestamp = date.toISOString().split('T')[0];
  return `${prefix}_${timestamp}.csv`;
}; 
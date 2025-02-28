import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge class names with Tailwind CSS
 * This helps avoid conflicts when combining conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Export data to CSV/Excel
 * @param data Array of objects to export
 * @param filename Filename for the exported file
 */
export function exportToExcel(data: any[], filename: string) {
  // If no data, return
  if (!data.length) return

  // Get headers from first object keys
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        // Handle values that need quotes (contains commas, quotes, or newlines)
        let val = row[header]
        
        // Convert to string
        val = val === null || val === undefined ? '' : String(val)
        
        // Wrap in quotes if contains special characters
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          // Escape quotes
          val = val.replace(/"/g, '""')
          // Wrap in quotes
          val = `"${val}"`
        }
        
        return val
      }).join(',')
    )
  ].join('\n')
  
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create a download link
  const link = document.createElement('a')
  
  // Create object URL
  const url = URL.createObjectURL(blob)
  
  // Set link properties
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  // Add link to document
  document.body.appendChild(link)
  
  // Click link to start download
  link.click()
  
  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

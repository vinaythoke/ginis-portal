# GINIS Portal Services

This directory contains service modules that handle data fetching and manipulation for the GINIS Portal application.

## Current Implementation

The current implementation uses mock data for demonstration purposes. The main file is `mockData.ts`, which provides functions that simulate API responses.

## API Integration Guide

When integrating with real APIs, replace the mock implementations with actual API calls while maintaining the same function signatures to ensure compatibility with the rest of the application.

### Service Structure

Create separate service files for different data domains:

- `workOrderService.ts` - Work order related API calls
- `regionService.ts` - Region/location data API calls
- `vendorService.ts` - Vendor/contractor API calls
- `statsService.ts` - Dashboard statistics API calls

### Example Implementation

Below is an example of how to implement a real API service:

```typescript
// workOrderService.ts
import { WorkOrder, FilterOptions } from '../types';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get all work orders
 */
export const getWorkOrders = async (): Promise<WorkOrder[]> => {
  try {
    const response = await fetch(`${API_URL}/api/work-orders`);
    if (!response.ok) throw new Error('Failed to fetch work orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return [];
  }
};

/**
 * Get filtered work orders
 */
export const filterWorkOrders = async (
  filters: FilterOptions
): Promise<{ data: WorkOrder[]; totalCount: number }> => {
  try {
    // Convert filters to query parameters
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.search) queryParams.append('search', filters.search);
    
    // Add array parameters
    if (filters.regionIds && filters.regionIds.length > 0) {
      filters.regionIds.forEach(id => queryParams.append('regionIds', id));
    }
    
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      filters.status.forEach(status => queryParams.append('status', status));
    } else if (filters.status && !Array.isArray(filters.status)) {
      queryParams.append('status', filters.status);
    }

    const response = await fetch(`${API_URL}/api/work-orders?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch filtered work orders');
    
    const result = await response.json();
    return {
      data: result.data,
      totalCount: result.totalCount
    };
  } catch (error) {
    console.error('Error fetching filtered work orders:', error);
    return { data: [], totalCount: 0 };
  }
};
```

### Authentication

If your API requires authentication:

```typescript
// authService.ts
let authToken: string | null = null;

/**
 * Login and get authentication token
 */
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    authToken = data.token;
    localStorage.setItem('auth_token', authToken);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = (): HeadersInit => {
  // Check localStorage for token if not in memory
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': authToken ? `Bearer ${authToken}` : '',
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!authToken || !!localStorage.getItem('auth_token');
};
```

Then, update your other service calls to include authentication headers:

```typescript
export const getWorkOrders = async (): Promise<WorkOrder[]> => {
  try {
    const response = await fetch(`${API_URL}/api/work-orders`, {
      headers: getAuthHeaders(),
    });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Redirect to login page or refresh token
      window.location.href = '/login';
      return [];
    }
    
    if (!response.ok) throw new Error('Failed to fetch work orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return [];
  }
};
```

## Error Handling

Implement proper error handling in your service layer:

1. Log errors for debugging
2. Return appropriate fallback values
3. Implement retry logic for transient errors
4. Handle specific HTTP status codes appropriately

## Data Caching

Consider implementing client-side caching for frequently accessed data:

```typescript
const workOrderCache: { [key: string]: { data: WorkOrder[], timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getWorkOrders = async (): Promise<WorkOrder[]> => {
  const cacheKey = 'all_work_orders';
  
  // Check cache first
  if (workOrderCache[cacheKey] && 
      Date.now() - workOrderCache[cacheKey].timestamp < CACHE_DURATION) {
    return workOrderCache[cacheKey].data;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/work-orders`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch work orders');
    
    const data = await response.json();
    
    // Update cache
    workOrderCache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return [];
  }
};
``` 
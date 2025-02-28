# GINIS Portal Architecture

This document outlines the architecture and design decisions for the GINIS Portal application.

## Architecture Overview

The GINIS Portal is built as a client-side rendering (CSR) application using Next.js 14 with React. It follows a component-based architecture with a focus on functional components and hooks.

```
                   +-------------------+
                   |    UI Layer       |
                   | (React Components)|
                   +--------+----------+
                            |
                            v
                   +-------------------+
                   |   State Layer     |
                   | (React Hooks)     |
                   +--------+----------+
                            |
                            v
                   +-------------------+
                   |   Service Layer   |
                   | (API Integration) |
                   +-------------------+
```

## Key Design Decisions

### 1. Component Structure

- **Atomic Design Approach**: Components follow a loose atomic design pattern
  - UI components (atoms and molecules) in `/components/ui`
  - Composite components (organisms) in `/components/dashboard`
  - Page templates in `/app` directory

### 2. State Management

- **React Hooks**: Uses React's built-in hooks for state management
  - `useState` for local component state
  - `useEffect` for side effects and data fetching
  - Custom hooks for reusable logic

### 3. Styling Approach

- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **ShadCN UI**: Component library built on Tailwind CSS
- **Component Variants**: Uses class-variance-authority (cva) for component variants

### 4. Data Flow

- **Unidirectional Data Flow**: Data flows down through props
- **Lifting State Up**: Shared state is managed by parent components
- **Service Layer**: Data fetching and manipulation logic is abstracted in service files

### 5. UI Component System

The application uses ShadCN UI components, which are built using:
- **Radix UI**: For accessible primitives
- **Tailwind CSS**: For styling
- **Class Variance Authority**: For styling variants

### 6. Performance Optimization

Several strategies are used to optimize performance:
- **React.memo**: Used selectively for components that render frequently
- **Virtualization**: For large data tables
- **Pagination**: To limit the amount of data displayed at once
- **Code Splitting**: Via Next.js's dynamic imports

## Directory Structure

```
/
├── app/                # Next.js app router pages
├── components/         # React components
│   ├── dashboard/      # Dashboard-specific components
│   │   ├── charts/     # Charts and data visualization
│   │   ├── filters/    # Filter components
│   │   └── tables/     # Table components
│   └── ui/             # UI components (ShadCN)
├── lib/                # Utility functions and types
│   ├── services/       # Data services
│   ├── types.ts        # TypeScript type definitions
│   └── utils/          # Helper utilities
└── public/             # Static assets
```

## Key Components

### WorkOrdersTable

The core component of the application displays work orders in a sortable, filterable table:

- **Features**:
  - Sorting by column
  - Filtering by date range and status
  - Search functionality
  - Excel export

### DateRangeFilter

Provides intuitive date range filtering:

- **Features**:
  - Predefined filters (Weekly, Monthly, All)
  - Custom date range selection
  - Visual calendar with range highlighting

### StatusBadge

Displays work order status with color-coded badges:

- **Variants**:
  - Completed (Green)
  - In Progress (Amber)
  - Not Started (Red)

## Data Services

The application is designed with a service layer pattern to abstract data fetching and manipulation:

- **WorkOrderService**: Handles fetching and filtering work orders
- **RegionService**: Manages region-specific data
- **ExportService**: Handles exporting data to Excel

## Future Architecture Considerations

1. **State Management**: For more complex state requirements, consider adding a state management library like Redux or Zustand
2. **Server Components**: Leverage Next.js server components for improved performance and SEO
3. **API Integration**: Replace mock services with real API integration
4. **Authentication**: Add an authentication layer with JWT or OAuth
5. **Caching**: Implement a caching strategy for improved performance 
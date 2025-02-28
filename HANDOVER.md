# GINIS Portal Project Handover

This document provides information for developers who will be taking over the GINIS Portal project.

## Project Overview

GINIS (Geographic Information Network and Infrastructure System) Portal is a dashboard application designed for the DPO Pune to manage and visualize work orders across different regions. The application provides filtering, sorting, and export capabilities for work order data.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/vinaythoke/ginis-portal.git
```

2. Install dependencies:
```bash
cd ginis-portal
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Development Environment

- **Node.js**: v18.17 or later
- **Package Manager**: npm
- **Recommended IDE**: VS Code with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript language features

## Project Structure

The project follows a standard Next.js 14 application structure:

```
/
├── app/                # Next.js app router pages
├── components/         # React components
│   ├── dashboard/      # Dashboard-specific components
│   └── ui/             # UI components (ShadCN)
├── lib/                # Utility functions and types
│   ├── services/       # Data services
│   └── utils/          # Helper utilities
└── public/             # Static assets
```

## Core Features

### 1. Dashboard Overview
- Statistics cards showing work order counts
- Work order status distribution by region
- Monthly trend charts

### 2. Work Orders Table
- Sortable columns
- Filtering by date range and status
- Search functionality
- Excel export

### 3. Filtering System
- Date range filtering with custom date picker
- Status filtering with dynamic badge counts
- Reset filters functionality

## Key Components

### 1. WorkOrdersTable
Located at `components/dashboard/tables/WorkOrdersTable.tsx`
- Core component for displaying work orders
- Handles sorting, filtering, and search

### 2. DateRangeFilter
Located at `components/dashboard/filters/DateRangeFilter.tsx`
- Provides date range filtering with custom calendar UI
- Handles predefined ranges (weekly, monthly) and custom ranges

### 3. StatusFilter
Located at `components/dashboard/filters/StatusFilter.tsx`
- Toggleable status badges for filtering

## Data Services

The application currently uses mock data services:

- `lib/services/workOrderService.ts`: Handles work order data
- `lib/services/exportService.ts`: Handles Excel export functionality

### Replacing Mock Data

To replace mock data with real API integration:

1. Locate the mock service implementations
2. Replace with actual API calls while maintaining the same return types
3. Update environment variables as needed

## Known Issues and Limitations

1. **TypeScript Error Suppression**: Some TypeScript errors are currently suppressed with `@ts-ignore` comments that should be addressed in a future update
2. **Large Data Sets**: The table is not optimized for extremely large datasets (>1000 records)
3. **Mobile Optimization**: While responsive, some advanced filtering features have limited usability on very small screens

## Recent Changes

- Updated work order ID format to "GP/2425/XXXX"
- Fixed badge hover effect in table rows
- Added React.memo optimization for table components

## Deployment

The application can be deployed using Vercel or any other Next.js-compatible hosting platform:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## Future Development Roadmap

1. **Authentication**: Add user authentication and role-based access control
2. **Real-time Updates**: Implement WebSocket for real-time data updates
3. **Enhanced Mobile Features**: Optimize complex filtering for mobile devices
4. **Pagination**: Add server-side pagination for better performance with large datasets
5. **Offline Support**: Add PWA capabilities for offline access to critical information

## Contact Information

For questions about the codebase, please contact:

- **Original Developer**: Vinay Thoke - [vinaythoke@github.com]

## Appendix

### Adding New UI Components

The project uses the ShadCN component approach. To add new components:

```bash
# Install a new component
npx shadcn@latest add [component-name]
```

### Troubleshooting Common Issues

1. **Missing dependencies**: Run `npm install` after pulling changes
2. **Build errors**: Check for TypeScript errors with `npm run type-check`
3. **Layout issues**: Verify Tailwind classes and responsive breakpoints 
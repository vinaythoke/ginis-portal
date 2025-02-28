/**
 * StatsCard component for displaying dashboard metrics
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Props for StatsCard component
interface StatsCardProps {
  title: string;            // Title of the card
  value: string | number;   // Main value to display
  description?: string;     // Optional description text
  icon?: React.ReactNode;   // Optional icon component
  trend?: {                 // Optional trend indicator
    value: number;
    label: string;
    positive?: boolean;     // Whether trend is positive or negative (affects color)
    isIncrease?: boolean;   // Whether the trend shows an increase (affects arrow direction)
  };
  className?: string;       // Optional additional CSS classes
}

/**
 * StatsCard - Displays a key metric in the dashboard
 * 
 * This component shows a statistic (like total allotted, completed, etc.)
 * along with an optional trend indicator showing changes vs last month.
 */
const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("dashboard-card overflow-hidden shadow-sm hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-3xl font-bold mt-2">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span 
              className={cn(
                "flex items-center text-xs font-medium", 
                trend.positive 
                  ? "text-emerald-500" 
                  : "text-rose-500"
              )}
            >
              {(trend.isIncrease !== undefined ? trend.isIncrease : trend.positive) ? (
                <ChevronUp className="h-3 w-3 mr-0.5" />
              ) : (
                <ChevronDown className="h-3 w-3 mr-0.5" />
              )}
              {(trend.isIncrease !== undefined ? trend.isIncrease : trend.positive) ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard; 
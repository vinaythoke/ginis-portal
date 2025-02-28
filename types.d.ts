/**
 * Global type declarations for the dashboard application
 */

// React module declaration
declare module "react" {
  interface HTMLAttributes {
    // Allow any custom attribute
    [key: string]: any;
  }

  // Add missing types
  type ReactNode = any;
  type ElementRef<T> = any;
  type ComponentProps<T> = any;
  type ComponentPropsWithoutRef<T> = any;
  type ThHTMLAttributes<T> = any;
  type TdHTMLAttributes<T> = any;
  type ReactElement<T> = any;
  type ChangeEvent<T> = any;
  
  // Add missing methods
  const useState: any;
  const useEffect: any;
  const useContext: any;
  const createContext: any;
  const forwardRef: any;
  const useRef: any;
}

// Lucide React module declaration
declare module "lucide-react" {
  export interface LucideProps {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    color?: string;
    className?: string;
    [key: string]: any;
  }

  export const AlertTriangle: React.FC<LucideProps>;
  export const BarChart2: React.FC<LucideProps>;
  export const Bell: React.FC<LucideProps>;
  export const Calendar: React.FC<LucideProps>;
  export const Check: React.FC<LucideProps>;
  export const ChevronDown: React.FC<LucideProps>;
  export const ChevronLeft: React.FC<LucideProps>;
  export const ChevronRight: React.FC<LucideProps>;
  export const ChevronUp: React.FC<LucideProps>;
  export const Circle: React.FC<LucideProps>;
  export const Clock: React.FC<LucideProps>;
  export const Download: React.FC<LucideProps>;
  export const FileText: React.FC<LucideProps>;
  export const HelpCircle: React.FC<LucideProps>;
  export const Image: React.FC<LucideProps>;
  export const LogOut: React.FC<LucideProps>;
  export const Menu: React.FC<LucideProps>;
  export const Search: React.FC<LucideProps>;
  export const Settings: React.FC<LucideProps>;
  export const X: React.FC<LucideProps>;
  export const XCircle: React.FC<LucideProps>;
}

// Recharts module declaration
declare module "recharts" {
  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    aspect?: number;
    minHeight?: string | number;
    minWidth?: string | number;
    maxHeight?: string | number;
    maxWidth?: string | number;
    debounce?: number;
    id?: string;
    className?: string;
    children?: React.ReactNode;
  }

  export interface LineChartProps {
    width?: number;
    height?: number;
    data?: Array<any>;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    className?: string;
    children?: React.ReactNode;
  }

  export interface LineProps {
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey: string;
    name?: string;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    fillOpacity?: number;
    activeDot?: boolean | object;
    dot?: boolean | object;
    label?: boolean | object | React.ReactNode | Function;
    className?: string;
    children?: React.ReactNode;
  }

  export interface BarChartProps {
    width?: number;
    height?: number;
    data?: Array<any>;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    barCategoryGap?: string | number;
    barSize?: number;
    className?: string;
    children?: React.ReactNode;
  }

  export interface BarProps {
    dataKey: string;
    name?: string;
    fill?: string;
    strokeWidth?: number;
    stroke?: string;
    className?: string;
    children?: React.ReactNode;
    radius?: number | Array<number>;
    stackId?: string;
  }

  export interface CartesianGridProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    horizontal?: boolean;
    vertical?: boolean;
    horizontalPoints?: Array<number>;
    verticalPoints?: Array<number>;
    strokeDasharray?: string;
    className?: string;
  }

  export interface XAxisProps {
    dataKey?: string;
    hide?: boolean;
    tick?: boolean | object | React.ReactNode | Function;
    tickLine?: boolean | object | React.ReactNode;
    axisLine?: boolean | object;
    label?: string | number | object | React.ReactNode;
    height?: number;
    allowDecimals?: boolean;
    padding?: {
      left?: number;
      right?: number;
    };
    angle?: number;
    textAnchor?: string;
    interval?: number | string;
    className?: string;
  }

  export interface YAxisProps {
    dataKey?: string;
    hide?: boolean;
    tick?: boolean | object | React.ReactNode | Function;
    tickLine?: boolean | object | React.ReactNode;
    axisLine?: boolean | object;
    label?: string | number | object | React.ReactNode;
    width?: number;
    allowDecimals?: boolean;
    padding?: {
      top?: number;
      bottom?: number;
    };
    className?: string;
  }

  export interface TooltipProps {
    content?: React.ReactNode | Function;
    cursor?: boolean | object | React.ReactNode;
    offset?: number;
    wrapperStyle?: object;
    labelStyle?: object;
    itemStyle?: object;
    formatter?: Function;
    labelFormatter?: Function;
    className?: string;
  }

  export interface LegendProps {
    content?: React.ReactNode | Function;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    align?: 'left' | 'center' | 'right';
    layout?: 'horizontal' | 'vertical';
    iconSize?: number;
    iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    height?: number;
    formatter?: (value: string) => string;
    className?: string;
  }

  export const ResponsiveContainer: React.FC<ResponsiveContainerProps>;
  export const LineChart: React.FC<LineChartProps>;
  export const Line: React.FC<LineProps>;
  export const BarChart: React.FC<BarChartProps>;
  export const Bar: React.FC<BarProps>;
  export const CartesianGrid: React.FC<CartesianGridProps>;
  export const XAxis: React.FC<XAxisProps>;
  export const YAxis: React.FC<YAxisProps>;
  export const Tooltip: React.FC<TooltipProps>;
  export const Legend: React.FC<LegendProps>;
}

// Radix UI module declarations
declare module "@radix-ui/react-avatar" {
  export const Root: React.FC<any>;
  export const Image: React.FC<any>;
  export const Fallback: React.FC<any>;
}

declare module "@radix-ui/react-dropdown-menu" {
  export const Root: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Group: React.FC<any>;
  export const Portal: React.FC<any>;
  export const Sub: React.FC<any>;
  export const RadioGroup: React.FC<any>;
  export const SubTrigger: React.FC<any>;
  export const SubContent: React.FC<any>;
  export const Content: React.FC<any>;
  export const Item: React.FC<any>;
  export const CheckboxItem: React.FC<any>;
  export const RadioItem: React.FC<any>;
  export const Label: React.FC<any>;
  export const Separator: React.FC<any>;
  export const Shortcut: React.FC<any>;
}

declare module "@radix-ui/react-select" {
  export const Root: React.FC<any>;
  export const Group: React.FC<any>;
  export const Value: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Content: React.FC<any>;
  export const Viewport: React.FC<any>;
  export const Item: React.FC<any>;
  export const ItemText: React.FC<any>;
  export const ItemIndicator: React.FC<any>;
  export const ScrollUpButton: React.FC<any>;
  export const ScrollDownButton: React.FC<any>;
}

declare module "@radix-ui/react-dialog" {
  export const Root: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Portal: React.FC<any>;
  export const Overlay: React.FC<any>;
  export const Content: React.FC<any>;
  export const Header: React.FC<any>;
  export const Footer: React.FC<any>;
  export const Title: React.FC<any>;
  export const Description: React.FC<any>;
  export const Close: React.FC<any>;
}

declare module "@radix-ui/react-tooltip" {
  export const Root: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Content: React.FC<any>;
  export const Provider: React.FC<any>;
}

declare module "@radix-ui/react-switch" {
  export const Root: React.FC<any>;
}

declare module "@radix-ui/react-toast" {
  export const Provider: React.FC<any>;
  export const Viewport: React.FC<any>;
  export const Root: React.FC<any>;
  export const Action: React.FC<any>;
  export const Close: React.FC<any>;
  export const Title: React.FC<any>;
  export const Description: React.FC<any>;
}

declare module "@radix-ui/react-tabs" {
  export const Root: React.FC<any>;
  export const List: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Content: React.FC<any>;
}

declare module "@radix-ui/react-toggle" {
  export const Root: React.FC<any>;
}

declare module "@radix-ui/react-toggle-group" {
  export const Root: React.FC<any>;
  export const Item: React.FC<any>;
}

declare module "@radix-ui/react-slider" {
  export const Root: React.FC<any>;
}

declare module "next-themes" {
  export const useTheme: () => {
    theme: string;
    setTheme: (theme: string) => void;
  };
}

declare module "sonner" {
  export const Toaster: React.FC<any>;
} 
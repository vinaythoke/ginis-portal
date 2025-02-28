"use client"

import { useState } from 'react'
import { Menu, X, Bell, Calendar, BarChart2, Settings, LogOut, HelpCircle } from 'lucide-react'
import Image from 'next/image'

import OverviewCards from '@/components/dashboard/cards/OverviewCards'
import RegionPerformanceChart from '@/components/dashboard/charts/RegionPerformanceChart'
import MonthlyProgressChart from '@/components/dashboard/charts/MonthlyProgressChart'
import WorkOrderStatusChart from '@/components/dashboard/charts/WorkOrderStatusChart'
import WorkOrdersTable from '@/components/dashboard/tables/WorkOrdersTable'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Dashboard Page
 * 
 * Main dashboard for government authorities to track work orders
 * Displays statistics, charts, and a detailed work order table
 */
export default function Dashboard() {
  // State to handle sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Toggle sidebar collapse state
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)
  
  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-gray-800 shadow-sm ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          {!sidebarCollapsed && (
            <Image 
              src="/ginis-logo.png" 
              alt="GINIS Portal" 
              width={180} 
              height={45} 
              className="object-contain" 
            />
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-2 p-4 flex-1">
          {/* Dashboard link */}
          <Button 
            variant={sidebarCollapsed ? "ghost" : "default"} 
            className={`flex items-center gap-3 text-base font-medium rounded-lg ${
              sidebarCollapsed 
                ? 'justify-center h-10 w-10 p-0' 
                : 'justify-start pl-3 pr-4 h-12 w-full'
            } ${
              // Active state styling
              'bg-[#592FD6] text-white hover:bg-[#4a27b3]'
            }`}
          >
            <BarChart2 className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Button>
          
          {/* Reports link (new) */}
          <Button 
            variant="ghost" 
            className={`flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
              sidebarCollapsed 
                ? 'justify-center h-10 w-10 p-0' 
                : 'justify-start pl-3 pr-4 h-12 w-full'
            }`}
          >
            <svg 
              className="h-5 w-5 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" 
              />
            </svg>
            {!sidebarCollapsed && <span>Reports</span>}
          </Button>
          
          {/* Calendar link */}
          <Button 
            variant="ghost" 
            className={`flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
              sidebarCollapsed 
                ? 'justify-center h-10 w-10 p-0' 
                : 'justify-start pl-3 pr-4 h-12 w-full'
            }`}
          >
            <Calendar className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Calendar</span>}
          </Button>
          
          {/* Updates link (new) */}
          <Button 
            variant="ghost" 
            className={`flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
              sidebarCollapsed 
                ? 'justify-center h-10 w-10 p-0' 
                : 'justify-start pl-3 pr-4 h-12 w-full'
            }`}
          >
            <svg 
              className="h-5 w-5 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
            {!sidebarCollapsed && <span>Updates</span>}
          </Button>
          
          {/* Settings link */}
          <Button 
            variant="ghost" 
            className={`flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
              sidebarCollapsed 
                ? 'justify-center h-10 w-10 p-0' 
                : 'justify-start pl-3 pr-4 h-12 w-full'
            } mt-auto`}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Button>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-white">
                  <SheetHeader className="p-6 border-b border-gray-100">
                    <div className="flex justify-center">
                      <Image 
                        src="/ginis-logo.png" 
                        alt="GINIS Portal" 
                        width={180} 
                        height={45} 
                        className="object-contain" 
                      />
                    </div>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 p-4">
                    <SheetClose asChild>
                      <Button 
                        variant="default" 
                        className="flex items-center gap-3 text-base font-medium rounded-lg justify-start pl-3 pr-4 h-12 w-full bg-[#592FD6] text-white hover:bg-[#4a27b3]"
                      >
                        <BarChart2 className="h-5 w-5 flex-shrink-0" />
                        <span>Dashboard</span>
                      </Button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-3 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-lg justify-start pl-3 pr-4 h-12 w-full"
                      >
                        <svg 
                          className="h-5 w-5 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" 
                          />
                        </svg>
                        <span>Reports</span>
                      </Button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-3 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-lg justify-start pl-3 pr-4 h-12 w-full"
                      >
                        <Calendar className="h-5 w-5 flex-shrink-0" />
                        <span>Calendar</span>
                      </Button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-3 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-lg justify-start pl-3 pr-4 h-12 w-full"
                      >
                        <svg 
                          className="h-5 w-5 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                          />
                        </svg>
                        <span>Updates</span>
                      </Button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-3 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-lg justify-start pl-3 pr-4 h-12 w-full mt-auto"
                      >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        <span>Settings</span>
                      </Button>
                    </SheetClose>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Page Title */}
            <h1 className="text-xl font-bold md:ml-0">GINIS Portal / Dashboard</h1>
            
            {/* User Profile & Notifications */}
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Avatar>
                <AvatarImage src="/avatar.png" alt="Profile" />
                <AvatarFallback>GO</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          
          {/* Stats Cards */}
          <OverviewCards />
          
          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <MonthlyProgressChart />
            <WorkOrderStatusChart />
          </div>
          
          {/* Region Performance Chart - Full Width */}
          <div className="mt-8">
            <RegionPerformanceChart />
          </div>
          
          {/* Work Orders Table */}
          <div className="mt-8">
            <WorkOrdersTable />
          </div>
          
          {/* Copyright Footer */}
          <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} GINIS Portal - District Planning Commission of Pune District. All rights reserved.</p>
            <p className="mt-1">Proprietary software. Unauthorized use, reproduction or distribution is prohibited.</p>
          </footer>
        </div>
      </main>
    </div>
  )
}
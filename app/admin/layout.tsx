'use client'

import type { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { DashboardNavigationProvider } from '@/components/dashboard/navigation'
import { ThemeProvider } from '@/components/dashboard/theme-provider'
import '@/components/dashboard/dashboard.css'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="lavish-dashboard-theme">
      <DashboardNavigationProvider>
        <div className="lavish-dashboard h-svh overflow-hidden no-scrollbar">
          <DashboardSidebar>
            <DashboardTopbar />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </DashboardSidebar>
        </div>
      </DashboardNavigationProvider>
    </ThemeProvider>
  )
}

'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { LavishLogo } from './logo'
import { SidebarCollapseIcon } from './icons'
import { DashboardLink, useDashboardNavigation } from './navigation'
import { useTheme } from './theme-provider'
import { currentUser, navigationGroups, type NavigationItem } from '../dashboard/data'
import { cn } from '@/lib/utils'

type SidebarProps = {
  children: ReactNode
}

export function DashboardSidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300 md:relative md:z-auto',
          collapsed ? 'w-[5.125rem]' : 'w-[17.25rem]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between px-4">
          <div className={cn('flex min-w-0 items-center gap-3', collapsed && 'justify-center')}>
            <LavishLogo className="size-7 shrink-0" />
            {!collapsed && (
              <span className="truncate text-xl font-medium tracking-tight text-foreground">
                Lavish
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
          >
            <SidebarCollapseIcon className={cn('size-5 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-3">
          {navigationGroups.map((group) => (
            <div key={group.label} className="mb-3">
              <p className={cn(
                'mb-1 px-3 text-sm font-medium text-foreground/70',
                collapsed && 'text-center text-xs',
              )}>
                {collapsed ? group.label[0] : group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.name}
                    item={item}
                    collapsed={collapsed}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-medium text-gold">
              {currentUser.initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{currentUser.name}</p>
                <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex h-14 items-center border-b border-border px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 6H17M3 10H17M3 14H17" />
            </svg>
          </button>
          <span className="ml-3 text-lg font-medium text-foreground">Lavish</span>
        </header>
        {children}
      </div>
    </div>
  )
}

function SidebarNavItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavigationItem
  collapsed: boolean
  onNavigate: () => void
}) {
  const { pathname } = useDashboardNavigation()
  const isActive =
    item.href === '/'
      ? pathname === '/'
      : pathname === item.href || pathname.startsWith(`${item.href}/`)

  return (
    <li>
      <DashboardLink
        href={item.href}
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-normal transition-colors',
          'hover:bg-accent hover:text-foreground',
          isActive
            ? 'bg-accent font-medium text-foreground'
            : 'text-muted-foreground',
          collapsed && 'justify-center px-0',
        )}
        title={collapsed ? item.name : undefined}
      >
        <item.icon className="size-5 shrink-0" />
        {!collapsed && <span>{item.name}</span>}
      </DashboardLink>
    </li>
  )
}

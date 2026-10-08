'use client'

import { useEffect, useRef, useState } from 'react'
import { CloseIcon, CommandIcon, SearchIcon } from './icons'
import { useDashboardNavigation } from './navigation'
import { navigationGroups } from '../dashboard/data'

export function DashboardTopbar() {
  const { pathname } = useDashboardNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  const currentPage =
    navigationGroups
      .flatMap((group) => group.items)
      .find((item) => item.href === pathname) ?? navigationGroups[0].items[0]
  const CurrentPageIcon = currentPage.icon

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true)
    requestAnimationFrame(() => {
      mobileSearchInputRef.current?.focus()
    })
  }

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()

        if (window.matchMedia('(max-width: 767px)').matches) {
          setIsMobileSearchOpen(true)
          requestAnimationFrame(() => {
            mobileSearchInputRef.current?.focus()
          })
          return
        }

        searchInputRef.current?.focus()
      }

      if (event.key === 'Escape') {
        setIsMobileSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="flex h-18 shrink-0 items-center justify-between gap-4 border-b border-border px-5 md:px-6">
      {isMobileSearchOpen ? (
        <div className="flex w-full items-center gap-2 md:hidden">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-secondary py-1 pr-2 pl-3">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input
              ref={mobileSearchInputRef}
              className="h-full flex-1 bg-transparent p-0 px-1.5 text-sm leading-5 tracking-tight placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search bookings"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close search"
            onClick={closeMobileSearch}
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-2">
            <div className="hidden items-end gap-4 md:flex">
              <div className="flex h-6 items-center gap-3">
                <CurrentPageIcon className="size-4 text-muted-foreground" />
                <span className="text-lg leading-6.5 font-medium text-foreground">
                  {currentPage.name}
                </span>
              </div>
              <div className="flex h-6 items-center gap-1">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last synced <span className="text-foreground/80">5 min ago</span>
                </span>
              </div>
            </div>
          </div>

          <div className="hidden h-9 w-69.25 shrink-0 items-center gap-2 rounded-lg bg-secondary py-1 pr-2 pl-2.5 md:flex">
            <SearchIcon className="size-3 text-muted-foreground" />
            <input
              ref={searchInputRef}
              className="h-full flex-1 bg-transparent p-0 px-1 text-xs placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search bookings and guests"
              placeholder="Search bookings, guests..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery === '' && (
              <div className="flex h-6 w-9.5 items-center justify-center gap-1 rounded-md bg-background p-1.5 text-muted-foreground">
                <CommandIcon className="size-3" />
                <span className="text-xs leading-none">K</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Open search"
            onClick={openMobileSearch}
          >
            <SearchIcon className="size-4" />
          </button>
        </>
      )}
    </header>
  )
}

'use client'

import { useState, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ArrowUpRightIcon,
  CaretDownIcon,
  ClockIcon,
  FileDownIcon,
  PlusIcon,
  SlidersIcon,
} from './icons'
import {
  dashboardBookingStatusFilters,
  dashboardTimelineData,
  dashboardTimelineRanges,
  filterDashboardBookings,
} from '../dashboard/data'
import type {
  DashboardBookingStatusFilter,
  DashboardTimelineRange,
} from '../dashboard/data'
import { cn } from '@/lib/utils'

const dashboardColors = {
  scheduled: 'var(--dashboard-scheduled)',
  completed: 'var(--dashboard-completed)',
  noShow: 'var(--dashboard-no-show)',
  secondary: 'var(--dashboard-secondary)',
} as const

const chartSeries = [
  { key: 'confirmed', label: 'Confirmed', color: dashboardColors.scheduled },
  { key: 'completed', label: 'Completed', color: dashboardColors.completed },
  { key: 'noShow', label: 'No-show', color: dashboardColors.noShow },
] as const

const statusClassName: Record<string, string> = {
  CONFIRMED: 'bg-[color-mix(in_oklch,var(--dashboard-scheduled)_14%,transparent)] text-[var(--dashboard-scheduled)]',
  PENDING: 'bg-[color-mix(in_oklch,var(--dashboard-no-show)_14%,transparent)] text-[var(--dashboard-no-show)]',
  COMPLETED: 'bg-[color-mix(in_oklch,var(--dashboard-completed)_14%,transparent)] text-[var(--dashboard-completed)]',
  NO_SHOW: 'bg-[color-mix(in_oklch,var(--dashboard-no-show)_14%,transparent)] text-[var(--dashboard-no-show)]',
  CANCELLED: 'bg-muted text-muted-foreground',
}

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  NO_SHOW: 'No-show',
  CANCELLED: 'Cancelled',
}

function DashboardCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-xl bg-card p-4 text-card-foreground',
        className,
      )}
    >
      {children}
    </section>
  )
}

function CardHeader({
  title,
  action,
  className,
}: {
  title: ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <h2 className="text-lg leading-6 font-medium text-foreground">{title}</h2>
      {action ? (
        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-foreground/80">
          {action}
        </div>
      ) : null}
    </div>
  )
}

function MetricBars({
  lastSixDays,
  className,
}: {
  lastSixDays: readonly number[]
  className: string
}) {
  const maximum = Math.max(...lastSixDays, 1)

  return (
    <div className="flex h-7.5 w-10 shrink-0 items-end justify-between">
      {lastSixDays.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={cn('w-1.25 rounded-t-sm', className)}
          style={{ height: `${(value / maximum) * 100}%` }}
        />
      ))}
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ChartTooltip(props: any) {
  const { active, payload, label } = props
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-sm">
      <p className="mb-2 font-medium">{label}</p>
      <div className="flex flex-col gap-1.5">
        {payload.map((item: any, index: number) => (
          <div
            key={`${String(item.dataKey)}-${index}`}
            className="flex items-center justify-between gap-6"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

type DashboardTimelineData = (typeof dashboardTimelineData)[DashboardTimelineRange]

function BookingVolumeCard({ data }: { data: DashboardTimelineData }) {
  const bookingVolume = [...data.bookingVolume] as { week: string; confirmed: number; completed: number; noShow: number }[]

  return (
    <DashboardCard className="flex flex-col gap-4 pb-0">
      <CardHeader title="Booking Volume" />

      <div className="grid flex-1 gap-6 md:grid-cols-[6.5rem_minmax(0,1fr)]">
        <div className="grid grid-cols-3 gap-4 md:flex md:flex-col md:justify-center md:gap-8">
          {data.bookingStats.map(([value, label]) => (
            <div key={label} className="flex min-w-0 flex-col gap-3">
              <p className="text-[1.75rem] leading-none font-medium text-foreground">
                {value}
              </p>
              <p className="text-sm leading-[1.4] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="min-h-0 min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-end gap-3">
            {chartSeries.map((series) => (
              <div
                key={series.key}
                className="flex items-center gap-2 text-sm font-medium text-foreground/80"
              >
                <span
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: series.color }}
                />
                {series.label}
              </div>
            ))}
          </div>
          <div className="h-68 min-w-md md:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingVolume} barGap={6} barCategoryGap="24%">
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  strokeOpacity={0.65}
                />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 60]}
                  ticks={[0, 15, 30, 45, 60]}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  width={42}
                />
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.35 }}
                  content={(props) => <ChartTooltip {...props} />}
                />
                <Bar dataKey="confirmed" name="Confirmed" fill={dashboardColors.scheduled} radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill={dashboardColors.completed} radius={[4, 4, 0, 0]} />
                <Bar dataKey="noShow" name="No-show" fill={dashboardColors.noShow} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

function HallLoadCard({ data }: { data: DashboardTimelineData }) {
  const hallTotal = data.hallLoad.reduce((total, hall) => total + hall.value, 0)

  return (
    <DashboardCard className="flex flex-col gap-4">
      <CardHeader title="Hall Utilization" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Total Bookings</span>
            <span className="font-semibold text-foreground">{hallTotal}</span>
          </div>
          <div className="flex h-5.75 items-start gap-1 overflow-hidden rounded-md">
            {data.hallLoad.map((hall, index) => (
              <span
                key={hall.label}
                className={cn(
                  'dashboard-load-segment h-full min-w-4 shrink-0 rounded-md',
                  hall.color,
                )}
                style={{
                  '--department-width': `${(hall.value / hallTotal) * 100}%`,
                  animationDelay: `${index * 90}ms`,
                } as CSSProperties}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {data.hallLoad.map((hall) => (
            <div key={hall.label} className="flex min-w-0 items-center gap-3 text-sm">
              <div className="flex min-w-0 shrink-0 items-center gap-2">
                <span className={cn('size-4 rounded-sm', hall.color)} />
                <span className="truncate font-medium text-foreground/80">{hall.label}</span>
              </div>
              <span className="min-w-0 flex-1 border-t border-dashed border-border" />
              <div className="flex shrink-0 items-center gap-2">
                <span className="w-6 text-right font-medium text-foreground/80">{hall.value}</span>
                <span className="w-12 text-right text-muted-foreground">{hall.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}

function BookingsTableCard({
  bookings,
  statusFilter,
  onStatusFilterChange,
}: {
  bookings: ReturnType<typeof filterDashboardBookings>
  statusFilter: DashboardBookingStatusFilter
  onStatusFilterChange: (statusFilter: DashboardBookingStatusFilter) => void
}) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <DashboardCard className="flex flex-col gap-4 px-0 pb-0">
      <CardHeader
        className="px-4"
        title="Today's Bookings"
        action={
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex h-8 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <SlidersIcon className="size-4.5" />
              Filter
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-border bg-popover p-1 shadow-sm">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Status</p>
                {dashboardBookingStatusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      onStatusFilterChange(filter.value)
                      setFilterOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent',
                      statusFilter === filter.value
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-160 table-fixed text-left">
          <thead>
            <tr className="h-12 text-sm font-medium text-muted-foreground">
              <th className="w-[10%] px-4">Time</th>
              <th className="w-[18%] px-4">Hall</th>
              <th className="w-[22%] px-4">Film</th>
              <th className="w-[20%] px-4">Guest</th>
              <th className="w-[10%] px-4">Pax</th>
              <th className="w-[12%] px-4">Amount</th>
              <th className="w-[8%] px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="h-17.5 border-t border-border/60 transition-colors hover:bg-foreground/5"
              >
                <td className="px-4 text-sm font-medium text-foreground">{booking.time}</td>
                <td className="px-4 text-sm text-foreground/90">{booking.hall}</td>
                <td className="truncate px-4 text-sm text-foreground/90">{booking.film}</td>
                <td className="px-4 text-sm font-medium text-foreground">{booking.guest}</td>
                <td className="px-4 text-sm text-foreground/90">{booking.guests}</td>
                <td className="px-4 text-sm font-medium text-foreground">{booking.amount}</td>
                <td className="px-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs leading-5',
                      statusClassName[booking.status] ?? '',
                    )}
                  >
                    {statusLabels[booking.status] ?? booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}

export function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<DashboardTimelineRange>('aug-2026')
  const [bookingStatusFilter, setBookingStatusFilter] = useState<DashboardBookingStatusFilter>('all')
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false)
  const selectedData = dashboardTimelineData[selectedRange]
  const selectedRangeMeta = dashboardTimelineRanges.find((range) => range.value === selectedRange)
  const visibleBookings = filterDashboardBookings(selectedData.bookings, bookingStatusFilter)

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      {/* Header */}
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl leading-[1.4] font-normal text-foreground">
            Good Morning, Shola
          </h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ClockIcon className="size-4" />
            <span>
              {new Date().toLocaleDateString('en-NG', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
              className="flex h-10 items-center gap-2 rounded-lg bg-secondary px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              <ClockIcon className="size-4.5" />
              {selectedRangeMeta?.label}
              <CaretDownIcon className="size-4" />
            </button>
            {rangeDropdownOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-border bg-popover p-1 shadow-sm">
                {dashboardTimelineRanges.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => {
                      setSelectedRange(range.value)
                      setRangeDropdownOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent',
                      selectedRange === range.value
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <PlusIcon className="size-4.5" />
            New Booking
          </button>
        </div>
      </section>

      {/* Metrics */}
      <section className="@container">
        <div className="grid grid-cols-1 gap-3 @min-[36rem]:grid-cols-2 @min-[72rem]:grid-cols-4">
          {selectedData.metrics.map((metric) => (
            <article
              key={metric.label}
              className="flex h-34.5 min-w-0 flex-col justify-between rounded-xl bg-card p-4 text-card-foreground"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm leading-[1.4] font-medium text-muted-foreground">
                  {metric.label}
                </h2>
                <ClockIcon className="size-5 shrink-0 text-foreground" />
              </div>

              <div className="flex items-end gap-1.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[1.75rem] leading-none font-medium text-foreground">
                    {metric.value}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-mono text-muted-foreground">
                    <ArrowUpRightIcon className={cn('size-4', metric.trendColor)} />
                    <span className="text-foreground">{metric.trend.split(' ')[0]}</span>
                    <span>{metric.trend.substring(metric.trend.indexOf(' ') + 1)}</span>
                  </div>
                </div>
                <MetricBars
                  lastSixDays={metric.lastSixDays}
                  className={metric.color}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)]">
        <div className="min-w-0 overflow-x-auto no-scrollbar">
          <BookingVolumeCard key={selectedRange} data={selectedData} />
        </div>
        <HallLoadCard key={selectedRange} data={selectedData} />
      </section>

      {/* Bookings table */}
      <section>
        <BookingsTableCard
          bookings={visibleBookings}
          statusFilter={bookingStatusFilter}
          onStatusFilterChange={setBookingStatusFilter}
        />
      </section>
    </div>
  )
}

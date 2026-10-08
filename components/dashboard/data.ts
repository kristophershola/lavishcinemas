import type { ComponentType, SVGProps } from 'react'

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>

export type NavigationItem = {
  name: string
  href: string
  icon: NavIcon
}

export type NavigationGroup = {
  label: string
  collapsible?: boolean
  items: NavigationItem[]
}

import {
  HomeIcon,
  CalendarIcon,
  FilmIcon,
  UsersIcon,
  ChartIcon,
  SettingsIcon,
} from './icons'

export const navigationGroups: NavigationGroup[] = [
  {
    label: 'Overview',
    collapsible: false,
    items: [{ name: 'Dashboard', href: '/', icon: HomeIcon }],
  },
  {
    label: 'Operations',
    collapsible: false,
    items: [
      { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
      { name: 'Halls', href: '/halls', icon: FilmIcon },
      { name: 'Guests', href: '/guests', icon: UsersIcon },
    ],
  },
  {
    label: 'Insights',
    collapsible: false,
    items: [
      { name: 'Analytics', href: '/analytics', icon: ChartIcon },
    ],
  },
  {
    label: 'Admin',
    collapsible: false,
    items: [
      { name: 'Settings', href: '/settings', icon: SettingsIcon },
    ],
  },
]

export const currentUser = {
  name: 'Shola Admin',
  email: 'admin@lavish.ng',
  initials: 'SA',
}

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED'

export type DashboardBooking = {
  id: string
  time: string
  hall: string
  film: string
  guest: string
  guests: number
  amount: string
  status: BookingStatus
  paymentStatus: string
}

export const dashboardMetrics = [
  {
    label: "Today's Bookings",
    value: '12',
    trend: '3 more than yesterday',
    color: 'bg-[var(--dashboard-scheduled)]',
    trendColor: 'text-[var(--dashboard-completed)]',
    lastSixDays: [8, 10, 12, 9, 11, 7],
  },
  {
    label: 'Revenue Today',
    value: '₦840K',
    trend: '+12% vs last week',
    color: 'bg-[var(--dashboard-completed)]',
    trendColor: 'text-[var(--dashboard-completed)]',
    lastSixDays: [420, 560, 840, 630, 750, 490],
  },
  {
    label: 'Guests Expected',
    value: '47',
    trend: '8 more than yesterday',
    color: 'bg-[var(--dashboard-no-show)]',
    trendColor: 'text-[var(--dashboard-completed)]',
    lastSixDays: [24, 32, 47, 36, 42, 28],
  },
  {
    label: 'Occupancy Rate',
    value: '78%',
    trend: '+5% this week',
    color: 'bg-[var(--dashboard-secondary)]',
    trendColor: 'text-[var(--dashboard-completed)]',
    lastSixDays: [55, 62, 78, 68, 74, 58],
  },
] as const

export const dashboardBookingVolume = [
  { week: 'Week 1', confirmed: 42, completed: 38, noShow: 4 },
  { week: 'Week 2', confirmed: 38, completed: 34, noShow: 4 },
  { week: 'Week 3', confirmed: 45, completed: 41, noShow: 3 },
  { week: 'Week 4', confirmed: 50, completed: 44, noShow: 6 },
] as const

export const dashboardBookingStats = [
  ['175', 'Total this month'],
  ['91%', 'Completion rate'],
  ['17', 'No-shows'],
] as const

export const dashboardHallLoad = [
  {
    label: 'Hall A',
    value: 38,
    percent: '38%',
    progress: 38,
    color: 'bg-[var(--dashboard-scheduled)]',
  },
  {
    label: 'Hall B',
    value: 28,
    percent: '28%',
    progress: 28,
    color: 'bg-[var(--dashboard-secondary)]',
  },
  {
    label: 'Hall C',
    value: 20,
    percent: '20%',
    progress: 20,
    color: 'bg-[var(--dashboard-completed)]',
  },
  {
    label: 'Hall D',
    value: 14,
    percent: '14%',
    progress: 14,
    color: 'bg-[var(--dashboard-no-show)]',
  },
] as const

export type DashboardBookingStatus = BookingStatus

export const dashboardBookings: readonly DashboardBooking[] = [
  {
    id: '1',
    time: '10:00',
    hall: 'Hall A',
    film: 'The Wedding Party',
    guest: 'Adaeze Okonkwo',
    guests: 8,
    amount: '₦120,000',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
  },
  {
    id: '2',
    time: '11:30',
    hall: 'Hall B',
    film: 'Lionheart',
    guest: 'Emeka Nwosu',
    guests: 6,
    amount: '₦95,000',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
  },
  {
    id: '3',
    time: '13:00',
    hall: 'Hall A',
    film: 'King of Boys',
    guest: 'Funke Adebayo',
    guests: 12,
    amount: '₦180,000',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
  },
  {
    id: '4',
    time: '14:30',
    hall: 'Hall C',
    film: 'October 1',
    guest: 'Yemi Alade',
    guests: 4,
    amount: '₦75,000',
    status: 'PENDING',
    paymentStatus: 'PENDING',
  },
  {
    id: '5',
    time: '16:00',
    hall: 'Hall B',
    film: 'Half of a Yellow Sun',
    guest: 'Chioma Ikenna',
    guests: 10,
    amount: '₦150,000',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
  },
  {
    id: '6',
    time: '17:30',
    hall: 'Hall A',
    film: 'The Milkmaid',
    guest: 'Olu Jacobs',
    guests: 6,
    amount: '₦95,000',
    status: 'NO_SHOW',
    paymentStatus: 'PAID',
  },
] as const

export const dashboardBookingStatusFilters = [
  { value: 'all', label: 'All statuses' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'NO_SHOW', label: 'No-show' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const

export type DashboardBookingStatusFilter =
  (typeof dashboardBookingStatusFilters)[number]['value']

export function filterDashboardBookings(
  bookings: readonly DashboardBooking[],
  statusFilter: DashboardBookingStatusFilter,
) {
  if (statusFilter === 'all') return [...bookings]
  return bookings.filter((booking) => booking.status === statusFilter)
}

export const dashboardTimelineRanges = [
  { value: 'aug-2026', label: 'Aug 1 - 14, 2026' },
  { value: 'jul-2026', label: 'Jul 1 - 31, 2026' },
  { value: 'jun-2026', label: 'Jun 1 - 30, 2026' },
  { value: 'may-2026', label: 'May 1 - 31, 2026' },
] as const

export type DashboardTimelineRange = (typeof dashboardTimelineRanges)[number]['value']

export const dashboardTimelineData = {
  'aug-2026': {
    metrics: dashboardMetrics,
    bookingVolume: dashboardBookingVolume,
    bookingStats: dashboardBookingStats,
    hallLoad: dashboardHallLoad,
    bookings: dashboardBookings,
  },
  'jul-2026': {
    metrics: dashboardMetrics,
    bookingVolume: [
      { week: 'Week 1', confirmed: 40, completed: 36, noShow: 4 },
      { week: 'Week 2', confirmed: 44, completed: 40, noShow: 4 },
      { week: 'Week 3', confirmed: 38, completed: 35, noShow: 3 },
      { week: 'Week 4', confirmed: 46, completed: 42, noShow: 4 },
    ],
    bookingStats: [
      ['168', 'Total this month'],
      ['90%', 'Completion rate'],
      ['15', 'No-shows'],
    ],
    hallLoad: dashboardHallLoad,
    bookings: dashboardBookings,
  },
  'jun-2026': {
    metrics: [
      {
        label: "Today's Bookings",
        value: '9',
        trend: '2 fewer than yesterday',
        color: 'bg-[var(--dashboard-scheduled)]',
        trendColor: 'text-[var(--dashboard-no-show)]',
        lastSixDays: [6, 9, 7, 11, 8, 5],
      },
      {
        label: 'Revenue Today',
        value: '₦620K',
        trend: '-8% vs last week',
        color: 'bg-[var(--dashboard-completed)]',
        trendColor: 'text-[var(--dashboard-no-show)]',
        lastSixDays: [310, 420, 620, 480, 560, 380],
      },
      {
        label: 'Guests Expected',
        value: '34',
        trend: '5 fewer than yesterday',
        color: 'bg-[var(--dashboard-no-show)]',
        trendColor: 'text-[var(--dashboard-no-show)]',
        lastSixDays: [18, 26, 34, 28, 32, 22],
      },
      {
        label: 'Occupancy Rate',
        value: '65%',
        trend: '-3% this week',
        color: 'bg-[var(--dashboard-secondary)]',
        trendColor: 'text-[var(--dashboard-no-show)]',
        lastSixDays: [45, 55, 65, 58, 62, 48],
      },
    ],
    bookingVolume: [
      { week: 'Week 1', confirmed: 35, completed: 30, noShow: 5 },
      { week: 'Week 2', confirmed: 38, completed: 33, noShow: 5 },
      { week: 'Week 3', confirmed: 32, completed: 28, noShow: 4 },
      { week: 'Week 4', confirmed: 40, completed: 35, noShow: 5 },
    ],
    bookingStats: [
      ['145', 'Total this month'],
      ['88%', 'Completion rate'],
      ['19', 'No-shows'],
    ],
    hallLoad: dashboardHallLoad,
    bookings: dashboardBookings,
  },
  'may-2026': {
    metrics: [
      {
        label: "Today's Bookings",
        value: '14',
        trend: '4 more than yesterday',
        color: 'bg-[var(--dashboard-scheduled)]',
        trendColor: 'text-[var(--dashboard-completed)]',
        lastSixDays: [10, 14, 12, 16, 13, 9],
      },
      {
        label: 'Revenue Today',
        value: '₦980K',
        trend: '+18% vs last week',
        color: 'bg-[var(--dashboard-completed)]',
        trendColor: 'text-[var(--dashboard-completed)]',
        lastSixDays: [520, 680, 980, 750, 860, 590],
      },
      {
        label: 'Guests Expected',
        value: '52',
        trend: '10 more than yesterday',
        color: 'bg-[var(--dashboard-no-show)]',
        trendColor: 'text-[var(--dashboard-completed)]',
        lastSixDays: [30, 38, 52, 42, 48, 34],
      },
      {
        label: 'Occupancy Rate',
        value: '85%',
        trend: '+8% this week',
        color: 'bg-[var(--dashboard-secondary)]',
        trendColor: 'text-[var(--dashboard-completed)]',
        lastSixDays: [62, 70, 85, 75, 80, 65],
      },
    ],
    bookingVolume: [
      { week: 'Week 1', confirmed: 48, completed: 44, noShow: 4 },
      { week: 'Week 2', confirmed: 52, completed: 48, noShow: 4 },
      { week: 'Week 3', confirmed: 45, completed: 42, noShow: 3 },
      { week: 'Week 4', confirmed: 55, completed: 50, noShow: 5 },
    ],
    bookingStats: [
      ['200', 'Total this month'],
      ['93%', 'Completion rate'],
      ['16', 'No-shows'],
    ],
    hallLoad: dashboardHallLoad,
    bookings: dashboardBookings,
  },
} as const

import type { SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function LavishLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={cn('size-8', className)}
      {...props}
    >
      <rect width="40" height="40" rx="8" fill="var(--gold)" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fill="var(--black)"
        fontFamily="var(--font-bebas), sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="0.05em"
      >
        L
      </text>
    </svg>
  )
}

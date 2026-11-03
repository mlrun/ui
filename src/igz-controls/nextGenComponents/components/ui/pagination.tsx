import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import { cn } from '../../lib/utils'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

function PaginationContent({ className, ref, ...props }: React.ComponentProps<'ul'>) {
  return <ul ref={ref} className={cn('flex flex-row items-center gap-2', className)} {...props} />
}
PaginationContent.displayName = 'PaginationContent'

function PaginationItem({ className, ref, ...props }: React.ComponentProps<'li'>) {
  return <li ref={ref} className={cn('', className)} {...props} />
}
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  disabled,
  children,
  ref,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      data-testid="pagination-link"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded no-underline transition-colors',
        'text-[#4B4760] text-[15px] font-normal',
        'hover:font-semibold',
        isActive && 'text-[#869CFF] font-bold',
        disabled && 'opacity-30 pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
PaginationLink.displayName = 'PaginationLink'

function PaginationPrevious({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      ref={ref}
      data-testid="pagination-prev"
      aria-label="Go to previous page"
      className={className}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

function PaginationNext({ className, ref, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      ref={ref}
      data-testid="pagination-next"
      aria-label="Go to next page"
      className={className}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    aria-label="More pages"
    className={cn('flex h-9 w-9 items-center justify-center text-[#4B4760]/70', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
}

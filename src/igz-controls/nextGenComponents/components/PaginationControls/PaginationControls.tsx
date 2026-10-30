import { ChevronsLeft, ChevronsRight } from 'lucide-react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { cn } from '../../lib/utils'

export type PaginationConfig = {
  currentPage: number
  totalPages: number
  currentBatch: number
  hasPrevBatch: boolean
  hasNextBatch: boolean
  batchSize: number
  onPageChange: (page: number) => void
  onPrevBatch: () => void
  onNextBatch: () => void
}

export type PaginationControlsProps = PaginationConfig & {
  className?: string
}

const PaginationControls = ({
  currentPage,
  totalPages,
  currentBatch,
  hasPrevBatch,
  hasNextBatch,
  batchSize,
  onPageChange,
  onPrevBatch,
  onNextBatch,
  className
}: PaginationControlsProps) => {
  const canPrevPage = currentPage > 1
  const canNextPage = currentPage < totalPages

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  const pageOffset = (currentBatch - 1) * batchSize

  const disabledCls = 'pointer-events-none opacity-30'

  const prevBatchStart = (currentBatch - 2) * batchSize + 1
  const prevBatchEnd = (currentBatch - 1) * batchSize
  const nextBatchStart = currentBatch * batchSize + 1
  const nextBatchEnd = (currentBatch + 1) * batchSize

  return (
    <TooltipProvider>
      <div
        className={cn('flex items-center justify-center gap-4 pt-2', className)}
        data-testid="pagination-controls"
      >
        <Pagination>
          <PaginationContent>
            {/* Previous Batch Arrow */}
            <PaginationItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PaginationLink
                    href="#"
                    aria-disabled={!hasPrevBatch}
                    className={cn(!hasPrevBatch && disabledCls)}
                    onClick={e => {
                      e.preventDefault()
                      if (hasPrevBatch) onPrevBatch()
                    }}
                    data-testid="pagination-prev-batch"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>
                  {hasPrevBatch
                    ? `Previous pages ${prevBatchStart}-${prevBatchEnd}`
                    : 'No previous pages'}
                </TooltipContent>
              </Tooltip>
            </PaginationItem>

            <PaginationItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={!canPrevPage}
                    className={cn(!canPrevPage && disabledCls)}
                    onClick={e => {
                      e.preventDefault()
                      if (canPrevPage) onPageChange(currentPage - 1)
                    }}
                    data-testid="pagination-prev-page"
                  />
                </TooltipTrigger>
                <TooltipContent>Previous page</TooltipContent>
              </Tooltip>
            </PaginationItem>

            {pageNumbers.map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={e => {
                    e.preventDefault()
                    onPageChange(page)
                  }}
                  data-testid={`pagination-page-${page + pageOffset}`}
                >
                  {page + pageOffset}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PaginationNext
                    href="#"
                    aria-disabled={!canNextPage}
                    className={cn(!canNextPage && disabledCls)}
                    onClick={e => {
                      e.preventDefault()
                      if (canNextPage) onPageChange(currentPage + 1)
                    }}
                    data-testid="pagination-next-page"
                  />
                </TooltipTrigger>
                <TooltipContent>Next page</TooltipContent>
              </Tooltip>
            </PaginationItem>

            <PaginationItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PaginationLink
                    href="#"
                    aria-disabled={!hasNextBatch}
                    className={cn(!hasNextBatch && disabledCls)}
                    onClick={e => {
                      e.preventDefault()
                      if (hasNextBatch) onNextBatch()
                    }}
                    data-testid="pagination-next-batch"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </PaginationLink>
                </TooltipTrigger>
                <TooltipContent>
                  {hasNextBatch ? `Next pages ${nextBatchStart}-${nextBatchEnd}` : 'No more pages'}
                </TooltipContent>
              </Tooltip>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </TooltipProvider>
  )
}

export default PaginationControls

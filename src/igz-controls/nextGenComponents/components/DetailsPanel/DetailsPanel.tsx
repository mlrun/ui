import { ComponentType, ReactNode, useMemo } from 'react'

import Close from '../../../images/close.svg?react'
import EllipsisTooltip from '../EllipsisTooltip/EllipsisTooltip'
import { Button } from '../ui/button'
import { DETAILS_FALLBACK_TITLE } from '../../constants'

type DetailsPanelProps<TData extends object> = {
  row: TData
  content: ComponentType<TData>
  titleAccessorKey?: keyof TData
  titleAccessorFn?: (row: TData) => string | ReactNode
  onClose: () => void
}

const DetailsPanel = <TData extends object>({
  row,
  content: Content,
  titleAccessorKey,
  titleAccessorFn,
  onClose
}: DetailsPanelProps<TData>) => {
  const title = useMemo((): string | ReactNode => {
    if (titleAccessorFn) {
      return titleAccessorFn(row)
    }
    if (titleAccessorKey && row[titleAccessorKey]) {
      return String(row[titleAccessorKey])
    }
    return DETAILS_FALLBACK_TITLE
  }, [row, titleAccessorFn, titleAccessorKey])

  return (
    <aside
      data-testid="details-panel"
      className="absolute rounded-r-lg flex flex-col inset-y-0 right-0 w-[calc(100%-250px)] border border-[#e6e6e6] bg-white z-30"
      style={{ boxShadow: '-4px 0 6px -4px rgba(0,0,0,0.15)' }}
    >
      <div
        className="flex items-center justify-between gap-3 px-6 pr-10 py-4"
        data-testid="details-panel-title"
      >
        {typeof title === 'string' ? (
          <EllipsisTooltip className="min-w-0 text-[24px] font-extrabold leading-tight text-[#3a3650]">
            {title}
          </EllipsisTooltip>
        ) : (
          title
        )}
        <Button
          variant="rounded"
          size="icon"
          onClick={onClose}
          className="absolute top-3.5 right-3"
          aria-label="Close"
          tooltip="Close"
          data-testid="details-panel-close-button"
        >
          <Close className="w-6 h-6" />
        </Button>
      </div>

      <div className="overflow-auto h-full px-6 py-4" data-testid="details-panel-content">
        <Content {...row} />
      </div>
    </aside>
  )
}

export default DetailsPanel

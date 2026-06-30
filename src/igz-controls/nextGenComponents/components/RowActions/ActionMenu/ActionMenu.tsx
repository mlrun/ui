import { EllipsisVertical } from 'lucide-react'
import { FC } from 'react'

import { Button } from '@igz-controls/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@igz-controls/components/ui/dropdown-menu'
import { MORE_ACTIONS } from '@igz-controls/constants'
import { ActionMenuItem } from '@igz-controls/types/table/rowAction'

type ActionMenuProps = {
  items: ActionMenuItem[]
}
const ActionMenu: FC<ActionMenuProps> = ({ items }) => {
  const visibleItems = items.filter(item => !item.hidden)
  if (!visibleItems.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="rounded"
          size="icon"
          tooltip={MORE_ACTIONS}
          onClick={e => e.stopPropagation()}
          data-testid="action-menu-trigger"
          className="
      transition-opacity
      opacity-0 group-hover:opacity-100
      data-[state=open]:opacity-100
    data-[state=open]:bg-igz-gray-light
    "
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border border-igz-gray-light shadow-md rounded-md"
        onClick={e => e.stopPropagation()}
      >
        {visibleItems.map(item => {
          const ItemIcon = item.icon
          const baseClasses = 'flex cursor-pointer items-center justify-between px-2 py-2 text-15px'
          const variantClasses =
            item.variant === 'danger' ? 'text-red-600 focus:text-red-600' : 'text-igz-primary'
          const mergedClasses = [baseClasses, variantClasses, item.className]
            .filter(Boolean)
            .join(' ')

          return (
            <DropdownMenuItem
              key={item.label}
              className={mergedClasses}
              disabled={item.disabled}
              onClick={event => {
                event.stopPropagation()
                if (!item.disabled) item.onClick()
              }}
              data-testid={`action-menu-item-${item.label}`}
            >
              <div className="flex items-center gap-2">
                {ItemIcon && <ItemIcon className="h-4 w-4" />}
                <span>{item.label}</span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionMenu

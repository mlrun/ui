import { ComponentType, FC, SVGProps } from 'react'

import { Button } from '@igz-controls/components/ui/button'

type SingleActionButtonProps = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  onClick: () => void
  tooltip?: string
}

const SingleActionButton: FC<SingleActionButtonProps> = ({ icon: Icon, onClick, tooltip }) => (
  <Button
    type="button"
    variant="rounded"
    size="icon"
    tooltip={tooltip}
    data-testid="single-action-button"
    className="
      flex h-8 w-8 min-w-0 items-center justify-center p-0
      rounded-full hover:bg-igz-gray-light
      transition-opacity
      opacity-0 group-hover:opacity-100
      ml-auto
    "
    onClick={e => {
      e.stopPropagation()
      onClick()
    }}
  >
    {Icon && <Icon className="h-5 w-5 text-igz-secondary" />}
  </Button>
)

export default SingleActionButton

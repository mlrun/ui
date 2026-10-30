import Refresh from '../../../images/refresh-2.svg?react'
import { Button } from '../ui/button'
import { REFRESH_BUTTON_TITLE } from '../../constants'

const RefreshButton = ({ onClick }: { onClick?: () => void }) => (
  <Button
    onClick={onClick}
    title={REFRESH_BUTTON_TITLE}
    tooltip={REFRESH_BUTTON_TITLE}
    variant="rounded"
    size="icon"
    data-testid="entity-table-refresh-button"
  >
    <Refresh />
  </Button>
)

export default RefreshButton

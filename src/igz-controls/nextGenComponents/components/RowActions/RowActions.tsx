import { FC } from 'react'

import { ActionMenuItem } from '@igz-controls/types/table/rowAction'

import ActionMenu from './ActionMenu/ActionMenu'
import SingleActionButton from './SingleActionButton/SingleActionButton'

type RowActionsProps = {
  actions: ActionMenuItem[]
}

const RowActions: FC<RowActionsProps> = ({ actions }) => {
  const visible = actions.filter(a => !a.hidden)
  const enabled = visible.filter(a => !a.disabled)

  if (actions[0]?.singleActionAsIcon && enabled.length === 1) {
    return (
      <SingleActionButton
        icon={enabled[0].icon}
        onClick={enabled[0].onClick}
        tooltip={enabled[0].tooltip}
      />
    )
  }

  return <ActionMenu items={actions} />
}

export default RowActions

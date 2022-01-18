import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import classnames from 'classnames'

import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'
import ActionsMenu from '../../../common/ActionsMenu/ActionsMenu'
import { ACTIONS_MENU } from '../../../types'

const FeatureSetsPanelTableRow = ({
  actionButton,
  actionsMenu,
  className,
  contentItem
}) => {
  const rowClassNames = classnames('table__row', className)

  return (
    <div className={rowClassNames}>
      {map(contentItem.data, (value, property) => {
        return (
          <div className="table__cell" key={property}>
            <Tooltip template={<TextTooltipTemplate text={value} />}>
              {value}
            </Tooltip>
          </div>
        )
      })}
      <div className="table__cell table__cell-actions">
        {actionsMenu.length > 0 ? (
          <ActionsMenu menu={actionsMenu} dataItem={contentItem} />
        ) : (
          actionButton && (
            <Tooltip
              template={<TextTooltipTemplate text={actionButton.label} />}
            >
              <button
                className={actionButton.className}
                onClick={() => actionButton.onClick(contentItem)}
              >
                {actionButton.icon}
              </button>
            </Tooltip>
          )
        )}
      </div>
    </div>
  )
}

FeatureSetsPanelTableRow.defaultProps = {
  actionButton: null,
  actionsMenu: [],
  className: ''
}

FeatureSetsPanelTableRow.propTypes = {
  actionButton: PropTypes.shape({
    className: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  actionsMenu: ACTIONS_MENU,
  className: PropTypes.string,
  contentItem: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelTableRow

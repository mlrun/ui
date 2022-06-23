import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

const TableHead = React.forwardRef(({ content }, ref) => {
  return (
    <div className="table-head" ref={ref}>
      {content.map((tableItem, index) =>
        tableItem.type !== 'hidden' && !tableItem.hidden ? (
          <div
            className={`table-head__item ${tableItem.class}`}
            key={`${tableItem.header}${index}`}
          >
            <Tooltip template={<TextTooltipTemplate text={tableItem.header} />}>
              {tableItem.header}
            </Tooltip>
          </div>
        ) : null
      )}
      <div className="table-body__cell action_cell" />
    </div>
  )
})

TableHead.propTypes = {
  content: PropTypes.array.isRequired
}

export default TableHead

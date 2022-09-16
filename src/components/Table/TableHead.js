/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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

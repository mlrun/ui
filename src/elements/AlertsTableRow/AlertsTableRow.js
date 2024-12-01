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
import { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'

import TableCell from '../TableCell/TableCell'

import { DETAILS_OVERVIEW_TAB } from '../../constants'

// TODO:   rowIsExpanded logic will be part of ML-8516
// TODO:  selected row logic will be part of ML-8104
const AlertsTableRow = ({ handleExpandRow, handleSelectItem, rowItem, selectedItem }) => {
  const parent = useRef()
  const params = useParams()

  const rowClassNames = classnames('table-row', 'table-body-row', 'parent-row')

  return (
    <tr className={rowClassNames} ref={parent}>
      <>
        {rowItem.content.map((value, index) => {
          return (
            !value.hidden && (
              <TableCell
                data={value}
                firstCell={index === 0}
                handleExpandRow={handleExpandRow}
                item={rowItem.data}
                key={value.id}
                link={value.getLink?.(
                  rowItem.data.tag,
                  params.tab ?? DETAILS_OVERVIEW_TAB,
                  rowItem.data.hash
                )}
                selectedItem={selectedItem}
                selectItem={handleSelectItem}
                showExpandButton={value.showExpandButton}
              />
            )
          )
        })}
      </>
    </tr>
  )
}

AlertsTableRow.propTypes = {
  handleSelectItem: PropTypes.func.isRequired,
  mainRowItemsCount: PropTypes.number,
  rowIndex: PropTypes.number.isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default AlertsTableRow

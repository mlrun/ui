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
import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'

import DetailsAlertsMetrics from '../../components/DetailsDrillDownAlert/DetailsAlertsMetrics'
import TableCell from '../TableCell/TableCell'

import { ALERTS_PAGE, DETAILS_OVERVIEW_TAB } from '../../constants'
import { getIdentifierMethod } from '../../utils/getUniqueIdentifier'

import './AlertsTableRow.scss'

const AlertsTableRow = ({
  className,
  isRowSelected,
  filters,
  rowItem,
  selectedItem,
  toggleRow
}) => {
  const parent = useRef()
  const params = useParams()
  const getIdentifier = useMemo(() => getIdentifierMethod(ALERTS_PAGE), [])
  const rowClassNames = classnames(
    'alert-row',
    'table-row',
    'table-body-row',
    'parent-row',
    selectedItem?.name &&
      getIdentifier(selectedItem, true) === rowItem?.data?.ui?.identifierUnique &&
      'table-row_active'
  )
  return (
    <>
      <tr className={rowClassNames} ref={parent}>
        {rowItem.content.map(
          (value, index) =>
            !value.hidden && (
              <React.Fragment key={value.id}>
                <TableCell
                  data={value}
                  className={className}
                  firstCell={index === 0}
                  item={rowItem.data}
                  link={value.getLink?.(
                    rowItem.data.tag,
                    params.tab ?? DETAILS_OVERVIEW_TAB,
                    rowItem.data.hash
                  )}
                  selectedItem={selectedItem}
                  showExpandButton={value.showExpandButton}
                  toggleRow={toggleRow}
                />
              </React.Fragment>
            )
        )}
      </tr>
      {isRowSelected && (
        <tr className="alert-row__expanded-row">
          <td>
            <DetailsAlertsMetrics
              filters={filters}
              isAlertsPage={false}
              selectedItem={selectedItem}
            />
          </td>
        </tr>
      )}
    </>
  )
}

AlertsTableRow.propTypes = {
  className: PropTypes.string,
  handleSelectItem: PropTypes.func.isRequired,
  isRowSelected: PropTypes.bool,
  mainRowItemsCount: PropTypes.number,
  rowIndex: PropTypes.number.isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default AlertsTableRow

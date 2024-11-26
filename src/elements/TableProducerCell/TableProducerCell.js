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
import classnames from 'classnames'

import JobPopUp from '../DetailsPopUp/JobPopUp/JobPopUp'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { openPopUp } from 'igz-controls/utils/common.util'

const TableProducerCell = ({
  bodyCellClassName = '',
  className = '',
  id,
  producer
}) => {
  const [project, uidWithIter] = producer.uri?.split('/') || []
  const cellClassNames = classnames('table-body__cell', className, bodyCellClassName)

  const handleOpenProducerDetails = () => {
    const [uid, iter] = uidWithIter.split('-')
    const jobData = {
      project,
      uid,
      iter
    }

    openPopUp(JobPopUp, { jobData })
  }

  return (
    producer && (
      <td data-testid={id} className={cellClassNames}>
        {producer?.name && uidWithIter && (
          <div className="data-ellipsis">
            <div className="link" onClick={() => handleOpenProducerDetails()}>
              <Tooltip
                template={
                  <ProducerTooltipTemplate
                    kind={producer.kind}
                    owner={producer.owner ? producer.owner : ''}
                  />
                }
                textShow
              >
                {producer.name}
              </Tooltip>
            </div>
          </div>
        )}
        {producer?.name && !uidWithIter && (
          <Tooltip template={<TextTooltipTemplate text={producer.name} />}>{producer.name}</Tooltip>
        )}
      </td>
    )
  )
}

TableProducerCell.propTypes = {
  bodyCellClassName: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  producer: PropTypes.shape({}).isRequired
}

export default TableProducerCell

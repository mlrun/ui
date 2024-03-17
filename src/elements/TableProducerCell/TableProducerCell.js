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
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getJobsDetailsMenu } from '../../components/Jobs/jobs.util'

import { DETAILS_OVERVIEW_TAB, MONITOR_JOBS_TAB } from '../../constants'

const TableProducerCell = ({ bodyCellClassName, className, id, producer }) => {
  const [project, uid] = producer.uri?.split('/') || []
  const overviewTab = getJobsDetailsMenu().find(tab => tab.id === DETAILS_OVERVIEW_TAB) || {}
  const cellClassNames = classnames('table-body__cell', className, bodyCellClassName)

  return (
    producer && (
      <td data-testid={id} className={cellClassNames}>
        {producer?.name && uid && (
          <Link
            className="data-ellipsis"
            to={`/projects/${project}/jobs/${MONITOR_JOBS_TAB}/${producer.name}/${
              uid.split('-')[0]
            }/${overviewTab.id}`}
          >
            <div className="link">
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
          </Link>
        )}
        {producer?.name && !uid && (
          <Tooltip template={<TextTooltipTemplate text={producer.name} />}>{producer.name}</Tooltip>
        )}
      </td>
    )
  )
}

TableProducerCell.defaultProps = {
  bodyCellClassName: '',
  className: ''
}

TableProducerCell.propTypes = {
  bodyCellClassName: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  producer: PropTypes.shape({}).isRequired
}

export default TableProducerCell

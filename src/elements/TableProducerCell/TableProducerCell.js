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

import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'
import { Tooltip } from 'igz-controls/components'

import { getJobsDetailsMenu } from '../../components/Jobs/jobs.util'

import { DETAILS_OVERVIEW_TAB, MONITOR_JOBS_TAB } from '../../constants'

const TableProducerCell = ({ data }) => {
  const [project, uid] = data.value.uri?.split('/') || []
  const { name } = data.value
  const overviewTab = getJobsDetailsMenu().find(tab => tab.id === DETAILS_OVERVIEW_TAB) || {}

  return (
    <td className={`table-body__cell ${data.class}`}>
      {data.value.name && uid && (
        <Link
          className="data-ellipsis"
          to={`/projects/${project}/jobs/${MONITOR_JOBS_TAB}/${name}/${uid.split('-')[0]}/${
            overviewTab.id
          }`}
        >
          <div className="link">
            <Tooltip
              template={
                <ProducerTooltipTemplate
                  kind={data.value.kind}
                  owner={data.value.owner ? data.value.owner : ''}
                />
              }
            >
              {data.value.name}
            </Tooltip>
          </div>
        </Link>
      )}
    </td>
  )
}

TableProducerCell.propTypes = {
  data: PropTypes.shape({}).isRequired
}

export default TableProducerCell

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

import { DETAILS_OVERVIEW_TAB, MONITOR_JOBS_TAB } from '../../constants'
import { detailsMenu } from '../../components/Jobs/jobs.util'

const TableProducerCell = ({ className, data }) => {
  const [project, uid] = data.value.uri?.split('/') || []
  const { name } = data.value
  const overviewTab = detailsMenu.find(tab => tab.id === DETAILS_OVERVIEW_TAB) || {}

  return (
    <div className={`table-body__cell ${data.class}`}>
      {data.value.name && uid && (
        <Tooltip
          template={
            <ProducerTooltipTemplate
              kind={data.value.kind}
              owner={data.value.owner ? data.value.owner : ''}
            />
          }
        >
          <Link
            className="link"
            to={`/projects/${project}/jobs/${MONITOR_JOBS_TAB}/${name}/${uid.split('-')[0]}/${
              overviewTab.id
            }`}
          >
            {data.value.name}
          </Link>
        </Tooltip>
      )}
    </div>
  )
}

TableProducerCell.defaultProps = {
  className: ''
}

TableProducerCell.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape({}).isRequired
}

export default TableProducerCell

import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'

import { DETAILS_OVERVIEW_TAB, MONITOR_JOBS_TAB } from '../../constants'
import { detailsMenu } from '../../components/Jobs/jobs.util'

const TableProducerCell = ({ data }) => {
  const [project, uid] = data.value.uri?.split('/') || []
  const { name } = data.value
  const overviewTab =
    detailsMenu.find(tab => tab.id === DETAILS_OVERVIEW_TAB) || {}

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
            to={`/projects/${project}/jobs/${MONITOR_JOBS_TAB}/${name}/${
              uid.split('-')[0]
            }/${overviewTab.id}`}
          >
            {data.value.name}
          </Link>
        </Tooltip>
      )}
    </div>
  )
}

TableProducerCell.propTypes = {
  data: PropTypes.shape({}).isRequired
}

export default TableProducerCell

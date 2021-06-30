import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'

import { detailsMenu } from '../../components/JobsPage/jobsData'

const TableProducerCell = ({ data }) => {
  const [project, uid] = data.value.uri?.split('/') || []
  const [overviewTab] = detailsMenu || []

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
            to={`/projects/${project}/jobs/monitor/${
              uid.split('-')[0]
            }/${overviewTab}`}
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

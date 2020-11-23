import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'

import { detailsMenu } from '../../components/JobsPage/jobsData'

const TableProducerCell = ({ data, match }) => {
  return (
    <div className={`table-body__cell ${data.class}`}>
      {data.value.uri && (
        <Tooltip
          template={
            <ProducerTooltipTemplate
              kind={data.value.kind}
              owner={data.value.owner ? data.value.owner : ''}
            />
          }
        >
          <Link
            to={`/projects/${match.params.projectName}/jobs/monitor/${data.value
              .uri && data.value.uri.split('/')[1]}/${detailsMenu[0]}`}
          >
            {data.value.name}
          </Link>
        </Tooltip>
      )}
    </div>
  )
}

TableProducerCell.propTypes = {
  data: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default TableProducerCell

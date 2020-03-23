import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import nuclioIcon from '../../images/nuclio.png'
import sparkIcon from '../../images/spark.png'
import horovodIcon from '../../images/horovod.png'

const TableTypeCell = ({ data }) => {
  return (
    <div className={`table-body__cell ${data.size}`}>
      <Tooltip
        template={
          <TextTooltipTemplate
            text={data.value === 'mpijob' ? 'Horovod' : data.value}
          />
        }
      >
        {data.value === 'job' || data.value === '' ? (
          'Local'
        ) : data.value === 'dask' ? (
          'Dask'
        ) : (
          <img
            src={
              data.type === 'nuclio'
                ? nuclioIcon
                : data.type === 'spark'
                ? sparkIcon
                : horovodIcon
            }
            alt="Type"
          />
        )}
      </Tooltip>
    </div>
  )
}

TableTypeCell.propTypes = {
  data: PropTypes.shape({}).isRequired
}

export default TableTypeCell

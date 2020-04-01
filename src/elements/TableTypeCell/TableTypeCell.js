import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Nuclio } from '../../images/nuclio.svg'
import { ReactComponent as Spark } from '../../images/spark.svg'
import { ReactComponent as Horovod } from '../../images/horovod.svg'

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
        ) : data.type === 'nuclio' ? (
          <Nuclio />
        ) : data.type === 'spark' ? (
          <Spark />
        ) : (
          <Horovod />
        )}
      </Tooltip>
    </div>
  )
}

TableTypeCell.propTypes = {
  data: PropTypes.shape({}).isRequired
}

export default TableTypeCell

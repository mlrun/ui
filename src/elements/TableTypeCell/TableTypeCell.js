import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Code } from '../../images/code.svg'
import { ReactComponent as Horovod } from '../../images/horovod.svg'
import { ReactComponent as Jupyter } from '../../images/jupyter.svg'
import { ReactComponent as Nuclio } from '../../images/nuclio.svg'
import { ReactComponent as Package } from '../../images/package.svg'
import { ReactComponent as Spark } from '../../images/spark.svg'

const TableTypeCell = ({ data }) => {
  const typesOfJob = {
    '': { label: 'Local', icon: <Code /> },
    dask: { label: 'Dask', icon: null },
    handler: { label: 'Handler', icon: <Jupyter /> },
    job: { label: 'Job', icon: <Package /> },
    mpijob: { label: 'Horovod', icon: <Horovod /> },
    nuclio: { label: 'Nuclio', icon: <Nuclio /> },
    spark: { label: 'Spark', icon: <Spark /> }
  }

  return (
    <div className={`table-body__cell ${data.class}`}>
      <Tooltip
        className="table-body__cell_type"
        template={<TextTooltipTemplate text={typesOfJob[data.value].label} />}
      >
        {typesOfJob[data.value].icon}
      </Tooltip>
    </div>
  )
}

TableTypeCell.propTypes = {
  data: PropTypes.shape({}).isRequired
}

export default TableTypeCell

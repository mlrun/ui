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
import { capitalize } from 'lodash'
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Application } from 'igz-controls/images/application-icon.svg'
import { ReactComponent as Serving } from 'igz-controls/images/serving-icon.svg'

import { ReactComponent as Code } from 'igz-controls/images/code.svg'
import { ReactComponent as DatabricksIcon } from 'igz-controls/images/databricks-icon.svg'
import { ReactComponent as Horovod } from 'igz-controls/images/horovod.svg'
import { ReactComponent as Jupyter } from 'igz-controls/images/jupyter.svg'
import { ReactComponent as Nuclio } from 'igz-controls/images/nuclio.svg'
import { ReactComponent as Package } from 'igz-controls/images/package.svg'
import { ReactComponent as Remote } from 'igz-controls/images/ic_remote.svg'
import { ReactComponent as Spark } from 'igz-controls/images/spark.svg'
import { ReactComponent as Workflow } from 'igz-controls/images/workflow-icon.svg'
import {
  FUNCTION_TYPE_APPLICATION,
  JOB_KIND_DASK,
  JOB_KIND_DATABRICKS,
  JOB_KIND_HANDLER,
  JOB_KIND_MPIJOB,
  JOB_KIND_JOB,
  JOB_KIND_LOCAL,
  JOB_KIND_REMOTE,
  JOB_KIND_NUCLIO,
  JOB_KIND_SERVING,
  JOB_KIND_SPARK,
  JOB_KIND_WORKFLOW
} from '../../constants'

const TableTypeCell = ({ className = '', data }) => {
  const typesOfJob = {
    '': { label: 'Local', icon: <Code /> },
    [FUNCTION_TYPE_APPLICATION]: { label: 'Application', icon: <Application /> },
    [JOB_KIND_DASK]: { label: 'Dask', icon: null },
    [JOB_KIND_DATABRICKS]: { label: 'Databricks', icon: <DatabricksIcon /> },
    [JOB_KIND_HANDLER]: { label: 'Handler', icon: <Jupyter /> },
    [JOB_KIND_JOB]: { label: 'Job', icon: <Package /> },
    [JOB_KIND_LOCAL]: { label: 'Local', icon: <Code /> },
    [JOB_KIND_MPIJOB]: { label: 'Horovod', icon: <Horovod /> },
    [JOB_KIND_NUCLIO]: { label: 'Nuclio', icon: <Nuclio /> },
    [JOB_KIND_REMOTE]: { label: 'Remote', icon: <Remote /> },
    [JOB_KIND_SERVING]: { label: 'Serving', icon: <Serving /> },
    [JOB_KIND_SPARK]: { label: 'Spark', icon: <Spark /> },
    [JOB_KIND_WORKFLOW]: { label: 'Workflow', icon: <Workflow /> }
  }
  const cellClassNames = classnames(
    'table-body__cell',
    data.className,
    data.bodyCellClassName,
    className
  )

  return (
    <td data-testid={data.headerId} className={cellClassNames}>
      <Tooltip
        className="table-body__cell_type"
        template={
          <TextTooltipTemplate text={typesOfJob[data.value]?.label ?? capitalize(data.value)} />
        }
      >
        {typesOfJob[data.value]?.icon ?? capitalize(data.value)}
      </Tooltip>
    </td>
  )
}

TableTypeCell.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape({}).isRequired
}

export default TableTypeCell

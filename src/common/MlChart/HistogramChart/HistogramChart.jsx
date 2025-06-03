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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import MlChart from '../MlChart'

const HistogramChart = ({ config, showLoader = true }) => {
  const chartConfig = useMemo(() => {
    const pythonInfinity = 'e+308'

    return {
      ...config,
      data: {
        ...config.data,
        labels: config.data.labels.map(label => {
          const labelStr = String(label)

          if (labelStr.includes(pythonInfinity)) {
            if (labelStr.includes('-')) {
              return `${labelStr.replace(/^([-]).*/, '$1∞')}`
            }

            return '∞'
          }

          return label
        })
      }
    }
  }, [config])

  return <MlChart config={chartConfig} showLoader={showLoader} smallLoader />
}

HistogramChart.propTypes = {
  config: PropTypes.object.isRequired,
  showLoader: PropTypes.bool
}

export default React.memo(HistogramChart)

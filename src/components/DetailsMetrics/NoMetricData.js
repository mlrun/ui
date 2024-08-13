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
import PropTypes from 'prop-types'

import StatsCard from '../../common/StatsCard/StatsCard'

import { ReactComponent as NoDataIcon } from 'igz-controls/images/no-data-metric-icon.svg'

const NoMetricData = ({ title = '', message = 'No data to show', className = '' }) => {
  return (
    <StatsCard className={`metrics__card ${className}`}>
      <StatsCard.Header title={title}></StatsCard.Header>
      <div className="metrics__empty-card">
        <div>
          <NoDataIcon />
        </div>
        <div>{message}</div>
      </div>
    </StatsCard>
  )
}

NoMetricData.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  title: PropTypes.string
}

export default NoMetricData

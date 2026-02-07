/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from 'react'
import PropTypes from 'prop-types'

import { Loader } from 'igz-controls/components'

import { FAILED_STATE, RUNNING_STATE } from '../../../constants'
import StatsCard from '../../../common/StatsCard/StatsCard'

const RealTimePipelinesCounters = ({ statistics, loading }) => {
  return (
    <div className="real-time-pipelines__summary-cards">
      <StatsCard className="monitoring-stats">
        <StatsCard.Header title="Serving Pipelines" />
        <StatsCard.Row>
          <StatsCard.Col>
            <StatsCard.MainCounter id="serving-pipelines-counter">
              {loading ? <Loader section small secondary /> : statistics.totalPipelines}
            </StatsCard.MainCounter>
          </StatsCard.Col>
        </StatsCard.Row>
      </StatsCard>

      <StatsCard className="monitoring-stats">
        <StatsCard.Header title="Root Functions Status" />
        <StatsCard.Row>
          <StatsCard.Col>
            <StatsCard.MainCounter id="running-functions-counter" className={RUNNING_STATE}>
              {loading ? <Loader section small secondary /> : statistics.runningFunctions}
            </StatsCard.MainCounter>
            <div className="stats__subtitle">
              Running
              <i className={`state-${RUNNING_STATE}`} />
            </div>
          </StatsCard.Col>
          <StatsCard.Col>
            <StatsCard.MainCounter
              id="failed-functions-counter"
              className={statistics.failedFunctions > 0 ? FAILED_STATE : RUNNING_STATE}
            >
              {loading ? <Loader section small secondary /> : statistics.failedFunctions}
            </StatsCard.MainCounter>
            <div className="stats__subtitle">
              Failed
              <i className={`state-${FAILED_STATE}`} />
            </div>
          </StatsCard.Col>
        </StatsCard.Row>
      </StatsCard>

      <StatsCard className="monitoring-stats">
        <StatsCard.Header title="Model Endpoints" />
        <StatsCard.Row>
          <StatsCard.Col>
            <StatsCard.MainCounter id="model-endpoints-counter">
              {loading ? <Loader section small secondary /> : statistics.modelEndpoints}
            </StatsCard.MainCounter>
          </StatsCard.Col>
        </StatsCard.Row>
      </StatsCard>
    </div>
  )
}

RealTimePipelinesCounters.propTypes = {
  loading: PropTypes.bool,
  statistics: PropTypes.shape({
    totalPipelines: PropTypes.number.isRequired,
    runningFunctions: PropTypes.number.isRequired,
    failedFunctions: PropTypes.number.isRequired,
    modelEndpoints: PropTypes.number.isRequired
  }).isRequired
}

export default RealTimePipelinesCounters

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
import { isNil } from 'lodash'

import StatsCard from '../../../../../common/StatsCard/StatsCard'
import { Tooltip, TextTooltipTemplate, Loader } from 'igz-controls/components'

const MonitoringApplicationCard = ({
  counterData,
  error = '',
  loading = false,
  tip = '',
  title
}) => {
  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header
        title={title}
        tip={tip}
        iconClass="stats-card__title-icon"
      ></StatsCard.Header>
      <StatsCard.Row>
        {counterData.map((counter, index) => {
          return (
            <StatsCard.Col key={index}>
              <Tooltip
                className="data-ellipsis"
                hidden={!counter.tooltipText}
                template={<TextTooltipTemplate text={counter.tooltipText} />}
              >
                <StatsCard.MainCounter id={`monitoring-app-${counter.id}`}>
                  {loading ? (
                    <Loader section small secondary />
                  ) : error || isNil(counter.title) ? (
                    'N/A'
                  ) : (
                    counter.title
                  )}
                  {counter.status && <i className={`state-${counter.status}`} />}
                </StatsCard.MainCounter>
                {counter.subtitle && (
                  <div data-testid={`${counter.id}_status`} className="stats__status">
                    <Tooltip
                      textShow={Boolean(counter.status)}
                      template={<TextTooltipTemplate text={counter.subtitle} />}
                    >
                      <span className="stats__subtitle">{counter.subtitle}</span>
                      {counter.subtitleStatus && (
                        <i className={`state-${counter.subtitleStatus}`} />
                      )}
                    </Tooltip>
                  </div>
                )}
              </Tooltip>
            </StatsCard.Col>
          )
        })}
      </StatsCard.Row>
    </StatsCard>
  )
}

MonitoringApplicationCard.propTypes = {
  counterData: PropTypes.array.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  loading: PropTypes.bool,
  tip: PropTypes.string,
  title: PropTypes.string
}

export default MonitoringApplicationCard

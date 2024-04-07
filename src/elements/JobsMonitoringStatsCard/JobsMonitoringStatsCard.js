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
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import './jobsMonitoringStatsCard.scss'

const JobsMonitoringStatsCard = ({ loading, selectedCard, setSelectedCard, statsData }) => {
  return (
    <div className="jobs-cards-wrapper">
      {statsData.map(cardData => {
        const cardClassNames = classnames(
          'monitoring-stats',
          `stats_${cardData.className}`,
          cardData.id === selectedCard && 'selected'
        )

        return (
          <StatsCard
            key={cardData.id}
            className={cardClassNames}
            onClick={() => setSelectedCard(cardData.id)}
          >
            <StatsCard.Row>
              <Tooltip template={<TextTooltipTemplate text={cardData.tooltip} />}>
                <StatsCard.Row>
                  <StatsCard.Col>
                    <span className="stats__counter">
                      {loading ? <Loader section small secondary /> : cardData.counter}
                    </span>
                    <span className="stats__subtitle">
                      {cardData.subTitle}
                      <i className={`state-${cardData.statusClass}`} />
                    </span>
                  </StatsCard.Col>
                </StatsCard.Row>
              </Tooltip>
            </StatsCard.Row>
          </StatsCard>
        )
      })}
    </div>
  )
}

JobsMonitoringStatsCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  selectedCard: PropTypes.string.isRequired,
  setSelectedCard: PropTypes.func.isRequired,
  statsData: PropTypes.array.isRequired
}

export default JobsMonitoringStatsCard

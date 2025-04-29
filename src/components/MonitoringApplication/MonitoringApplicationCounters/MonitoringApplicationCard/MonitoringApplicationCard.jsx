import React from 'react'
import StatsCard from '../../../../common/StatsCard/StatsCard'
import Loader from '../../../../common/Loader/Loader'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import { useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const MonitoringApplicationCard = ({ counterData, projectSummary, tip = '', title, isRed }) => {
  const navigate = useNavigate()
  const statsCardClassname = classnames('monitoring-stats', isRed && 'monitoring-stats__red')

  return (
    <StatsCard className={statsCardClassname}>
      <StatsCard.Header title={title} tip={tip}></StatsCard.Header>
      <StatsCard.Row>
        {counterData.map((counter, index) => {
          return (
            <StatsCard.Col key={index}>
              <Tooltip
                className="data-ellipsis"
                hidden={!counter.tooltipText}
                template={<TextTooltipTemplate text={counter.tooltipText} />}
              >
                <div
                  className="stats__link"
                  onClick={() => (counter.link ? navigate(counter.link) : () => {})}
                  data-testid={`monitoring-app-${title}`}
                >
                  <div className="stats__counter">
                    {projectSummary.loading ? (
                      <Loader section small secondary />
                    ) : projectSummary.error ? (
                      'N/A'
                    ) : (
                      counter.title
                    )}
                  </div>
                </div>
                {counter.subtitle && (
                  <div data-testid={`${counter.status}_status`} className="stats__status">
                    <Tooltip textShow template={<TextTooltipTemplate text={counter.status} />}>
                      <span className="stats__subtitle">{counter.subtitle}</span>
                      <i className={`state-${counter.status}`} />
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
  projectSummary: PropTypes.object.isRequired,
  tip: PropTypes.string,
  title: PropTypes.string,
  isRed: PropTypes.bool
}

export default MonitoringApplicationCard

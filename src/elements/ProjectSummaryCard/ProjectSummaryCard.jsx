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
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate, Loader } from 'igz-controls/components'
import StatsCard from '../../common/StatsCard/StatsCard'

const ProjectSummaryCard = ({
  counterValue,
  link,
  projectSummary,
  tip = '',
  title,
  tooltipText = ''
}) => {
  const navigate = useNavigate()
  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header title={title} tip={tip}></StatsCard.Header>
      <StatsCard.Row>
        <StatsCard.Col>
          <Tooltip
            className="data-ellipsis"
            hidden={!tooltipText}
            template={<TextTooltipTemplate text={tooltipText} />}
          >
            <div className="project-data-card__header">
              <div
                className="stats__link"
                onClick={() => navigate(link)}
                data-testid={`monitoring-${title}`}
              >
                <div className="stats__counter">
                  {projectSummary.loading ? (
                    <Loader section small secondary />
                  ) : projectSummary.error ? (
                    'N/A'
                  ) : (
                    counterValue
                  )}
                </div>
              </div>
            </div>
          </Tooltip>
        </StatsCard.Col>
      </StatsCard.Row>
    </StatsCard>
  )
}

ProjectSummaryCard.propTypes = {
  counterValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  link: PropTypes.string.isRequired,
  projectSummary: PropTypes.object.isRequired,
  tip: PropTypes.string,
  title: PropTypes.string.isRequired,
  tooltipText: PropTypes.string
}

export default ProjectSummaryCard

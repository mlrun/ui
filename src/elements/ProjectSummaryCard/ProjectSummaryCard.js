import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'
import Loader from '../../common/Loader/Loader'

const ProjectSummaryCard = ({
  counterValue,
  link,
  projectSummary,
  title,
  tooltipText
}) => {
  return (
    <Link to={link} className="project-data-card project-data-card_small">
      <Tooltip
        className="data-ellipsis"
        hidden={!tooltipText}
        template={<TextTooltipTemplate text={tooltipText} />}
      >
        <div className="project-data-card__header">
          <div className="project-data-card__header-text data-ellipsis">
            {title}
          </div>
          <div className="project-data-card__statistics">
            <div className="project-data-card__statistics-item">
              {projectSummary.loading ? (
                <Loader section />
              ) : (
                <div className="project-data-card__statistics-value statistics_default">
                  {projectSummary.error ? 'N/A' : counterValue}
                </div>
              )}
            </div>
          </div>
        </div>
      </Tooltip>
    </Link>
  )
}

ProjectSummaryCard.defaultProps = {
  tooltipText: null
}

ProjectSummaryCard.propTypes = {
  counterValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  link: PropTypes.string.isRequired,
  projectSummary: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  tooltipText: PropTypes.string
}

export default ProjectSummaryCard

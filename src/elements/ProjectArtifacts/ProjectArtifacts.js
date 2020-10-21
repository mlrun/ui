import React, { useEffect, useMemo } from 'react'
import { isEmpty } from 'lodash'

import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'

const ProjectArtifacts = ({
  artifacts,
  fetchArtifacts,
  link,
  match,
  title
}) => {
  useEffect(() => {
    fetchArtifacts(match.params.projectName)
  }, [fetchArtifacts, match.params.projectName])

  const generatedArtifacts = useMemo(() => {
    if (artifacts.data) {
      const artifactsCount = artifacts.data.length

      return {
        data: {
          value: artifactsCount,
          label: '',
          className: 'default',
          link: link
        }
      }
    }
  }, [artifacts.data, link])

  return (
    <div className="project-data-card project-data-card_small">
      <div className="project-data-card__header">
        <div className="project-data-card__header-text data-ellipsis">
          {title}
        </div>
        {artifacts.error ? (
          <div className="error_container">
            <h1>{artifacts.error}</h1>
          </div>
        ) : (
          !isEmpty(artifacts.data) && (
            <div className="project-data-card__statistics">
              <ProjectStatistics statistics={generatedArtifacts} />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ProjectArtifacts

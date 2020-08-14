import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import ProjectDataCard from '../../elements/ProjectDataCard/ProjectDataCard'

const ProjectFunctions = ({ fetchProjectFunctions, functionsStore, match }) => {
  useEffect(() => {
    fetchProjectFunctions(match.params.projectName)
  }, [match.params.projectName, fetchProjectFunctions])

  const functions = useMemo(() => {
    if (functionsStore.data) {
      const functionsCount = functionsStore.data.length

      return {
        data: {
          value: functionsCount,
          label: 'ML',
          className: 'default',
          link: `/projects/${match.params.projectName}/functions`
        }
      }
    }
  }, [functionsStore, match.params.projectName])

  const functionsTable = useMemo(() => {
    if (functionsStore.data) {
      const functionsTableHeaders = [
        {
          value: 'Name',
          className: 'table-cell_big'
        },
        { value: 'Type', className: 'table-cell_small' },
        { value: 'Status', className: 'table-cell_small' }
      ]

      const functionsTableBody = functionsStore.data.slice(0, 5).map(func => {
        return {
          name: {
            value: func.metadata.name,
            link: `/projects/${match.params.projectName}/functions/${func.metadata.hash}/info`,
            className: 'table-cell_big'
          },
          type: {
            value: func.metadata.kind ?? '',
            class: 'project-data-card__table-cell table-cell_small'
          },
          status: {
            value: func?.status?.state ?? '',
            className: 'table-cell_small'
          }
        }
      })

      return {
        header: functionsTableHeaders,
        body: functionsTableBody
      }
    }
  }, [functionsStore, match.params.projectName])

  return (
    <ProjectDataCard
      dataCard={functionsStore}
      link={`/projects/${match.params.projectName}/functions`}
      match={match}
      statistics={functions}
      table={functionsTable}
    />
  )
}

ProjectFunctions.propTypes = {
  fetchProjectFunctions: PropTypes.func.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectFunctions)

import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

const ProjectFunctions = ({ fetchNuclioFunctions, functionsStore, match }) => {
  useEffect(() => {
    fetchNuclioFunctions(match.params.projectName)
  }, [fetchNuclioFunctions, match.params.projectName])

  const functions = useMemo(() => {
    if (functionsStore.functions.length > 0) {
      const functionsRunning = functionsStore.functions.reduce(
        (prev, curr) =>
          !curr.spec.disable && curr.status.state === 'ready'
            ? (prev += 1)
            : prev,
        0
      )
      const functionsFailed = functionsStore.functions.reduce(
        (prev, curr) => (curr.status.state === 'error' ? (prev += 1) : prev),
        0
      )

      return {
        running: {
          value: functionsRunning,
          label: 'Running functions',
          className: 'running',
          href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`
        },
        failed: {
          value: functionsFailed,
          label: 'Failed',
          className: 'failed',
          href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`
        }
      }
    }
  }, [functionsStore, match.params.projectName])

  const functionsTable = useMemo(() => {
    if (functionsStore.functions.length > 0) {
      const functionsTableHeaders = [
        {
          value: 'Name',
          className: 'table-cell_big'
        },
        { value: 'Status', className: 'table-cell_small' }
      ]

      const functionsTableBody = functionsStore.functions
        .slice(0, 5)
        .map(func => {
          return {
            name: {
              value: func.metadata.name,
              href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions/${func.metadata.name}`,
              className: 'table-cell_big'
            },
            status: {
              value: func?.status?.state ?? '',
              className: `table-cell_small status_${func?.status?.state}`
            }
          }
        })

      return {
        header: functionsTableHeaders,
        body: functionsTableBody
      }
    }
  }, [functionsStore.functions, match.params.projectName])

  return (
    <ProjectDataCard
      dataCard={{
        data: functionsStore.functions,
        error: functionsStore.error,
        loading: functionsStore.loading
      }}
      href={`${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`}
      match={match}
      statistics={functions}
      table={functionsTable}
      title="Real-time functions"
    />
  )
}

ProjectFunctions.propTypes = {
  fetchNuclioFunctions: PropTypes.func.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectFunctions)

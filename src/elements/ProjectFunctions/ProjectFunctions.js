import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { lowerCase, upperFirst } from 'lodash'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

const ProjectFunctions = ({
  fetchApiGateways,
  fetchNuclioFunctions,
  functionsStore,
  match
}) => {
  useEffect(() => {
    fetchNuclioFunctions(match.params.projectName)
  }, [fetchNuclioFunctions, match.params.projectName])

  useEffect(() => {
    fetchApiGateways(match.params.projectName)
  }, [fetchApiGateways, match.params.projectName])

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
          label: 'Running',
          className: 'running',
          href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`
        },
        failed: {
          value: functionsFailed,
          label: 'Failed',
          className: functionsFailed > 0 ? 'failed' : 'default',
          href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`
        },
        apiGateways: {
          value: functionsStore.apiGateways,
          label: 'API gateways',
          className: 'running',
          href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/api-gateways`
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
          const funcClassName = classnames(
            'table-cell_small',
            'status',
            `status-nuclio_${func?.status?.state}`,
            func?.spec?.disable && 'disabled'
          )

          return {
            name: {
              value: func.metadata.name,
              href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions/${func.metadata.name}`,
              className: 'table-cell_big'
            },
            status: {
              value:
                func?.status?.state === 'ready' && !func?.spec?.disable
                  ? 'Running'
                  : func?.status?.state === 'ready' && func?.spec?.disable
                  ? 'Standby'
                  : ['error', 'unhealthy', 'imported', 'scaledToZero'].includes(
                      func?.status?.state
                    )
                  ? upperFirst(lowerCase(func.status.state))
                  : 'Building',
              className: funcClassName
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
      content={{
        data: functionsStore.functions,
        error: functionsStore.error,
        loading: functionsStore.loading
      }}
      headerLink={`${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`}
      href={`${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`}
      match={match}
      statistics={functions}
      table={functionsTable}
      title="Real-time functions (Nuclio)"
    />
  )
}

ProjectFunctions.propTypes = {
  fetchNuclioFunctions: PropTypes.func.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectFunctions)

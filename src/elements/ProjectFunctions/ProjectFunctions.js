import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { lowerCase, upperFirst } from 'lodash'

import { groupByUniqName } from '../../utils/groupByUniqName'
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
    const grouppedFunctionsRunning = groupByUniqName(
      functionsStore.currentProjectFunctions,
      'metadata.name'
    )

    const functionsRunning = grouppedFunctionsRunning.reduce(
      (prev, curr) =>
        !curr.spec.disable && curr.status.state === 'ready'
          ? (prev += 1)
          : prev,
      0
    )
    const functionsFailed = grouppedFunctionsRunning.reduce(
      (prev, curr) => (curr.status.state === 'error' ? (prev += 1) : prev),
      0
    )

    return {
      running: {
        value: functionsRunning,
        label: 'Running',
        className: functionsRunning > 0 ? 'running' : 'default',
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
        className: functionsStore.apiGateways > 0 ? 'running' : 'default',
        href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/api-gateways`
      }
    }
  }, [functionsStore, match.params.projectName])

  const functionsTable = useMemo(() => {
    if (functionsStore.currentProjectFunctions.length > 0) {
      const functionsTableHeaders = [
        {
          value: 'Name',
          className: 'table-cell_big'
        },
        { value: 'Status', className: 'table-cell_small' }
      ]

      const functionsTableBody = functionsStore.currentProjectFunctions
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
              value: func.metadata.name.startsWith(match.params.projectName)
                ? func.metadata.name.slice(match.params.projectName.length + 1)
                : func.metadata.name,
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
  }, [functionsStore.currentProjectFunctions, match.params.projectName])

  return (
    <ProjectDataCard
      content={{
        data: functionsStore.currentProjectFunctions,
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
  fetchApiGateways: PropTypes.func.isRequired,
  fetchNuclioFunctions: PropTypes.func.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectFunctions)

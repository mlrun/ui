import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { lowerCase, upperFirst } from 'lodash'
import { connect } from 'react-redux'

import { groupByUniqName } from '../../utils/groupByUniqName'
import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import { useNuclioMode } from '../../hooks/nuclioMode.hook'

import nuclioActions from '../../actions/nuclio'

const ProjectFunctions = ({
  fetchApiGateways,
  fetchNuclioFunctions,
  match,
  nuclioStore
}) => {
  const { isNuclioModeDisabled } = useNuclioMode()

  useEffect(() => {
    if (!isNuclioModeDisabled) {
      fetchNuclioFunctions(match.params.projectName)
    }
  }, [fetchNuclioFunctions, isNuclioModeDisabled, match.params.projectName])

  useEffect(() => {
    if (!isNuclioModeDisabled) {
      fetchApiGateways(match.params.projectName)
    }
  }, [fetchApiGateways, isNuclioModeDisabled, match.params.projectName])

  const functions = useMemo(() => {
    const groupeFunctionsRunning = groupByUniqName(
      nuclioStore.currentProjectFunctions,
      'metadata.name'
    )

    const functionsRunning = groupeFunctionsRunning.reduce(
      (prev, curr) =>
        !curr.spec.disable && curr.status.state === 'ready'
          ? (prev += 1)
          : prev,
      0
    )
    const functionsFailed = groupeFunctionsRunning.reduce(
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
        value: nuclioStore.apiGateways,
        label: 'API gateways',
        className: nuclioStore.apiGateways > 0 ? 'running' : 'default',
        href: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/api-gateways`
      }
    }
  }, [
    match.params.projectName,
    nuclioStore.apiGateways,
    nuclioStore.currentProjectFunctions
  ])

  const functionsTable = useMemo(() => {
    if (nuclioStore.currentProjectFunctions.length > 0) {
      const functionsTableHeaders = [
        {
          value: 'Name',
          className: 'table-cell_big'
        },
        { value: 'Status', className: 'table-cell_small' }
      ]

      const functionsTableBody = nuclioStore.currentProjectFunctions
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
  }, [match.params.projectName, nuclioStore.currentProjectFunctions])

  return (
    <ProjectDataCard
      content={{
        data: nuclioStore.currentProjectFunctions,
        error: isNuclioModeDisabled
          ? 'Nuclio is not deployed'
          : nuclioStore.error,
        loading: nuclioStore.loading
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
  match: PropTypes.shape({}).isRequired
}

export default connect(
  nuclioStore => ({
    ...nuclioStore
  }),
  {
    ...nuclioActions
  }
)(React.memo(ProjectFunctions))

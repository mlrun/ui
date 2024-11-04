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
import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { lowerCase, upperFirst } from 'lodash'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import nuclioActions from '../../actions/nuclio'
import { groupByUniqName } from '../../utils/groupByUniqName'
import { useNuclioMode } from '../../hooks/nuclioMode.hook'
import { generateNuclioLink } from '../../utils'
import { ERROR_STATE, REQUEST_CANCELED } from '../../constants'

const ProjectFunctions = ({ fetchApiGateways, fetchNuclioFunctions, nuclioStore }) => {
  const params = useParams()
  const { isNuclioModeDisabled } = useNuclioMode()

  useEffect(() => {
    if (!isNuclioModeDisabled) {
      const abortController = new AbortController()

      fetchNuclioFunctions(params.projectName, abortController.signal)

      return () => {
        abortController.abort(REQUEST_CANCELED)
      }
    }
  }, [fetchNuclioFunctions, isNuclioModeDisabled, params.projectName])

  useEffect(() => {
    if (!isNuclioModeDisabled) {
      const abortController = new AbortController()

      fetchApiGateways(params.projectName, abortController.signal)

      return () => {
        abortController.abort(REQUEST_CANCELED)
      }
    }
  }, [fetchApiGateways, isNuclioModeDisabled, params.projectName])

  const functions = useMemo(() => {
    const groupeFunctionsRunning = groupByUniqName(
      nuclioStore.currentProjectFunctions,
      'metadata.name'
    )

    const functionsRunning = groupeFunctionsRunning.reduce(
      (prev, curr) => (!curr.spec.disable && curr.status.state === 'ready' ? (prev += 1) : prev),
      0
    )
    const functionsFailed = groupeFunctionsRunning.reduce(
      (prev, curr) => ([ERROR_STATE, 'unhealthy'].includes(curr.status.state) ? (prev += 1) : prev),
      0
    )

    return {
      running: {
        value: functionsRunning,
        label: 'Running',
        className: functionsRunning > 0 ? 'running' : 'default',
        href: generateNuclioLink(`/projects/${params.projectName}/functions`)
      },
      failed: {
        value: functionsFailed,
        label: 'Failed',
        className: functionsFailed > 0 ? 'failed' : 'default',
        href: generateNuclioLink(`/projects/${params.projectName}/functions`)
      },
      apiGateways: {
        value: nuclioStore.apiGateways,
        label: 'API gateways',
        className: nuclioStore.apiGateways > 0 ? 'running' : 'default',
        href: generateNuclioLink(`/projects/${params.projectName}/api-gateways`)
      }
    }
  }, [params.projectName, nuclioStore.apiGateways, nuclioStore.currentProjectFunctions])

  const functionsTable = useMemo(() => {
    if (nuclioStore.currentProjectFunctions.length > 0) {
      const functionsTableHeaders = [
        {
          value: 'Name',
          className: 'table-cell_big'
        },
        { value: 'Status', className: 'table-cell_small' }
      ]

      const functionsTableBody = nuclioStore.currentProjectFunctions.slice(0, 5).map(func => {
        const funcClassName = classnames(
          'table-cell_small',
          'status',
          `status-nuclio_${func?.status?.state}`,
          func?.spec?.disable && 'disabled'
        )

        return {
          name: {
            value: func.metadata.name,
            href: generateNuclioLink(
              `/projects/${params.projectName}/functions/${func.metadata.name}`
            ),
            className: 'table-cell_big'
          },
          status: {
            value:
              func?.status?.state === 'ready' && !func?.spec?.disable
                ? 'Running'
                : func?.status?.state === 'ready' && func?.spec?.disable
                  ? 'Standby'
                  : [ERROR_STATE, 'unhealthy', 'imported', 'scaledToZero'].includes(func?.status?.state)
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
  }, [params.projectName, nuclioStore.currentProjectFunctions])

  return (
    <ProjectDataCard
      content={{
        data: nuclioStore.currentProjectFunctions,
        error: isNuclioModeDisabled ? 'Nuclio is not deployed' : nuclioStore.error,
        loading: nuclioStore.loading
      }}
      href={generateNuclioLink(`/projects/${params.projectName}/functions`)}
      params={params}
      statistics={functions}
      table={functionsTable}
      title="Real-time functions (Nuclio)"
    />
  )
}

ProjectFunctions.propTypes = {
  fetchApiGateways: PropTypes.func.isRequired,
  fetchNuclioFunctions: PropTypes.func.isRequired
}

export default connect(
  nuclioStore => ({
    ...nuclioStore
  }),
  {
    ...nuclioActions
  }
)(React.memo(ProjectFunctions))

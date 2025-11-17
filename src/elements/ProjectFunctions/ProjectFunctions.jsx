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
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import {
  ERROR_STATE,
  FAILED_STATE,
  FUNCTION_READY_STATE,
  REQUEST_CANCELED,
  RUNNING_STATE
} from '../../constants'
import { fetchApiGateways, fetchNuclioFunctions } from '../../reducers/nuclioReducer'
import { generateNuclioLink } from '../../utils'
import { groupByUniqName } from '../../utils/groupByUniqName'
import { typesOfJob } from '../../utils/jobs.util'
import { useNuclioMode } from '../../hooks/nuclioMode.hook'

const ProjectFunctions = ({ nuclioStreamsAreEnabled }) => {
  const params = useParams()
  const { isNuclioModeDisabled } = useNuclioMode()
  const nuclioStore = useSelector(store => store.nuclioStore)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isNuclioModeDisabled) {
      const abortController = new AbortController()

      dispatch(
        fetchNuclioFunctions({ project: params.projectName, signal: abortController.signal })
      )

      return () => {
        abortController.abort(REQUEST_CANCELED)
      }
    }
  }, [dispatch, isNuclioModeDisabled, params.projectName])

  useEffect(() => {
    if (!isNuclioModeDisabled) {
      const abortController = new AbortController()

      dispatch(fetchApiGateways({ project: params.projectName, signal: abortController.signal }))

      return () => {
        abortController.abort(REQUEST_CANCELED)
      }
    }
  }, [dispatch, isNuclioModeDisabled, params.projectName])

  const functions = useMemo(() => {
    const groupeFunctionsRunning = groupByUniqName(
      nuclioStore.currentProjectFunctions,
      'metadata.name'
    )

    const functionsRunning = groupeFunctionsRunning.reduce(
      (prev, curr) =>
        !curr.spec.disable && curr.status.state === FUNCTION_READY_STATE ? (prev += 1) : prev,
      0
    )
    const functionsFailed = groupeFunctionsRunning.reduce(
      (prev, curr) => ([ERROR_STATE, 'unhealthy'].includes(curr.status.state) ? (prev += 1) : prev),
      0
    )

    return {
      running: {
        counterTooltip: 'Running',
        value: functionsRunning,
        label: 'Running',
        className: RUNNING_STATE,
        status: RUNNING_STATE,
        href: generateNuclioLink(`/projects/${params.projectName}/functions`),
        loading: nuclioStore.loading
      },
      failed: {
        counterTooltip: 'Error, Unhealthy',
        value: functionsFailed,
        label: 'Failed',
        status: FAILED_STATE,
        className: functionsFailed > 0 ? FAILED_STATE : RUNNING_STATE,
        href: generateNuclioLink(`/projects/${params.projectName}/functions`),
        loading: nuclioStore.loading
      },
      apiGateways: {
        value: nuclioStore.apiGateways,
        label: 'API gateways',
        className: RUNNING_STATE,
        href: generateNuclioLink(`/projects/${params.projectName}/api-gateways`),
        loading: nuclioStore.loading
      },
      ...(nuclioStreamsAreEnabled && {
        consumerGroups: {
          value: isNuclioModeDisabled
            ? 'N/A'
            : (Object.keys(nuclioStore.v3ioStreams.data).length ?? 0),
          label: 'Consumer groups',
          className: RUNNING_STATE,
          link: `/projects/${params.projectName}/monitor${
            !isNuclioModeDisabled ? '/consumer-groups' : ''
          }`,
          loading: nuclioStore.loading
        }
      })
    }
  }, [
    nuclioStore.currentProjectFunctions,
    nuclioStore.loading,
    nuclioStore.apiGateways,
    nuclioStore.v3ioStreams.data,
    params.projectName,
    nuclioStreamsAreEnabled,
    isNuclioModeDisabled
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
              func?.status?.state === FUNCTION_READY_STATE && !func?.spec?.disable
                ? 'Running'
                : func?.status?.state === FUNCTION_READY_STATE && func?.spec?.disable
                  ? 'Standby'
                  : [ERROR_STATE, 'unhealthy', 'imported', 'scaledToZero'].includes(
                        func?.status?.state
                      )
                    ? upperFirst(lowerCase(func.status.state))
                    : 'Building',
            types: typesOfJob,
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
      footerLinkText="All real-time functions"
      href={generateNuclioLink(`/projects/${params.projectName}/functions`)}
      params={params}
      statistics={functions}
      subTitle="Recent real-time functions"
      table={functionsTable}
      title="Real-time functions (Nuclio)"
    />
  )
}

ProjectFunctions.propTypes = {
  nuclioStreamsAreEnabled: PropTypes.bool.isRequired
}
export default React.memo(ProjectFunctions)

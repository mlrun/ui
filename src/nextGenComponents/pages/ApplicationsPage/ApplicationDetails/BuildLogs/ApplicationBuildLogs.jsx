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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'

import LogSection from './LogSection'
import NoData from '../../../../shared/NoData/NoData'
import { fetchFunctionLogs, fetchFunctionNuclioLogs } from '../../../../../reducers/functionReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { NOTFOUND_ERROR_STATUS_CODE } from 'igz-controls/constants'
import {
  APPLICATION_DEPLOYING_STATES,
  APPLICATION_INITIALIZED_STATE,
  BUILD_LOGS_INITIALIZED_MESSAGE,
  BUILD_LOGS_POLLING_INTERVAL_MS,
  COPY_RESET_TIMEOUT_MS,
  FUNCTION_STATUS_HEADER,
  LOGS_SECTION_KEY,
  TRANSIENT_FUNCTION_STATUSES
} from '../applicationDetails.constants'

/**
 * Extracts function deploy logs from the API response.
 * Handles all known response shapes:
 *   - { status: { logs: LogEntry[] } }  — standard Nuclio deploy status
 *   - { logs: LogEntry[] }              — short-form
 *   - LogEntry[]                        — bare array
 *   - string                            — pre-formatted text
 */
const extractFunctionLogs = data => {
  if (Array.isArray(data?.status?.logs)) return data.status.logs
  if (Array.isArray(data?.logs)) return data.logs
  if (Array.isArray(data)) return data
  if (typeof data === 'string' && data.trim().length > 0) return data

  return null
}

const isFunctionTransient = response =>
  TRANSIENT_FUNCTION_STATUSES.includes(response.headers?.[FUNCTION_STATUS_HEADER])

const formatFunctionLogsForClipboard = logs => {
  if (Array.isArray(logs)) {
    return logs
      .map(
        log => `[${new Date(log.time).toISOString()}] ${log.level?.toUpperCase()} ${log.message}`
      )
      .join('\n')
  }

  return logs ?? ''
}

const ApplicationBuildLogs = ({ application }) => {
  const dispatch = useDispatch()
  const { projectName } = useParams()

  const applicationState = application.state?.value
  const isInitialized = applicationState === APPLICATION_INITIALIZED_STATE
  const isDeploying = APPLICATION_DEPLOYING_STATES.includes(applicationState)

  const [applicationLogs, setApplicationLogs] = useState('')
  const [functionLogs, setFunctionLogs] = useState(null)
  const [copiedSection, setCopiedSection] = useState(null)
  const [isAppLogsLoading, setIsAppLogsLoading] = useState(!isInitialized)
  const [isFunctionLogsLoading, setIsFunctionLogsLoading] = useState(!isInitialized)

  const appLogsPollingRef = useRef(null)
  const functionLogsPollingRef = useRef(null)
  const copyResetRef = useRef(null)

  const clearPolling = useCallback(pollingRef => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isInitialized) {
      return undefined
    }

    let cancelled = false

    const fetchAppLogsSafe = () => {
      dispatch(
        fetchFunctionLogs({ project: projectName, name: application.name, tag: application.tag })
      )
        .unwrap()
        .then(response => {
          if (cancelled) return
          setApplicationLogs(response.data || '')
          const isTransient = isFunctionTransient(response)
          setIsAppLogsLoading(isTransient)

          if (isTransient) {
            clearPolling(appLogsPollingRef)
            appLogsPollingRef.current = setTimeout(fetchAppLogsSafe, BUILD_LOGS_POLLING_INTERVAL_MS)
          }
        })
        .catch(error => {
          if (cancelled) return

          if (isDeploying && error?.response?.status === NOTFOUND_ERROR_STATUS_CODE) {
            setIsAppLogsLoading(true)
            clearPolling(appLogsPollingRef)
            appLogsPollingRef.current = setTimeout(fetchAppLogsSafe, BUILD_LOGS_POLLING_INTERVAL_MS)
            return
          }
          setIsAppLogsLoading(false)
          showErrorNotification(dispatch, error, 'Application logs failed to load')
        })
    }

    const fetchFunctionDeployLogsSafe = () => {
      dispatch(
        fetchFunctionNuclioLogs({
          project: projectName,
          name: application.name,
          tag: application.tag
        })
      )
        .unwrap()
        .then(response => {
          if (cancelled) return
          setFunctionLogs(extractFunctionLogs(response.data))
          const isTransient = isFunctionTransient(response)
          setIsFunctionLogsLoading(isTransient)

          if (isTransient) {
            clearPolling(functionLogsPollingRef)
            functionLogsPollingRef.current = setTimeout(
              fetchFunctionDeployLogsSafe,
              BUILD_LOGS_POLLING_INTERVAL_MS
            )
          }
        })
        .catch(error => {
          if (cancelled) return

          if (isDeploying && error?.response?.status === NOTFOUND_ERROR_STATUS_CODE) {
            setIsFunctionLogsLoading(true)
            clearPolling(functionLogsPollingRef)
            functionLogsPollingRef.current = setTimeout(
              fetchFunctionDeployLogsSafe,
              BUILD_LOGS_POLLING_INTERVAL_MS
            )
            return
          }
          setIsFunctionLogsLoading(false)
          showErrorNotification(dispatch, error, 'Function logs failed to load')
        })
    }

    fetchAppLogsSafe()
    fetchFunctionDeployLogsSafe()

    return () => {
      cancelled = true
      clearPolling(appLogsPollingRef)
      clearPolling(functionLogsPollingRef)
      clearTimeout(copyResetRef.current)
    }
  }, [
    application.name,
    application.tag,
    clearPolling,
    dispatch,
    isDeploying,
    isInitialized,
    projectName
  ])

  const handleCopy = useCallback((text, sectionKey) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedSection(sectionKey)
    clearTimeout(copyResetRef.current)
    copyResetRef.current = setTimeout(() => setCopiedSection(null), COPY_RESET_TIMEOUT_MS)
  }, [])

  const handleCopyAppLogs = useCallback(
    () => handleCopy(applicationLogs, LOGS_SECTION_KEY.APPLICATION),
    [applicationLogs, handleCopy]
  )

  const handleCopyFunctionLogs = useCallback(
    () => handleCopy(formatFunctionLogsForClipboard(functionLogs), LOGS_SECTION_KEY.FUNCTION),
    [functionLogs, handleCopy]
  )

  const appLogsEmpty = useMemo(
    () =>
      !isAppLogsLoading &&
      (!applicationLogs || (typeof applicationLogs === 'string' && applicationLogs.trim() === '')),
    [isAppLogsLoading, applicationLogs]
  )

  if (isInitialized) {
    return (
      <div className="flex flex-col h-full py-4" data-testid="application-build-logs">
        <NoData message={BUILD_LOGS_INITIALIZED_MESSAGE} />
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-6 py-4 h-full overflow-y-auto"
      data-testid="application-build-logs"
    >
      {!appLogsEmpty && (
        <LogSection
          title="Application"
          logs={applicationLogs}
          isLoading={isAppLogsLoading}
          loadingMessage={isDeploying ? BUILD_LOGS_INITIALIZED_MESSAGE : undefined}
          isCopied={copiedSection === LOGS_SECTION_KEY.APPLICATION}
          onCopy={handleCopyAppLogs}
        />
      )}
      <LogSection
        title="Function"
        logs={functionLogs}
        isLoading={isFunctionLogsLoading}
        loadingMessage={isDeploying ? BUILD_LOGS_INITIALIZED_MESSAGE : undefined}
        isCopied={copiedSection === LOGS_SECTION_KEY.FUNCTION}
        onCopy={handleCopyFunctionLogs}
      />
    </div>
  )
}

ApplicationBuildLogs.propTypes = {
  application: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tag: PropTypes.string,
    state: PropTypes.shape({
      value: PropTypes.string
    })
  }).isRequired
}

export default ApplicationBuildLogs

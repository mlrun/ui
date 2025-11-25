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
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import Logs from './Logs'
import { setRunAttempt, setRunAttemptOptions } from '../../reducers/detailsReducer'
import { REQUEST_CANCELED } from '../../constants'

const DetailsLogs = ({
  additionalLogsTitle = '',
  item,
  logsTitle = '',
  noDataMessage = '',
  refreshAdditionalLogs = null,
  refreshLogs,
  removeAdditionalLogs = false,
  removeLogs,
  withLogsRefreshBtn
}) => {
  const [detailsLogs, setDetailsLogs] = useState('')
  const [detailsAdditionalLogs, setDetailsAdditionalLogs] = useState('')
  const streamLogsRef = useRef()
  const streamAdditionalLogsRef = useRef()
  const functionsStore = useSelector(store => store.functionsStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const runAttempt = useSelector(store => store.detailsStore.runAttempt)
  const dispatch = useDispatch()
  const refreshLogsAbortControllerRef = useRef(new AbortController())

  const mainLogsAreLoading = useMemo(() => {
    return functionsStore.logs.loading || jobsStore.logs.loadingCounter > 0
  }, [functionsStore.logs.loading, jobsStore.logs.loadingCounter])
  const additionalLogsAreLoading = useMemo(() => {
    return functionsStore.nuclioLogs.loading
  }, [functionsStore.nuclioLogs.loading])

  const refreshLogsHandler = useCallback(
    (item, project, setDetailsLogs, streamLogsRef, runAttempt) => {
      refreshLogsAbortControllerRef.current?.abort?.(REQUEST_CANCELED)
      streamLogsRef.current = null
      refreshLogsAbortControllerRef.current = new AbortController()

      return refreshLogs(
        item,
        project,
        setDetailsLogs,
        streamLogsRef,
        runAttempt,
        refreshLogsAbortControllerRef.current?.signal
      )
    },
    [refreshLogs]
  )

  useEffect(() => {
    if (refreshLogs) {
      refreshLogsHandler(item, item.project, setDetailsLogs, streamLogsRef, runAttempt)

      return () => {
        setDetailsLogs('')
        removeLogs()
      }
    }
  }, [item, refreshLogs, removeLogs, withLogsRefreshBtn, runAttempt, refreshLogsHandler])

  useEffect(() => {
    refreshAdditionalLogs &&
      refreshAdditionalLogs(item, item.project, setDetailsAdditionalLogs, streamAdditionalLogsRef)

    return () => {
      setDetailsAdditionalLogs('')
      removeAdditionalLogs && removeAdditionalLogs()
    }
  }, [item, withLogsRefreshBtn, refreshAdditionalLogs, removeAdditionalLogs])

  useEffect(() => {
    if (item?.retryCount > 0) {
      const attemptsList = Array.from({ length: item.retryCount + 1 }, (_, index) => ({
        id: `${index + 1}`,
        label: `${index + 1}`
      }))

      attemptsList[attemptsList.length - 1].id = '0'

      dispatch(setRunAttemptOptions(attemptsList))

      return () => {
        dispatch(setRunAttemptOptions([]))
        dispatch(setRunAttempt('0'))
        refreshLogsAbortControllerRef.current?.abort?.(REQUEST_CANCELED)
      }
    } else {
      return () => {
        refreshLogsAbortControllerRef.current?.abort?.(REQUEST_CANCELED)
      }
    }
  }, [dispatch, item])

  return (
    <div className="table__item-logs-container">
      {logsTitle && <h3>{logsTitle}</h3>}
      <Logs
        isLoading={mainLogsAreLoading}
        refreshLogs={() =>
          refreshLogsHandler(item, item.project, setDetailsLogs, streamLogsRef, runAttempt)
        }
        ref={streamLogsRef}
        withLogsRefreshBtn={withLogsRefreshBtn}
        detailsLogs={detailsLogs}
        noDataMessage={noDataMessage}
      />
      {refreshAdditionalLogs && (
        <>
          {additionalLogsTitle && <h3>{additionalLogsTitle}</h3>}
          <Logs
            isLoading={additionalLogsAreLoading}
            refreshLogs={() =>
              refreshAdditionalLogs(
                item,
                item.project,
                setDetailsAdditionalLogs,
                streamAdditionalLogsRef
              )
            }
            ref={streamAdditionalLogsRef}
            withLogsRefreshBtn={withLogsRefreshBtn}
            detailsLogs={detailsAdditionalLogs}
            noDataMessage={noDataMessage}
          />
        </>
      )}
    </div>
  )
}

DetailsLogs.propTypes = {
  additionalLogsTitle: PropTypes.string,
  item: PropTypes.object.isRequired,
  logsTitle: PropTypes.string,
  noDataMessage: PropTypes.string,
  refreshAdditionalLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  refreshLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).isRequired,
  removeAdditionalLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  removeLogs: PropTypes.func.isRequired,
  withLogsRefreshBtn: PropTypes.bool.isRequired
}

export default DetailsLogs

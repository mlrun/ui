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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Logs from './Logs'
import NoData from '../../common/NoData/NoData'

const DetailsLogs = ({
  additionalLogsTitle = '',
  functionsStore,
  item,
  jobsStore,
  logsTitle = '',
  noDataMessage = '',
  refreshAdditionalLogs = false,
  refreshLogs,
  removeAdditionalLogs = false,
  removeLogs,
  withLogsRefreshBtn
}) => {
  const [detailsLogs, setDetailsLogs] = useState('')
  const [detailsAdditionalLogs, setDetailsAdditionalLogs] = useState('')
  const streamLogsRef = useRef()
  const streamAdditionalLogsRef = useRef()
  const logsAreLoading = useMemo(() => {
    return (
      functionsStore.logs.loading || functionsStore.nuclioLogs.loading || jobsStore.logs.loading
    )
  }, [functionsStore.logs.loading, functionsStore.nuclioLogs.loading, jobsStore.logs.loading])

  useEffect(() => {
    if (refreshLogs) {
      refreshLogs(item, item.project, setDetailsLogs, streamLogsRef)

      return () => {
        setDetailsLogs('')
        removeLogs()
      }
    }
  }, [item, refreshLogs, removeLogs, withLogsRefreshBtn])

  useEffect(() => {
    refreshAdditionalLogs &&
      refreshAdditionalLogs(item, item.project, setDetailsAdditionalLogs, streamAdditionalLogsRef)

    return () => {
      setDetailsAdditionalLogs('')
      removeAdditionalLogs && removeAdditionalLogs()
    }
  }, [item, withLogsRefreshBtn, refreshAdditionalLogs, removeAdditionalLogs])

  return logsAreLoading ? (
    <Loader />
  ) : !detailsLogs.length && !detailsAdditionalLogs.length ? (
    <NoData message={noDataMessage} />
  ) : (
    <div className="table__item-logs-container">
      {detailsLogs.length ? (
        <>
          {logsTitle && <h3>{logsTitle}</h3>}
          <Logs
            refreshLogs={() => refreshLogs(item, item.project, setDetailsLogs, streamLogsRef)}
            ref={streamLogsRef}
            withLogsRefreshBtn={withLogsRefreshBtn}
            detailsLogs={detailsLogs}
          />
        </>
      ) : null}
      {detailsAdditionalLogs.length ? (
        <>
          {additionalLogsTitle && <h3>{additionalLogsTitle}</h3>}
          <Logs
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
          />
        </>
      ) : null}
    </div>
  )
}

DetailsLogs.propTypes = {
  additionalLogsTitle: PropTypes.string,
  item: PropTypes.object.isRequired,
  logsTitle: PropTypes.string,
  noDataMessage: PropTypes.string,
  refreshAdditionalLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  refreshLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  removeAdditionalLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  removeLogs: PropTypes.func.isRequired,
  withLogsRefreshBtn: PropTypes.bool.isRequired
}

export default connect(({ functionsStore, jobsStore }) => ({
  functionsStore,
  jobsStore
}))(DetailsLogs)

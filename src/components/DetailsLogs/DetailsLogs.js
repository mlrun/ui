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

import Logs from './Logs'
import NoData from '../../common/NoData/NoData'

const DetailsLogs = ({
  functionsStore,
  item,
  jobsStore,
  refreshAdditionalLogs,
  refreshLogs,
  removeAdditionalLogs,
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
  const mainLogsAreLoading = useMemo(() => {
    return functionsStore.logs.loading || jobsStore.logs.loading
  }, [functionsStore.logs.loading, jobsStore.logs.loading])
  const additionalLogsAreLoading = useMemo(() => {
    return functionsStore.nuclioLogs.loading
  }, [functionsStore.nuclioLogs.loading])

  useEffect(() => {
    refreshLogs(item, item.project, setDetailsLogs, streamLogsRef)

    return () => {
      setDetailsLogs('')
      removeLogs()
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

  return !detailsLogs.length && !detailsAdditionalLogs.length && !logsAreLoading ? (
    <NoData />
  ) : (
    <div className="table__item-logs-container">
      {mainLogsAreLoading || detailsLogs.length ? (
        <Logs
          isLoading={logsAreLoading}
          refreshLogs={() => refreshLogs(item, item.project, setDetailsLogs, streamLogsRef)}
          removeLogs={removeLogs}
          item={item}
          ref={streamLogsRef}
          withLogsRefreshBtn={withLogsRefreshBtn}
          detailsLogs={detailsLogs}
          setDetailsLogs={setDetailsLogs}
        />
      ) : null}
      {refreshAdditionalLogs && (additionalLogsAreLoading || detailsAdditionalLogs.length) ? (
        <Logs
          isLoading={logsAreLoading}
          refreshLogs={() =>
            refreshAdditionalLogs(
              item,
              item.project,
              setDetailsAdditionalLogs,
              streamAdditionalLogsRef
            )
          }
          removeLogs={removeAdditionalLogs}
          item={item}
          ref={streamAdditionalLogsRef}
          withLogsRefreshBtn={withLogsRefreshBtn}
          detailsLogs={detailsAdditionalLogs}
          setDetailsLogs={setDetailsAdditionalLogs}
        />
      ) : null}
    </div>
  )
}

DetailsLogs.defaultProps = {
  refreshAdditionalLogs: false,
  removeAdditionalLogs: false
}

DetailsLogs.propTypes = {
  item: PropTypes.object.isRequired,
  refreshAdditionalLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  refreshLogs: PropTypes.func.isRequired,
  removeAdditionalLogs: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  removeLogs: PropTypes.func.isRequired,
  withLogsRefreshBtn: PropTypes.bool.isRequired
}

export default connect(({ functionsStore, jobsStore }) => ({
  functionsStore,
  jobsStore
}))(DetailsLogs)

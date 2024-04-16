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
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'
import { Button } from 'igz-controls/components'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

const DetailsLogs = ({
  item,
  refreshLogs,
  functionsStore,
  jobsStore,
  removeLogs,
  withLogsRefreshBtn
}) => {
  const [detailsLogs, setDetailsLogs] = useState('')
  const params = useParams()
  const streamLogsRef = useRef()

  useEffect(() => {
    refreshLogs(item, item.project, setDetailsLogs, streamLogsRef)

    return () => {
      setDetailsLogs('')
      removeLogs()
    }
  }, [item, refreshLogs, removeLogs, withLogsRefreshBtn])

  const handleScroll = event => {
    if (
      streamLogsRef.current &&
      event.target.scrollHeight - event.target.scrollTop - 1 < event.target.clientHeight
    ) {
      streamLogsRef.current()
    }
  }

  return !detailsLogs.length && !functionsStore.logs.loading && !jobsStore.logs.loading ? (
    <NoData />
  ) : (
    <div className="table__item_logs">
      <div className="table__item_logs-content" onScroll={handleScroll}>
        {detailsLogs}
      </div>
      <div className="table__item_logs-panel">
        {withLogsRefreshBtn && (
          <div className="logs-refresh">
            <Button
              icon={<RefreshIcon />}
              label=""
              tooltip="Refresh"
              onClick={() => {
                refreshLogs(item, params.projectName, setDetailsLogs, streamLogsRef)
              }}
            />
          </div>
        )}
        <div className="logs-loader">
          {(functionsStore.logs.loading || jobsStore.logs.loading) && (
            <Loader section secondary small />
          )}
        </div>
      </div>
    </div>
  )
}

DetailsLogs.propTypes = {
  item: PropTypes.object.isRequired,
  refreshLogs: PropTypes.func.isRequired,
  removeLogs: PropTypes.func.isRequired,
  withLogsRefreshBtn: PropTypes.bool.isRequired
}

export default connect(({ functionsStore, jobsStore }) => ({
  functionsStore,
  jobsStore
}))(DetailsLogs)

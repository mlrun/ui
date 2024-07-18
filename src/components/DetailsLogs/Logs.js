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
import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import { Button } from 'igz-controls/components'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

const Logs = React.forwardRef(({
  detailsLogs,
  isLoading,
  item,
  refreshLogs,
  removeLogs,
  setDetailsLogs,
  withLogsRefreshBtn
}, ref) => {
  const handleScroll = event => {
    if (
      ref.current &&
      event.target.scrollHeight - event.target.scrollTop - 1 < event.target.clientHeight
    ) {
      ref.current()
    }
  }

  return (
    <div className="table__item-logs">
      <div className="table__item-logs-content" onScroll={handleScroll}>
        {detailsLogs}
      </div>
      <div className="table__item-logs-panel">
        {withLogsRefreshBtn && (
          <div className="logs-refresh">
            <Button
              icon={<RefreshIcon />}
              label=""
              tooltip="Refresh"
              onClick={() => {
                refreshLogs()
              }}
            />
          </div>
        )}
        <div className="logs-loader">
          {isLoading && (
            <Loader section secondary small />
          )}
        </div>
      </div>
    </div>
  )
})

Logs.propTypes = {
  detailsLogs: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  refreshLogs: PropTypes.func.isRequired,
  removeLogs: PropTypes.func.isRequired,
  setDetailsLogs: PropTypes.func.isRequired,
  withLogsRefreshBtn: PropTypes.bool.isRequired
}

export default Logs

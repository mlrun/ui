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

import { Button, Loader } from 'igz-controls/components'
import NoData from '../../common/NoData/NoData'

import RefreshIcon from 'igz-controls/images/refresh.svg?react'

const Logs = React.forwardRef(
  ({ detailsLogs, isLoading, noDataMessage = '', refreshLogs, withLogsRefreshBtn }, ref) => {
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
          {!isLoading && !detailsLogs.length ? <NoData message={noDataMessage} /> : detailsLogs}
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
          {isLoading && (
            <div className="logs-loader">
              <Loader section secondary small />
            </div>
          )}
        </div>
      </div>
    )
  }
)

Logs.displayName = 'Logs'

Logs.propTypes = {
  detailsLogs: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  noDataMessage: PropTypes.string,
  refreshLogs: PropTypes.func.isRequired,
  withLogsRefreshBtn: PropTypes.bool.isRequired
}

export default Logs

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
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import AlertLogsModal from './AlertLogsModal'
import DetailsAlertsMetrics from './DetailsAlertsMetrics'
import DetailsInfo from '../DetailsInfo/DetailsInfo'
import DetailsLogs from '../DetailsLogs/DetailsLogs'
import { RoundedIcon } from 'iguazio.dashboard-react-controls/dist/components'

import { JOB, MODEL_ENDPOINT_RESULT } from '../../constants'
import { openPopUp } from 'iguazio.dashboard-react-controls/dist/utils/common.util'

import { ReactComponent as EnlargeIcon } from 'igz-controls/images/ml-enlarge.svg'

import '../DetailsInfo/detailsInfo.scss'

const DetailsDrillDownAlert = React.forwardRef(
  (
    { detailsStore, isDetailsPopUp, pageData, selectedItem, setChangesCounter, setChangesData },
    applyChangesRef
  ) => {
    const openAlertsLogsModal = useCallback(() => {
      openPopUp(AlertLogsModal, { selectedItem, pageData })
    }, [pageData, selectedItem])

    return (
      <>
        <DetailsInfo
          detailsStore={detailsStore}
          isDetailsPopUp={isDetailsPopUp}
          pageData={pageData}
          ref={applyChangesRef}
          selectedItem={selectedItem}
          setChangesCounter={setChangesCounter}
          setChangesData={setChangesData}
        />
        {pageData.details.entityType === JOB && (
          <>
            <div className="alert-row__details-alert-logs">
              <h3 className="item-info__header">Job Logs</h3>
              <div
                className="details-close-btn"
                data-testid="details-close-btn"
                onClick={openAlertsLogsModal}
              >
                <RoundedIcon tooltipText="Close" id="details-close">
                  <EnlargeIcon />
                </RoundedIcon>
              </div>
            </div>
            <DetailsLogs
              item={selectedItem}
              logsTitle={pageData.details.logsTitle}
              noDataMessage={pageData.details.logsNoDataMessage}
              refreshAdditionalLogs={pageData.details.refreshAdditionalLogs}
              refreshLogs={pageData.details.refreshLogs}
              removeAdditionalLogs={pageData.details.removeAdditionalLogs}
              removeLogs={() => {}}
              withLogsRefreshBtn
            />
          </>
        )}
        {pageData.details.entityType === MODEL_ENDPOINT_RESULT && (
          <DetailsAlertsMetrics selectedItem={selectedItem} />
        )}
      </>
    )
  }
)

DetailsDrillDownAlert.propTypes = {
  detailsStore: PropTypes.shape({}).isRequired,
  isDetailsPopUp: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setChangesData: PropTypes.func.isRequired,
  setChangesCounter: PropTypes.func.isRequired
}

DetailsInfo.displayName = 'DetailsDrillDownAlert'

export default React.memo(DetailsDrillDownAlert)

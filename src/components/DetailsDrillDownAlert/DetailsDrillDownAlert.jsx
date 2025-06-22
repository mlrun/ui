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
import { RoundedIcon } from 'igz-controls/components'

import { JOB, MODEL_ENDPOINT_RESULT } from '../../constants'
import { openPopUp } from 'igz-controls/utils/common.util'

import EnlargeIcon from 'igz-controls/images/ml-enlarge.svg?react'

import '../DetailsInfo/detailsInfo.scss'

const DetailsDrillDownAlert = React.forwardRef(
  ({ commonDetailsStore, formState, isDetailsPopUp, pageData, selectedItem }, applyChangesRef) => {
    const openAlertsLogsModal = useCallback(() => {
      openPopUp(AlertLogsModal, { selectedItem, pageData })
    }, [pageData, selectedItem])

    return (
      <>
        <DetailsInfo
          commonDetailsStore={commonDetailsStore}
          formState={formState}
          isDetailsPopUp={isDetailsPopUp}
          pageData={pageData}
          ref={applyChangesRef}
          selectedItem={selectedItem}
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
                <RoundedIcon id="full-view" tooltipText="Full view">
                  <EnlargeIcon />
                </RoundedIcon>
              </div>
            </div>
            <DetailsLogs
              item={selectedItem}
              noDataMessage={pageData.details.logsNoDataMessage}
              refreshLogs={pageData.details.refreshLogs}
              removeLogs={pageData.details.removeLogs}
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

DetailsDrillDownAlert.displayName = 'DetailsDrillDownAlert'

DetailsDrillDownAlert.propTypes = {
  commonDetailsStore: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  isDetailsPopUp: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired
}

export default React.memo(DetailsDrillDownAlert)

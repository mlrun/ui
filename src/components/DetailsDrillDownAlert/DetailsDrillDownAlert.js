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

import DetailsInfo from '../DetailsInfo/DetailsInfo'
import DetailsLogs from '../DetailsLogs/DetailsLogs'
import DetailsMetrics from '../DetailsMetrics/DetailsMetrics'

import { JOB, MODEL_ENDPOINT_RESULT } from '../../constants'

import '../DetailsInfo/detailsInfo.scss'

const DetailsDrillDownAlert = React.forwardRef(
  (
    { detailsStore, isDetailsPopUp, pageData, selectedItem, setChangesCounter, setChangesData },
    applyChangesRef
  ) => {
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
        )}

        {pageData.details.entityType === MODEL_ENDPOINT_RESULT && (
          <DetailsMetrics
            selectedItem={{
              metadata: {
                uid: '540bae4d7c7c437fa5b9f0657a4187db',
                project: 'kate-project-mm'
              }
            }}
          />
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

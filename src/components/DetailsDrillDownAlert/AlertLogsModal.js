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
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import DetailsLogs from '../DetailsLogs/DetailsLogs'
import { Modal } from 'igz-controls/components'

import { MODAL_MAX } from 'iguazio.dashboard-react-controls/dist/constants'

const AlertLogsModal = ({ isOpen, onResolve, pageData, selectedItem }) => {
  const location = useLocation()

  return (
    <Modal
      title="Job Logs"
      className="alerts-logs"
      show={isOpen}
      onClose={onResolve}
      size={MODAL_MAX}
      location={location}
    >
      <DetailsLogs
        item={selectedItem}
        logsTitle={pageData.details.logsTitle}
        noDataMessage={pageData.details.logsNoDataMessage}
        refreshAdditionalLogs={pageData.details.refreshAdditionalLogs}
        refreshLogs={pageData.details.refreshLogs}
        removeAdditionalLogs={pageData.details.removeAdditionalLogs}
        removeLogs={() => {}}
        subTitle="Job logs"
        show={true}
        withLogsRefreshBtn={false}
      />
    </Modal>
  )
}

AlertLogsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onResolve: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default AlertLogsModal

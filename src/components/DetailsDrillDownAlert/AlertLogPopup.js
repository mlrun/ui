import { useLocation } from 'react-router-dom'

import DetailsLogs from '../DetailsLogs/DetailsLogs'
import { Modal } from 'igz-controls/components'

import { MODAL_MAX } from 'iguazio.dashboard-react-controls/dist/constants'

const AlertLogsPopup = ({ isOpen, onResolve, pageData, selectedItem }) => {
  const location = useLocation()

  return (
    <Modal show={isOpen} onClose={onResolve} size={MODAL_MAX} location={location} noHeader>
      <h3 className="item-info__popup-header">Job Logs</h3>
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

export default AlertLogsPopup

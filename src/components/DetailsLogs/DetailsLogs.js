import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Refresh } from '../../images/refresh.svg'

const DetailsLogs = ({
  item,
  match,
  refreshLogs,
  functionsStore,
  jobsStore,
  removeLogs,
  withLogsRefreshBtn
}) => {
  const [detailsLogs, setDetailsLogs] = useState('')

  useEffect(() => {
    setDetailsLogs(jobsStore.logs.data || functionsStore.logs.data)

    return () => {
      setDetailsLogs('')
    }
  }, [functionsStore.logs.data, jobsStore.logs.data])

  useEffect(() => {
    if (withLogsRefreshBtn) {
      refreshLogs(item.uid, match.params.projectName)
    } else {
      refreshLogs(match.params.projectName, item.name, item.tag)
    }

    return () => {
      removeLogs()
    }
  }, [
    item.name,
    item.tag,
    item.uid,
    match.params.projectName,
    refreshLogs,
    removeLogs,
    withLogsRefreshBtn
  ])

  return (
    <div className="table__item_logs">
      {detailsLogs.length > 0 ? (
        <div className="table__item_logs__content">{detailsLogs}</div>
      ) : functionsStore.logs.loading || jobsStore.logs.loading ? (
        <Loader section secondary />
      ) : (
        <NoData />
      )}
      {withLogsRefreshBtn && (
        <button
          onClick={() => refreshLogs(item.uid, match.params.projectName)}
          className="logs_refresh"
        >
          <Refresh />
          Refresh
        </button>
      )}
    </div>
  )
}

DetailsLogs.propTypes = {
  item: PropTypes.object.isRequired,
  match: PropTypes.shape({}).isRequired,
  refreshLogs: PropTypes.func.isRequired,
  removeLogs: PropTypes.func.isRequired,
  withLogsRefreshBtn: PropTypes.bool.isRequired
}

export default connect(({ functionsStore, jobsStore }) => ({
  functionsStore,
  jobsStore
}))(DetailsLogs)

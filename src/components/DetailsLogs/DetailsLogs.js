import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Refresh } from '../../images/refresh.svg'

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

  useEffect(() => {
    setDetailsLogs(jobsStore.logs.data || functionsStore.logs.data)

    return () => {
      setDetailsLogs('')
    }
  }, [functionsStore.logs.data, jobsStore.logs.data])

  useEffect(() => {
    if (withLogsRefreshBtn) {
      refreshLogs(item.uid, params.projectName)
    } else {
      refreshLogs(params.projectName, item.name, item.tag)
    }

    return () => {
      removeLogs()
    }
  }, [
    item.name,
    item.tag,
    item.uid,
    params.projectName,
    refreshLogs,
    removeLogs,
    withLogsRefreshBtn
  ])

  return (
    <div className="table__item_logs">
      {functionsStore.logs.loading || jobsStore.logs.loading ? (
        <Loader section secondary />
      ) : detailsLogs.length > 0 ? (
        <div className="table__item_logs__content">{detailsLogs}</div>
      ) : (
        <NoData />
      )}
      {withLogsRefreshBtn && (
        <button onClick={() => refreshLogs(item.uid, params.projectName)} className="logs_refresh">
          <Refresh />
          Refresh
        </button>
      )}
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

import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'

import NoData from '../../common/NoData/NoData'

import { ReactComponent as Refresh } from '../../images/refresh.svg'

const DetailsLogs = ({
  jobsStore,
  fetchJobLogs,
  match,
  item,
  removeJobLogs
}) => {
  const refreshLogs = useCallback(() => {
    fetchJobLogs(item.uid, match.params.projectName)
  }, [fetchJobLogs, item.uid, match.params.projectName])

  useEffect(() => {
    refreshLogs()
    return () => {
      removeJobLogs()
    }
  }, [refreshLogs, removeJobLogs])
  return (
    <div className="table__item_logs">
      {jobsStore.logs.length > 0 ? (
        <div className="table__item_logs__content">{jobsStore.logs}</div>
      ) : jobsStore.loading ? null : (
        <NoData />
      )}
      <button onClick={refreshLogs} className="logs_refresh">
        <Refresh />
        Refresh
      </button>
    </div>
  )
}

DetailsLogs.propTypes = {
  fetchJobLogs: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(DetailsLogs)

import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'

import Loader from '../../common/Loader/Loader'

import refreshIcon from '../../images/refresh-logs.png'

const JobInternalLogs = ({ jobsStore, fetchJobLogs }) => {
  const [loading, setLoading] = useState(false)

  const refreshLogs = useCallback(
    noCahche => {
      if (noCahche || jobsStore.logs.length === 0) {
        setLoading(true)
        fetchJobLogs(jobsStore.selectedJob.uid).then(() => setLoading(false))
      }
    },
    [fetchJobLogs, jobsStore.logs.length, jobsStore.selectedJob.uid]
  )

  useEffect(() => {
    refreshLogs()
  }, [refreshLogs])

  return (
    <div className="jobs__table__item_logs">
      {loading && <Loader />}
      <div className="jobs__table__item_logs__content">{jobsStore.logs}</div>
      <button onClick={refreshLogs}>
        <img src={refreshIcon} alt="Refresh icon" />
        Refresh
      </button>
    </div>
  )
}

JobInternalLogs.propTypes = {
  fetchJobLogs: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(JobInternalLogs)

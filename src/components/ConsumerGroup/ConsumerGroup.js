import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PageHeader from '../../elements/PageHeader/PageHeader'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'
import Search from '../../common/Search/Search'
import Table from '../Table/Table'

import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import nuclioActions from '../../actions/nuclio'
import { generatePageData } from './consumerGroup.util.js'
import { getNoDataMessage } from '../../layout/Content/content.util'

import { ReactComponent as RefreshIcon } from '../../images/refresh.svg'

const ConsumerGroup = ({
  fetchNuclioV3ioStreamShardLags,
  match,
  nuclioStore,
  resetV3ioStreamShardLagsError,
  setNotification
}) => {
  const [currentV3ioStream, setCurrentV3ioStream] = useState([])
  const [
    filteredV3ioStreamShardLags,
    setFilteredV3ioStreamShardLags
  ] = useState([])
  const [filterByName, setFilterByName] = useState('')

  useEffect(() => {
    const v3ioStream = nuclioStore.v3ioStreams.parsedData.find(
      stream => stream.consumerGroup === match.params.consumerGroupName
    )

    if (v3ioStream) {
      setCurrentV3ioStream(v3ioStream)
    }
  }, [match.params.consumerGroupName, nuclioStore.v3ioStreams])

  const refreshConsumerGroup = useCallback(
    currentV3ioStream => {
      const fetchV3ioStreamBody = {
        consumerGroup: currentV3ioStream.consumerGroup,
        containerName: currentV3ioStream.containerName,
        streamPath: currentV3ioStream.streamPath
      }
      fetchNuclioV3ioStreamShardLags(
        match.params.projectName,
        fetchV3ioStreamBody
      )
    },
    [fetchNuclioV3ioStreamShardLags, match.params.projectName]
  )

  useEffect(() => {
    if (!isEmpty(currentV3ioStream)) {
      refreshConsumerGroup(currentV3ioStream)
    }
  }, [currentV3ioStream, refreshConsumerGroup])

  useEffect(() => {
    setFilteredV3ioStreamShardLags(
      nuclioStore.v3ioStreamShardLags.parsedData.filter(shardLag =>
        filterByName ? shardLag.shardLagId.includes(filterByName) : true
      )
    )
  }, [nuclioStore.v3ioStreamShardLags.parsedData, filterByName])

  useEffect(() => {
    if (!isEmpty(currentV3ioStream) && nuclioStore.v3ioStreamShardLags.error) {
      setNotification({
        status: nuclioStore.v3ioStreamShardLags.error?.response?.status || 400,
        id: Math.random(),
        message: 'Failed to fetch v3io stream shard lags',
        retry: () => refreshConsumerGroup(currentV3ioStream)
      })
      resetV3ioStreamShardLagsError()
    }
  }, [
    currentV3ioStream,
    nuclioStore.v3ioStreamShardLags.error,
    refreshConsumerGroup,
    resetV3ioStreamShardLagsError,
    setNotification
  ])

  const pageData = useCallback(generatePageData(), [])

  return (
    <>
      <PageHeader
        title={
          match.params.consumerGroupName ?? currentV3ioStream.consumerGroup
        }
        description={currentV3ioStream.streamName}
        backLink={`/projects/${match.params.projectName}/monitor/consumer-groups`}
      />
      <div className="page-actions">
        <Search
          wrapperClassName="search-input-wrapper"
          onChange={searchTerm => setFilterByName(searchTerm.toLowerCase())}
          placeholder="Search by shard name..."
          value={filterByName}
        />
        <RoundedIcon
          onClick={() => refreshConsumerGroup(currentV3ioStream)}
          tooltipText="Refresh"
        >
          <RefreshIcon />
        </RoundedIcon>
      </div>
      <Table
        actionsMenu={[]}
        content={filteredV3ioStreamShardLags}
        match={match}
        pageData={pageData}
      />
      {!nuclioStore.v3ioStreams.loading &&
        !nuclioStore.v3ioStreamShardLags.loading &&
        nuclioStore.v3ioStreamShardLags.parsedData.length === 0 && (
          <NoData message={getNoDataMessage()} />
        )}
      {(nuclioStore.v3ioStreams.loading ||
        nuclioStore.v3ioStreamShardLags.loading) && <Loader />}
    </>
  )
}

ConsumerGroup.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ filtersStore, nuclioStore }) => ({
    filtersStore,
    nuclioStore
  }),
  {
    ...filtersActions,
    ...notificationActions,
    ...nuclioActions
  }
)(ConsumerGroup)

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
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PageHeader from '../../elements/PageHeader/PageHeader'
import Search from '../../common/Search/Search'
import Table from '../Table/Table'
import { RoundedIcon } from 'igz-controls/components'

import nuclioActions from '../../actions/nuclio'
import { generatePageData } from './consumerGroup.util.js'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { setNotification } from '../../reducers/notificationReducer'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

const ConsumerGroup = ({
  fetchNuclioV3ioStreamShardLags,
  nuclioStore,
  resetV3ioStreamShardLagsError
}) => {
  const [currentV3ioStream, setCurrentV3ioStream] = useState([])
  const [filteredV3ioStreamShardLags, setFilteredV3ioStreamShardLags] = useState([])
  const [filterByName, setFilterByName] = useState('')
  const params = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    const v3ioStream = nuclioStore.v3ioStreams.parsedData.find(
      stream =>
        stream.functionName === params.functionName && stream.streamName === params.streamName
    )

    if (v3ioStream) {
      setCurrentV3ioStream(v3ioStream)
    }
  }, [nuclioStore.v3ioStreams.parsedData, params.functionName, params.streamName])

  const refreshConsumerGroup = useCallback(
    currentV3ioStream => {
      const fetchV3ioStreamBody = {
        consumerGroup: currentV3ioStream.consumerGroup,
        containerName: currentV3ioStream.containerName,
        streamPath: currentV3ioStream.streamPath
      }
      fetchNuclioV3ioStreamShardLags(params.projectName, fetchV3ioStreamBody)
    },
    [fetchNuclioV3ioStreamShardLags, params.projectName]
  )

  useEffect(() => {
    if (!isEmpty(currentV3ioStream)) {
      refreshConsumerGroup(currentV3ioStream)
    }
  }, [currentV3ioStream, refreshConsumerGroup])

  useEffect(() => {
    setFilteredV3ioStreamShardLags(
      nuclioStore.v3ioStreamShardLags.parsedData.filter(shardLag =>
        filterByName ? shardLag.shardLagId.toLowerCase().includes(filterByName) : true
      )
    )
  }, [nuclioStore.v3ioStreamShardLags.parsedData, filterByName])

  useEffect(() => {
    if (!isEmpty(currentV3ioStream) && nuclioStore.v3ioStreamShardLags.error) {
      dispatch(
        setNotification({
          status: nuclioStore.v3ioStreamShardLags.error?.response?.status || 400,
          id: Math.random(),
          message: 'Failed to fetch v3io stream shard lags',
          retry: () => refreshConsumerGroup(currentV3ioStream)
        })
      )
      resetV3ioStreamShardLagsError()
    }
  }, [
    currentV3ioStream,
    dispatch,
    nuclioStore.v3ioStreamShardLags.error,
    refreshConsumerGroup,
    resetV3ioStreamShardLagsError
  ])

  const pageData = useMemo(() => generatePageData(), [])

  return (
    <>
      {!isEmpty(currentV3ioStream) && (
        <PageHeader
          title={currentV3ioStream.consumerGroup}
          description={currentV3ioStream.streamName}
          backLink={`/projects/${params.projectName}/monitor/consumer-groups`}
        />
      )}
      <div className="page-actions">
        <Search
          wrapperClassName="search-input-wrapper"
          onChange={searchTerm => setFilterByName(searchTerm.toLowerCase())}
          placeholder="Search by shard name..."
          value={filterByName}
        />
        <RoundedIcon onClick={() => refreshConsumerGroup(currentV3ioStream)} tooltipText="Refresh">
          <RefreshIcon />
        </RoundedIcon>
      </div>
      <Table actionsMenu={[]} content={filteredV3ioStreamShardLags} pageData={pageData} />
      {!nuclioStore.v3ioStreams.loading &&
        !nuclioStore.v3ioStreamShardLags.loading &&
        nuclioStore.v3ioStreamShardLags.parsedData.length === 0 && (
          <NoData message={getNoDataMessage()} />
        )}
      {(nuclioStore.v3ioStreams.loading || nuclioStore.v3ioStreamShardLags.loading) && <Loader />}
    </>
  )
}

export default connect(
  ({ nuclioStore }) => ({
    nuclioStore
  }),
  {
    ...nuclioActions
  }
)(ConsumerGroup)

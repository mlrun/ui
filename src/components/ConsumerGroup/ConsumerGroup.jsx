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
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'

import ConsumerGroupShardLagTableRow from '../../elements/ConsumerGroupShardLagTableRow/ConsumerGroupShardLagTableRow'
import NoData from '../../common/NoData/NoData'
import PageHeader from '../../elements/PageHeader/PageHeader'
import Search from '../../common/Search/Search'
import Table from '../Table/Table'
import { RoundedIcon, Loader } from 'igz-controls/components'

import {
  CONSUMER_GROUP_PAGE,
  NAME_FILTER
} from '../../constants.js'
import createConsumerGroupContent from '../../utils/createConsumerGroupContent'
import { fetchNuclioV3ioStreamShardLags, resetV3ioStreamShardLagsError } from '../../reducers/nuclioReducer.js'
import { generatePageData } from './consumerGroup.util.js'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import RefreshIcon from 'igz-controls/images/refresh.svg?react'


const ConsumerGroup = () => {
  const [currentV3ioStream, setCurrentV3ioStream] = useState([])
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [filteredV3ioStreamShardLags, setFilteredV3ioStreamShardLags] = useState([])
  const filtersStore = useSelector(store => store.filtersStore)
  const nuclioStore = useSelector((store) => store.nuclioStore)
  const [localFilters, setLocalFilters] = useState({ [NAME_FILTER]: '' })
  const params = useParams()
  const dispatch = useDispatch()

  const filtersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:' }
    }
  }, [])

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
      setRequestErrorMessage('')
      dispatch(fetchNuclioV3ioStreamShardLags({ project: params.projectName, body: fetchV3ioStreamBody }))
    },
    [dispatch, params.projectName]
  )

  useEffect(() => {
    if (!isEmpty(currentV3ioStream)) {
      refreshConsumerGroup(currentV3ioStream)
    }
  }, [currentV3ioStream, refreshConsumerGroup])

  useEffect(() => {
    setFilteredV3ioStreamShardLags(
      nuclioStore.v3ioStreamShardLags.parsedData.filter(shardLag =>
        localFilters[NAME_FILTER]
          ? shardLag.shardLagId.toLowerCase().includes(localFilters[NAME_FILTER])
          : true
      )
    )
  }, [localFilters, nuclioStore.v3ioStreamShardLags.parsedData])

  useEffect(() => {
    if (!isEmpty(currentV3ioStream) && nuclioStore.v3ioStreamShardLags.error) {
      showErrorNotification(
        dispatch,
        nuclioStore.v3ioStreamShardLags.error,
        'Failed to fetch v3io stream shard lags',
        '',
        () => refreshConsumerGroup(currentV3ioStream),
        setRequestErrorMessage
      )
      dispatch(resetV3ioStreamShardLagsError())
    }
  }, [currentV3ioStream, dispatch, nuclioStore.v3ioStreamShardLags.error, refreshConsumerGroup])

  const pageData = useMemo(() => generatePageData(), [])

  const tableContent = useMemo(
    () => createConsumerGroupContent(filteredV3ioStreamShardLags),
    [filteredV3ioStreamShardLags]
  )

  const searchOnChangeHandler = value => {
    setLocalFilters({ [NAME_FILTER]: value.toLowerCase() })
  }

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
          onChange={searchOnChangeHandler}
          placeholder="Search by shard name..."
          value={localFilters[NAME_FILTER]}
        />
        <RoundedIcon
          onClick={() => refreshConsumerGroup(currentV3ioStream)}
          tooltipText="Refresh"
          id="consumer-group-refresh"
        >
          <RefreshIcon />
        </RoundedIcon>
      </div>
      <Table
        actionsMenu={[]}
        hideActionsMenu
        pageData={pageData}
        tableHeaders={pageData.tableHeaders}
      >
        {tableContent.map((rowItem, index) => {
          return (
            <ConsumerGroupShardLagTableRow key={index} content={tableContent} rowItem={rowItem} />
          )
        })}
      </Table>
      {!nuclioStore.v3ioStreams.loading &&
        !nuclioStore.v3ioStreamShardLags.loading &&
        filteredV3ioStreamShardLags.length === 0 && (
          <NoData
            message={getNoDataMessage(
              localFilters,
              filtersConfig,
              requestErrorMessage,
              CONSUMER_GROUP_PAGE,
              null,
              filtersStore
            )}
          />
        )}
      {(nuclioStore.v3ioStreams.loading || nuclioStore.v3ioStreamShardLags.loading) && <Loader />}
    </>
  )
}

export default ConsumerGroup

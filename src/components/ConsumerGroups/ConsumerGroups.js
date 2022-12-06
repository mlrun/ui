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
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PageHeader from '../../elements/PageHeader/PageHeader'
import Search from '../../common/Search/Search'
import Table from '../Table/Table'

import { GROUP_BY_NONE } from '../../constants'
import { generatePageData } from './consumerGroups.util.js'
import { setFilters } from '../../reducers/filtersReducer'

const ConsumerGroups = () => {
  const [filteredV3ioStreams, setFilteredV3ioStreams] = useState([])
  const [filterByName, setFilterByName] = useState('')
  const nuclioStore = useSelector(store => store.nuclioStore)
  const params = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  useEffect(() => {
    setFilteredV3ioStreams(
      nuclioStore.v3ioStreams.parsedData.filter(v3ioStreamData =>
        filterByName ? v3ioStreamData.consumerGroup.toLowerCase().includes(filterByName) : true
      )
    )
  }, [nuclioStore.v3ioStreams.parsedData, filterByName])

  const pageData = useMemo(() => generatePageData(), [])

  return (
    <>
      <PageHeader
        title="Consumer groups (v3io stream)"
        description="This report displays the project's consumer groups for Iguazio v3io streams"
        backLink={`/projects/${params.projectName}/monitor`}
      />
      <div className="page-actions">
        <Search
          wrapperClassName="search-input-wrapper"
          onChange={searchTerm => setFilterByName(searchTerm.toLowerCase())}
          placeholder="Search consumer groups..."
          value={filterByName}
        />
      </div>
      <Table actionsMenu={[]} content={filteredV3ioStreams} pageData={pageData} />
      {!nuclioStore.v3ioStreams.loading && nuclioStore.v3ioStreams.parsedData.length === 0 && (
        <NoData message="You haven’t created any consumer group yet" />
      )}
      {nuclioStore.v3ioStreams.loading && <Loader />}
    </>
  )
}

export default ConsumerGroups

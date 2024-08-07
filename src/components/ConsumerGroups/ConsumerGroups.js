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
import { useParams, useOutletContext } from 'react-router-dom'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PageHeader from '../../elements/PageHeader/PageHeader'
import Search from '../../common/Search/Search'
import Table from '../Table/Table'
import ConsumerGroupTableRow from '../../elements/ConsumerGroupTableRow/ConsumerGroupTableRow'

import createConsumerGroupsContent from '../../utils/createConsumerGroupsContent'
import {
  CONSUMER_GROUPS_FILTER,
  CONSUMER_GROUPS_PAGE,
  FILTER_MENU,
  GROUP_BY_NONE,
  NAME_FILTER
} from '../../constants'
import { generatePageData } from './consumerGroups.util.js'
import { setFilters, setFiltersValues } from '../../reducers/filtersReducer'
import { getNoDataMessage } from '../../utils/getNoDataMessage.js'

const ConsumerGroups = () => {
  const [filteredV3ioStreams, setFilteredV3ioStreams] = useState([])
  const nuclioStore = useSelector(store => store.nuclioStore)
  const params = useParams()
  const dispatch = useDispatch()
  const filtersStore = useSelector(store => store.filtersStore)
  const nameFilter = useSelector(
    store => store.filtersStore[FILTER_MENU][CONSUMER_GROUPS_FILTER][NAME_FILTER]
  )
  const [requestErrorMessage] = useOutletContext()

  const filtersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:' }
    }
  }, [])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  useEffect(() => {
    setFilteredV3ioStreams(
      nuclioStore.v3ioStreams.parsedData.filter(v3ioStreamData =>
        nameFilter ? v3ioStreamData.consumerGroup.toLowerCase().includes(nameFilter) : true
      )
    )
  }, [nuclioStore.v3ioStreams.parsedData, nameFilter])

  const pageData = useMemo(() => generatePageData(), [])

  const tableContent = useMemo(
    () => createConsumerGroupsContent(filteredV3ioStreams, params),
    [filteredV3ioStreams, params]
  )

  const searchOnChangeHandler = value => {
    dispatch(
      setFiltersValues({
        name: CONSUMER_GROUPS_FILTER,
        value: { [NAME_FILTER]: value.toLowerCase() }
      })
    )
  }

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
          onChange={searchOnChangeHandler}
          placeholder="Search consumer groups..."
          value={nameFilter}
        />
      </div>
      <Table
        actionsMenu={[]}
        hideActionsMenu
        pageData={pageData}
        tableHeaders={pageData.tableHeaders}
      >
        {tableContent.map((rowItem, index) => {
          return <ConsumerGroupTableRow key={index} content={tableContent} rowItem={rowItem} />
        })}
      </Table>
      {!nuclioStore.v3ioStreams.loading && filteredV3ioStreams.length === 0 && (
        <NoData
          message={getNoDataMessage(
            filtersStore,
            filtersConfig,
            requestErrorMessage ||
              (!nuclioStore.v3ioStreams.parsedData?.length &&
                'You haven’t created any consumer group yet'),
            CONSUMER_GROUPS_PAGE,
            null,
            CONSUMER_GROUPS_FILTER
          )}
        />
      )}
      {nuclioStore.v3ioStreams.loading && <Loader />}
    </>
  )
}

export default ConsumerGroups

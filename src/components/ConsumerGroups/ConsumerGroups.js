import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PageHeader from '../../elements/PageHeader/PageHeader'
import Search from '../../common/Search/Search'
import Table from '../Table/Table'

import filtersActions from '../../actions/filters'
import nuclioActions from '../../actions/nuclio'
import { GROUP_BY_NONE } from '../../constants'
import { generatePageData } from './consumerGroups.util.js'
import { getNoDataMessage } from '../../layout/Content/content.util'

const ConsumerGroups = ({ nuclioStore, setFilters }) => {
  const [filteredV3ioStreams, setFilteredV3ioStreams] = useState([])
  const [filterByName, setFilterByName] = useState('')
  const params = useParams()

  useEffect(() => {
    setFilters({ groupBy: GROUP_BY_NONE })
  }, [setFilters])

  useEffect(() => {
    setFilteredV3ioStreams(
      nuclioStore.v3ioStreams.parsedData.filter(v3ioStremData =>
        filterByName ? v3ioStremData.consumerGroup.includes(filterByName) : true
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
      <Table
        actionsMenu={[]}
        content={filteredV3ioStreams}
        pageData={pageData}
      />
      {!nuclioStore.v3ioStreams.loading &&
        nuclioStore.v3ioStreams.parsedData.length === 0 && (
          <NoData message={getNoDataMessage()} />
        )}
      {nuclioStore.v3ioStreams.loading && <Loader />}
    </>
  )
}

export default connect(
  ({ filtersStore, nuclioStore }) => ({
    filtersStore,
    nuclioStore
  }),
  {
    ...filtersActions,
    ...nuclioActions
  }
)(ConsumerGroups)

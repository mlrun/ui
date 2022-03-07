import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PageHeader from '../../elements/PageHeader/PageHeader'
import Search from '../../common/Search/Search'
import Table from '../Table/Table'
import YamlModal from '../../common/YamlModal/YamlModal'

import filtersActions from '../../actions/filters'
import nuclioActions from '../../actions/nuclio'
import { GROUP_BY_NONE } from '../../constants'
import { generatePageData } from './consumerGroups.util.js'
import { getNoDataMessage } from '../../layout/Content/content.util'
import { useYaml } from '../../hooks/yaml.hook'

import { ReactComponent as Yaml } from '../../images/yaml.svg'

const ConsumerGroups = ({ match, nuclioStore, setFilters }) => {
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [filteredV3ioStreams, setFilteredV3ioStreams] = useState([])
  const [filterByName, setFilterByName] = useState('')

  useEffect(() => {
    setFilters({ groupBy: GROUP_BY_NONE })
  }, [setFilters])

  const actionsMenu = useMemo(() => {
    return [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ]
  }, [toggleConvertedYaml])

  useEffect(() => {
    setFilteredV3ioStreams(
      nuclioStore.v3ioStreams.parsedData.filter(v3ioStremData =>
        filterByName ? v3ioStremData.consumerGroup.includes(filterByName) : true
      )
    )
  }, [nuclioStore.v3ioStreams.parsedData, filterByName])

  const pageData = useCallback(generatePageData(), [])

  return (
    <>
      <PageHeader
        title="Consumer groups (v3io stream)"
        description="This report displays the project's consumer groups for Iguazio v3io streams"
        backLink={`/projects/${match.params.projectName}/monitor`}
      />
      <div className="page-actions">
        <Search
          wrapperClassName="search-input-wrapper"
          onChange={setFilterByName}
          placeholder="Search consumer groups..."
          value={filterByName}
        />
      </div>
      <Table
        actionsMenu={actionsMenu}
        content={filteredV3ioStreams}
        match={match}
        pageData={pageData}
      />
      {convertedYaml.length > 0 && (
        <YamlModal
          convertedYaml={convertedYaml}
          toggleConvertToYaml={toggleConvertedYaml}
        />
      )}
      {!nuclioStore.v3ioStreams.loading &&
        nuclioStore.v3ioStreams.parsedData.length === 0 && (
          <NoData message={getNoDataMessage()} />
        )}
      {nuclioStore.v3ioStreams.loading && <Loader />}
    </>
  )
}

ConsumerGroups.propTypes = {
  match: PropTypes.shape({}).isRequired
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

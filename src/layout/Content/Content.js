import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'
import { isEqual } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'

import { JOBS_PAGE, ARTIFACTS_PAGE, FUNCTIONS_PAGE } from '../../constants'

import './content.scss'
import { formatDatetime } from '../../utils'

const Content = ({
  content,
  detailsMenu,
  filters,
  groupFilter,
  handleCancel,
  handleSelectItem,
  loading,
  match,
  refresh,
  page,
  selectedItem,
  setGroupFilter,
  setShowUntagged,
  setStateFilter,
  showUntagged,
  stateFilter,
  tableHeaders,
  yamlContent
}) => {
  const [convertedYaml, setConvertedYaml] = useState('')
  const [expandedItems, setExpandedItems] = useState([])
  const [expand, setExpand] = useState(false)
  const [groupedByName, setGroupedByName] = useState({})

  useEffect(() => {
    if (groupFilter === 'name') {
      const groupedFunctions = {}

      content.forEach(func => {
        groupedFunctions[func.name]
          ? groupedFunctions[func.name].push(func)
          : (groupedFunctions[func.name] = [func])
      })

      setGroupedByName(groupedFunctions)
    } else if (groupFilter === 'none') {
      const rows = [...document.getElementsByClassName('parent-row')]

      rows.forEach(row => row.classList.remove('parent-row-expanded'))

      setExpand(false)
      setGroupedByName({})
    }

    return () => {
      setGroupedByName({})
      setExpand(false)
    }
  }, [groupFilter, setGroupedByName, match.params.projectName, content])

  const toggleConvertToYaml = item => {
    if (convertedYaml.length > 0) {
      return setConvertedYaml('')
    }
    const jobJson =
      page === JOBS_PAGE &&
      yamlContent.filter(job => isEqual(job.metadata.uid, item.uid))[0]

    const functionJson =
      page === FUNCTIONS_PAGE &&
      yamlContent.filter(
        func =>
          isEqual(func.metadata.hash, item.hash) &&
          isEqual(
            formatDatetime(new Date(func.metadata.updated)),
            formatDatetime(new Date(item.updated))
          )
      )[0]
    const artifactJson =
      page === ARTIFACTS_PAGE &&
      yamlContent.filter(yamlContentItem =>
        isEqual(yamlContentItem.key, item.db_key)
      )[0].data

    switch (page) {
      case JOBS_PAGE:
        return setConvertedYaml(
          yaml.dump(jobJson, {
            lineWidth: -1
          })
        )
      case ARTIFACTS_PAGE:
        return setConvertedYaml(
          yaml.dump(artifactJson, {
            lineWidth: -1
          })
        )
      default:
        return setConvertedYaml(
          yaml.safeDump(functionJson, {
            lineWidth: -1
          })
        )
    }
  }

  const handleExpandRow = (e, item) => {
    const parentRow = e.target.closest('.parent-row')

    if (parentRow.classList.contains('parent-row-expanded')) {
      const newArray = expandedItems.filter(
        expanded => expanded.name.value !== item.name.value
      )

      parentRow.classList.remove('parent-row-expanded')

      setExpandedItems(newArray)
    } else {
      parentRow.classList.remove('active')
      parentRow.classList.add('parent-row-expanded')

      setExpandedItems([...expandedItems, item])
    }
  }

  const handleExpandAll = () => {
    if (groupFilter === 'name') {
      const rows = [...document.getElementsByClassName('parent-row')]

      if (expand) {
        rows.forEach(row => row.classList.remove('parent-row-expanded'))

        setExpand(false)
      } else {
        rows.forEach(row => row.classList.add('parent-row-expanded'))

        setExpand(true)
      }
    }
  }

  return (
    <>
      <div className="content__header">
        <Breadcrumbs match={match} onClick={handleCancel} />
        <PageActionsMenu match={match} page={page} />
      </div>
      <div className={`content ${loading && 'isLoading'}`}>
        <ContentMenu />
        <div className="content__action-bar">
          <FilterMenu
            expand={expand}
            filters={filters}
            groupFilter={groupFilter}
            handleExpandAll={handleExpandAll}
            setGroupFilter={setGroupFilter}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
            setShowUntagged={setShowUntagged}
            showUntagged={showUntagged}
            match={match}
            onChange={refresh}
            page={page}
          />
        </div>
        <YamlModal
          convertedYaml={convertedYaml}
          toggleConvertToYaml={toggleConvertToYaml}
        />
        <div className="table-container">
          {content.length !== 0 ? (
            <Table
              content={content}
              detailsMenu={detailsMenu}
              groupFilter={groupFilter}
              groupedByName={groupedByName}
              handleCancel={handleCancel}
              handleExpandRow={handleExpandRow}
              handleSelectItem={handleSelectItem}
              match={match}
              page={page}
              selectedItem={selectedItem}
              toggleConvertToYaml={toggleConvertToYaml}
              tableHeaders={tableHeaders}
            />
          ) : loading ? null : (
            <NoData />
          )}
        </div>
      </div>
    </>
  )
}

Content.defaultProps = {
  filters: [],
  groupFilter: null,
  selectedItem: {},
  setGroupFilter: null,
  setShowUntagged: null,
  setStateFilter: null,
  showUntagged: '',
  stateFilter: null
}

Content.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.arrayOf(PropTypes.string),
  groupFilter: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  setGroupFilter: PropTypes.func,
  setShowUntagged: PropTypes.func,
  setStateFilter: PropTypes.func,
  showUntagged: PropTypes.string,
  stateFilter: PropTypes.string,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  yamlContent: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Content

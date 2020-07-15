import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'
import { isEqual } from 'lodash'
import classnames from 'classnames'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'

import { JOBS_PAGE, ARTIFACTS_PAGE, FUNCTIONS_PAGE } from '../../constants'

import { formatDatetime } from '../../utils'

import './content.scss'

const Content = ({
  content,
  groupFilter,
  handleCancel,
  handleSelectItem,
  loading,
  match,
  openPopupDialog,
  pageData,
  refresh,
  selectedItem,
  setGroupFilter,
  setLoading,
  setStateFilter,
  showUntagged,
  stateFilter,
  toggleShowUntagged,
  yamlContent
}) => {
  const [convertedYaml, setConvertedYaml] = useState('')
  const [expandedItems, setExpandedItems] = useState([])
  const [expand, setExpand] = useState(false)
  const [groupedByName, setGroupedByName] = useState({})
  const [groupedByWorkflow, setGroupedByWorkflow] = useState({})

  const contentClassName = classnames(
    'content',
    loading && 'isLoading',
    pageData.page === JOBS_PAGE && 'content_with-menu'
  )

  const handleGroupByName = useCallback(() => {
    const groupedItems = {}

    content.forEach(contentItem => {
      groupedItems[contentItem.name]
        ? groupedItems[contentItem.name].push(contentItem)
        : (groupedItems[contentItem.name] = [contentItem])
    })

    setGroupedByName(groupedItems)
    setGroupedByWorkflow({})
  }, [content])

  const handleGroupByNone = useCallback(() => {
    const rows = [...document.getElementsByClassName('parent-row')]

    rows.forEach(row => row.classList.remove('parent-row-expanded'))

    setExpand(false)
    setGroupedByName({})
    setGroupedByWorkflow({})
  }, [])

  const handleGroupByWorkflow = useCallback(() => {
    const groupedItems = {}

    content.forEach(contentItem => {
      contentItem.labels.forEach(label => {
        let workflowLabel = label.match('workflow')

        if (workflowLabel) {
          let workflowId = workflowLabel.input.slice('workflow'.length + 2)

          groupedItems[workflowId]
            ? groupedItems[workflowId].push(contentItem)
            : (groupedItems[workflowId] = [contentItem])
        }
      })
    })

    setGroupedByWorkflow(groupedItems)
    setGroupedByName({})
  }, [content])

  useEffect(() => {
    if (groupFilter === 'name') {
      handleGroupByName()
    } else if (groupFilter === 'none') {
      handleGroupByNone()
    } else if (groupFilter === 'workflow') {
      handleGroupByWorkflow()
    }

    return () => {
      setGroupedByName({})
      setGroupedByWorkflow({})
      setExpand(false)
    }
  }, [groupFilter, handleGroupByName, handleGroupByWorkflow, handleGroupByNone])

  const toggleConvertToYaml = item => {
    if (convertedYaml.length > 0) {
      return setConvertedYaml('')
    }

    const jobJson =
      pageData.page === JOBS_PAGE &&
      yamlContent.filter(job => isEqual(job.metadata.uid, item.uid))[0]
    const functionJson =
      pageData.page === FUNCTIONS_PAGE &&
      yamlContent.filter(
        func =>
          isEqual(func.metadata.hash, item.hash) &&
          isEqual(
            formatDatetime(new Date(func.metadata.updated)),
            formatDatetime(new Date(item.updated))
          )
      )[0]
    const artifactJson =
      pageData.page === ARTIFACTS_PAGE &&
      yamlContent.filter(yamlContentItem =>
        isEqual(yamlContentItem.key, item.db_key)
      )[0].data

    setConvertedYaml(
      yaml.dump(
        pageData.page === JOBS_PAGE
          ? jobJson
          : pageData.page === ARTIFACTS_PAGE
          ? artifactJson
          : functionJson,
        { lineWidth: -1 }
      )
    )
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
      parentRow.classList.remove('row_active')
      parentRow.classList.add('parent-row-expanded')

      setExpandedItems([...expandedItems, item])
    }
  }

  const handleExpandAll = () => {
    if (groupFilter !== 'none') {
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
        <PageActionsMenu
          match={match}
          page={pageData.page}
          onClick={openPopupDialog}
        />
      </div>
      <div className={contentClassName}>
        {pageData.page === JOBS_PAGE && <ContentMenu />}
        <div className="content__action-bar">
          <FilterMenu
            expand={expand}
            filters={pageData.filters}
            groupFilter={groupFilter}
            handleExpandAll={handleExpandAll}
            match={match}
            onChange={refresh}
            page={pageData.page}
            setGroupFilter={setGroupFilter}
            setStateFilter={setStateFilter}
            showUntagged={showUntagged}
            stateFilter={stateFilter}
            toggleShowUntagged={toggleShowUntagged}
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
              groupFilter={groupFilter}
              groupedByName={groupedByName}
              groupedByWorkflow={groupedByWorkflow}
              handleCancel={handleCancel}
              handleExpandRow={handleExpandRow}
              handleSelectItem={handleSelectItem}
              match={match}
              pageData={pageData}
              selectedItem={selectedItem}
              setLoading={setLoading}
              toggleConvertToYaml={toggleConvertToYaml}
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
  groupFilter: null,
  selectedItem: {},
  setGroupFilter: null,
  setLoading: null,
  setStateFilter: null,
  showUntagged: '',
  stateFilter: null,
  toggleShowUntagged: null
}

Content.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groupFilter: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  setGroupFilter: PropTypes.func,
  setLoading: PropTypes.func,
  setStateFilter: PropTypes.func,
  showUntagged: PropTypes.string,
  stateFilter: PropTypes.string,
  toggleShowUntagged: PropTypes.func,
  yamlContent: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Content

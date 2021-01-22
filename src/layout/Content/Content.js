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

import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURES_TAB,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE,
  PROJECTS_PAGE,
  SCHEDULE_TAB
} from '../../constants'

import { formatDatetime } from '../../utils'

import './content.scss'

const Content = ({
  cancelRequest,
  content,
  expandRow,
  groupFilter,
  handleArtifactFilterTree,
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
  yamlContent,
  applyDetailsChanges
}) => {
  const [convertedYaml, setConvertedYaml] = useState('')
  const [expandedItems, setExpandedItems] = useState([])
  const [expand, setExpand] = useState(false)
  const [groupedByName, setGroupedByName] = useState({})
  const [groupedByWorkflow, setGroupedByWorkflow] = useState({})

  const contentClassName = classnames(
    'content',
    (pageData.page === JOBS_PAGE || pageData.page === FEATURE_STORE_PAGE) &&
      'content_with-menu'
  )

  const handleGroupByName = useCallback(() => {
    const groupedItems = {}

    content.forEach(contentItem => {
      if (
        pageData.selectedRowData?.content &&
        pageData.selectedRowData.content[contentItem.name]
      ) {
        groupedItems[contentItem] =
          pageData.selectedRowData?.content[contentItem.name]
      } else {
        groupedItems[contentItem.name]
          ? groupedItems[contentItem.name].push(contentItem)
          : (groupedItems[contentItem.name] = [contentItem])
      }
    })

    setGroupedByName(groupedItems)
    setGroupedByWorkflow({})
  }, [content, pageData.selectedRowData])

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

  const toggleConvertToYaml = (item, isSubRow) => {
    if (convertedYaml.length > 0) {
      return setConvertedYaml('')
    }

    const jobJson =
      pageData.page === JOBS_PAGE &&
      yamlContent.filter(job =>
        match.params.pageTab !== SCHEDULE_TAB
          ? isEqual(job.metadata.uid, item.uid)
          : isEqual(job.name, item.name)
      )[0]
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
      (pageData.page === ARTIFACTS_PAGE ||
        pageData.page === FILES_PAGE ||
        pageData.page === MODELS_PAGE ||
        pageData.page === FEATURE_STORE_PAGE) &&
      yamlContent.filter(yamlContentItem =>
        match.params.pageTab === FEATURE_SETS_TAB
          ? isEqual(yamlContentItem.name, item.name) &&
            isEqual(yamlContentItem.tag, item.tag)
          : match.params.pageTab === FEATURES_TAB
          ? isEqual(yamlContentItem.feature.name, item.feature.name)
          : isEqual(yamlContentItem.key, item.db_key)
      )

    setConvertedYaml(
      yaml.dump(
        pageData.page === JOBS_PAGE
          ? jobJson
          : pageData.page === ARTIFACTS_PAGE ||
            pageData.page === FILES_PAGE ||
            pageData.page === MODELS_PAGE ||
            pageData.page === FEATURE_STORE_PAGE
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
        expanded =>
          expanded.name?.value !== item.name?.value ||
          expanded.name !== item.name ||
          expanded.name !== item.key.value
      )

      parentRow.classList.remove('parent-row-expanded')
      pageData.handleRemoveFeatureVector &&
        pageData.handleRemoveFeatureVector(item)
      setExpandedItems(newArray)
      expandRow && expandRow(item, true)
    } else {
      parentRow.classList.remove('row_active')
      parentRow.classList.add('parent-row-expanded')
      pageData.handleRequestOnExpand && pageData.handleRequestOnExpand(item)
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
        <Breadcrumbs match={match} />
        <PageActionsMenu
          createJob={pageData.page === JOBS_PAGE}
          registerDialog={
            (pageData.page === PROJECTS_PAGE ||
              pageData.page === ARTIFACTS_PAGE ||
              pageData.page === FILES_PAGE ||
              pageData.page === MODELS_PAGE ||
              pageData.page === FEATURE_STORE_PAGE) &&
            match.params.pageTab === DATASETS_TAB
          }
          registerDialogHeader={
            pageData.page === PROJECTS_PAGE
              ? 'New Project'
              : pageData.registerArtifactDialogTitle
          }
          match={match}
          pageData={pageData}
          onClick={openPopupDialog}
        />
      </div>
      <div className={contentClassName}>
        {(pageData.page === JOBS_PAGE ||
          pageData.page === FEATURE_STORE_PAGE) && (
          <ContentMenu
            activeTab={match.params.pageTab}
            match={match}
            screen={pageData.page}
            tabs={pageData.tabs}
          />
        )}
        <div className="content__action-bar">
          <FilterMenu
            expand={expand}
            filters={pageData.filters}
            groupFilter={pageData.handleRequestOnExpand ? null : groupFilter}
            handleArtifactFilterTree={handleArtifactFilterTree}
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
              applyDetailsChanges={applyDetailsChanges}
              cancelRequest={cancelRequest}
              retryRequest={refresh}
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
  activeScreenTab: '',
  expandRow: null,
  groupFilter: null,
  handleSelectItem: () => {},
  selectedItem: {},
  setGroupFilter: () => {},
  setLoading: () => {},
  setStateFilter: () => {},
  showUntagged: '',
  stateFilter: null,
  toggleShowUntagged: null
}

Content.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  expandRow: PropTypes.func,
  groupFilter: PropTypes.string,
  handleArtifactFilterTree: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func,
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

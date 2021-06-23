import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'
import classnames from 'classnames'
import { connect } from 'react-redux'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import Notification from '../../common/Notification/Notification'

import {
  ARTIFACTS_PAGE,
  FEATURES_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURE_VECTORS_TAB,
  FILES_PAGE,
  JOBS_PAGE,
  MODELS_PAGE,
  MODEL_ENDPOINTS_TAB,
  PROJECTS_PAGE
} from '../../constants'

import { generateGroupedItems, getJson } from './content.util'

import './content.scss'

const Content = ({
  applyDetailsChanges,
  cancelRequest,
  content,
  expandRow,
  filtersStore,
  handleCancel,
  handleSelectItem,
  loading,
  match,
  openPopupDialog,
  pageData,
  refresh,
  selectedItem,
  setLoading,
  showUntagged,
  toggleShowUntagged,
  yamlContent
}) => {
  const [convertedYaml, setConvertedYaml] = useState('')
  const [expandedItems, setExpandedItems] = useState([])
  const [expand, setExpand] = useState(false)
  const [groupedByName, setGroupedByName] = useState({})
  const [groupedByWorkflow, setGroupedByWorkflow] = useState({})
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const location = useLocation()

  const contentClassName = classnames(
    'content',
    [JOBS_PAGE, FEATURE_STORE_PAGE, MODELS_PAGE].includes(pageData.page) &&
      'content_with-menu'
  )

  useEffect(() => {
    if (
      [
        PROJECTS_PAGE,
        ARTIFACTS_PAGE,
        FILES_PAGE,
        MODELS_PAGE,
        FEATURE_STORE_PAGE
      ].includes(pageData.page) &&
      ![FEATURES_TAB, MODEL_ENDPOINTS_TAB].includes(match.params.pageTab) &&
      (![FEATURE_SETS_TAB, FEATURE_VECTORS_TAB].includes(
        match.params.pageTab
      ) ||
        new URLSearchParams(location.search).get('demo') === 'true')
    ) {
      setShowRegisterDialog(true)
    } else if (showRegisterDialog) {
      setShowRegisterDialog(false)
    }
  }, [location.search, match.params.pageTab, pageData.page, showRegisterDialog])

  const handleGroupByName = useCallback(() => {
    setGroupedByName(generateGroupedItems(content, pageData.selectedRowData))
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
    if (filtersStore.groupBy === 'name') {
      handleGroupByName()
    } else if (filtersStore.groupBy === 'none') {
      handleGroupByNone()
    } else if (filtersStore.groupBy === 'workflow') {
      handleGroupByWorkflow()
    }

    return () => {
      setGroupedByName({})
      setGroupedByWorkflow({})
      setExpand(false)
      setConvertedYaml('')
    }
  }, [
    handleGroupByName,
    handleGroupByWorkflow,
    handleGroupByNone,
    filtersStore.groupBy
  ])

  const toggleConvertToYaml = item => {
    if (convertedYaml.length > 0) {
      return setConvertedYaml('')
    }

    const json = getJson(pageData.page, match.params.pageTab, yamlContent, item)

    setConvertedYaml(yaml.dump(json, { lineWidth: -1 }))
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
      pageData.handleRemoveRequestData && pageData.handleRemoveRequestData(item)
      setExpandedItems(newArray)
      expandRow && expandRow(item, true)
    } else {
      parentRow.classList.remove('row_active')
      parentRow.classList.add('parent-row-expanded')
      pageData.handleRequestOnExpand && pageData.handleRequestOnExpand(item)
      setExpandedItems([...expandedItems, item])
    }
  }

  const handleExpandAll = collapseRows => {
    if (filtersStore.groupBy !== 'none') {
      const rows = [...document.getElementsByClassName('parent-row')]

      if (collapseRows || expand) {
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
          registerDialog={showRegisterDialog}
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
        {[JOBS_PAGE, FEATURE_STORE_PAGE, MODELS_PAGE].includes(
          pageData.page
        ) && (
          <ContentMenu
            activeTab={match.params.pageTab}
            match={match}
            screen={pageData.page}
            tabs={pageData.tabs}
          />
        )}
        <div className="content__action-bar">
          <FilterMenu
            actionButton={pageData.filterMenuActionButton}
            expand={expand}
            filters={pageData.filters}
            handleExpandAll={handleExpandAll}
            match={match}
            onChange={refresh}
            page={pageData.page}
            showUntagged={showUntagged}
            toggleShowUntagged={toggleShowUntagged}
            withoutExpandButton={Boolean(pageData.handleRequestOnExpand)}
          />
        </div>
        <YamlModal
          convertedYaml={convertedYaml}
          toggleConvertToYaml={toggleConvertToYaml}
        />
        <div className="table-container">
          {content.length !== 0 ? (
            <Table
              applyDetailsChanges={applyDetailsChanges}
              cancelRequest={cancelRequest}
              content={content}
              groupedByName={groupedByName}
              groupedByWorkflow={groupedByWorkflow}
              handleCancel={handleCancel}
              handleExpandRow={handleExpandRow}
              handleSelectItem={handleSelectItem}
              match={match}
              pageData={pageData}
              retryRequest={refresh}
              selectedItem={selectedItem}
              setLoading={setLoading}
              toggleConvertToYaml={toggleConvertToYaml}
            />
          ) : loading ? null : (
            <NoData />
          )}
        </div>
        <Notification />
      </div>
    </>
  )
}

Content.defaultProps = {
  activeScreenTab: '',
  expandRow: null,
  handleSelectItem: () => {},
  selectedItem: {},
  setLoading: () => {},
  showUntagged: '',
  toggleShowUntagged: null
}

Content.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  expandRow: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  setLoading: PropTypes.func,
  showUntagged: PropTypes.string,
  toggleShowUntagged: PropTypes.func,
  yamlContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired
}

export default connect(({ filtersStore }) => ({ filtersStore }), null)(Content)

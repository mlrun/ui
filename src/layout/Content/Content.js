import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import TableTop from '../../elements/TableTop/TableTop'

import { generateContentActionsMenu, generateGroupedItems, getNoDataMessage } from './content.util'
import { isProjectValid } from '../../utils/handleRedirect'
import { useYaml } from '../../hooks/yaml.hook'
import {
  ADD_TO_FEATURE_VECTOR_TAB,
  FEATURE_STORE_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  MODELS_PAGE
} from '../../constants'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Content = ({
  applyDetailsChanges,
  artifactsStore,
  cancelRequest,
  children,
  content,
  filtersChangeCallback,
  filtersStore,
  getIdentifier,
  handleActionsMenuClick,
  handleCancel,
  handleRemoveRequestData,
  handleSelectItem,
  header,
  loading,
  pageData,
  projectStore,
  refresh,
  selectedItem,
  tableTop
}) => {
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [expandedItems, setExpandedItems] = useState(0)
  const [expand, setExpand] = useState(false)
  const [groupedContent, setGroupedContent] = useState({})
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()

  const contentClassName = classnames(
    'content',
    [FEATURE_STORE_PAGE, MODELS_PAGE].includes(pageData.page) &&
      !location.pathname.includes(ADD_TO_FEATURE_VECTOR_TAB) &&
      'content_with-menu'
  )
  const filterMenuClassNames = classnames(
    'content__action-bar',
    pageData.hideFilterMenu && 'content__action-bar_hidden'
  )

  const actionsMenu = useMemo(() => {
    return generateContentActionsMenu(pageData.actionsMenu, [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ])
  }, [pageData.actionsMenu, toggleConvertedYaml])

  useEffect(() => {
    if (!pageData.hidePageActionMenu) {
      setShowActionsMenu(true)
    } else if (showActionsMenu) {
      setShowActionsMenu(false)
    }
  }, [pageData.hidePageActionMenu, showActionsMenu])

  useEffect(() => {
    isProjectValid(navigate, projectStore.projectsNames.data, params.projectName)
  }, [navigate, params.projectName, projectStore.projectsNames.data])

  const handleGroupByName = useCallback(() => {
    setGroupedContent(generateGroupedItems(content, pageData.selectedRowData, getIdentifier))
  }, [content, getIdentifier, pageData.selectedRowData])

  const handleGroupByNone = useCallback(() => {
    const rows = [...document.getElementsByClassName('parent-row')]

    rows.forEach(row => row.classList.remove('parent-row-expanded'))

    setExpand(false)
    setGroupedContent({})
  }, [])

  useEffect(() => {
    if (filtersStore.groupBy === GROUP_BY_NAME) {
      handleGroupByName()
    } else if (filtersStore.groupBy === GROUP_BY_NONE) {
      handleGroupByNone()
    }

    return () => {
      setGroupedContent({})
      toggleConvertedYaml()
    }
  }, [handleGroupByName, handleGroupByNone, filtersStore.groupBy, toggleConvertedYaml])

  useEffect(() => {
    return () => {
      setExpandedItems(0)
    }
  }, [params.jobId, params.pipelineId, groupedContent])

  useEffect(() => {
    if (Object.keys(groupedContent).length > 0) {
      setExpand(expandedItems === Object.keys(groupedContent).length)
    }
  }, [expandedItems, groupedContent])

  const handleExpandRow = (e, item) => {
    const parentRow = e.target.closest('.parent-row')

    if (parentRow.classList.contains('parent-row-expanded')) {
      parentRow.classList.remove('parent-row-expanded')
      handleRemoveRequestData && handleRemoveRequestData(item)

      setExpandedItems(prev => --prev)
    } else {
      parentRow.classList.remove('row_active')
      parentRow.classList.add('parent-row-expanded')
      pageData.handleRequestOnExpand && pageData.handleRequestOnExpand(item)

      setExpandedItems(prev => ++prev)
    }
  }

  const handleExpandAll = collapseRows => {
    if (filtersStore.groupBy !== GROUP_BY_NONE) {
      const rows = [...document.getElementsByClassName('parent-row')]

      if (collapseRows || expand) {
        rows.forEach(row => row.classList.remove('parent-row-expanded'))

        setExpandedItems(0)
      } else {
        rows.forEach(row => row.classList.add('parent-row-expanded'))

        setExpandedItems(Object.keys(groupedContent).length)
      }
    }
  }

  return (
    <>
      <div className="content__header">
        {header ? header : <Breadcrumbs />}
        <PageActionsMenu
          actionsMenuHeader={pageData.actionsMenuHeader}
          onClick={handleActionsMenuClick}
          showActionsMenu={showActionsMenu}
        />
      </div>
      <div className={contentClassName}>
        {[FEATURE_STORE_PAGE, MODELS_PAGE].includes(pageData.page) &&
          !location.pathname.includes(ADD_TO_FEATURE_VECTOR_TAB) && (
            <ContentMenu activeTab={params.pageTab} screen={pageData.page} tabs={pageData.tabs} />
          )}

        <div className="table-container">
          {tableTop && (
            <TableTop link={tableTop.link} text={tableTop.text}>
              {tableTop.children}
            </TableTop>
          )}
          <div className={filterMenuClassNames}>
            <FilterMenu
              actionButton={pageData.filterMenuActionButton}
              cancelRequest={cancelRequest}
              expand={expand}
              filters={pageData.filters}
              handleExpandAll={handleExpandAll}
              onChange={filtersChangeCallback ?? refresh}
              page={pageData.page}
              withoutExpandButton={
                Boolean(pageData.handleRequestOnExpand) || pageData.withoutExpandButton
              }
            />
          </div>
          {children ? (
            children
          ) : loading ? null : (filtersStore.groupBy !== GROUP_BY_NONE &&
              isEmpty(groupedContent)) ||
            content.length === 0 ? (
            <NoData
              message={getNoDataMessage(
                filtersStore,
                pageData.filters,
                params.pageTab,
                pageData.page
              )}
            />
          ) : (
            <>
              <Table
                actionsMenu={actionsMenu}
                applyDetailsChanges={applyDetailsChanges}
                content={content}
                groupedContent={groupedContent}
                handleCancel={handleCancel}
                handleExpandRow={handleExpandRow}
                handleSelectItem={handleSelectItem}
                pageData={pageData}
                retryRequest={refresh}
                selectedItem={selectedItem}
              />
            </>
          )}
        </div>
        {convertedYaml.length > 0 && (
          <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
        )}
      </div>
      {artifactsStore?.preview?.isPreview && (
        <PreviewModal item={artifactsStore?.preview?.selectedItem} />
      )}
    </>
  )
}

Content.defaultProps = {
  activeScreenTab: '',
  cancelRequest: () => {},
  filtersChangeCallback: null,
  handleActionsMenuClick: () => {},
  handleCancel: () => {},
  handleSelectItem: () => {},
  selectedItem: {},
  tableTop: null
}

Content.propTypes = {
  cancelRequest: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filtersChangeCallback: PropTypes.func,
  getIdentifier: PropTypes.func.isRequired,
  handleActionsMenuClick: PropTypes.func,
  handleCancel: PropTypes.func,
  handleSelectItem: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  tableTop: PropTypes.shape({
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })
}

export default connect(
  ({ artifactsStore, filtersStore, projectStore }) => ({
    artifactsStore,
    filtersStore,
    projectStore
  }),
  null
)(Content)

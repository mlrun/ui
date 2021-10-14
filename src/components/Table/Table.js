import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { isEmpty, map } from 'lodash'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'

import createJobsContent from '../../utils/createJobsContent'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { generateTableContent } from '../../utils/generateTableContent'
import { generateGroupLatestItem } from '../../utils/generateGroupLatestItem'
import { FUNCTIONS_PAGE, JOBS_PAGE } from '../../constants'
import tableActions from '../../actions/table'

import './table.scss'

const Table = ({
  actionsMenu,
  applyDetailsChanges,
  cancelRequest,
  content,
  filtersStore,
  getCloseDetailsLink,
  groupedContent,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  match,
  pageData,
  retryRequest,
  selectedItem,
  setLoading,
  setTablePanelOpen,
  tableStore
}) => {
  const location = useLocation()
  const [tableContent, setTableContent] = useState({
    groupLatestItem: [],
    groupWorkflowItems: [],
    content: [],
    mainRowItemsCount: 1
  })
  const tablePanelRef = useRef(null)
  const tableHeadRef = useRef(null)

  const previewArtifact = useSelector(
    state => pageData.page !== FUNCTIONS_PAGE && state.artifactsStore.preview
  )
  const workflows = useSelector(state => {
    return pageData.page === JOBS_PAGE && state.workflowsStore.workflows.data
  })

  useEffect(() => {
    return () => {
      setTablePanelOpen(false)
    }
  }, [setTablePanelOpen])

  useEffect(() => {
    const calculatePanelHeight = () => {
      if (tableHeadRef && tablePanelRef.current) {
        const cords = tableHeadRef.current.getBoundingClientRect()
        tablePanelRef.current.style.height = `${window.innerHeight -
          cords.top}px`
      }
    }

    if (tableStore.isTablePanelOpen && tablePanelRef.current) {
      calculatePanelHeight()

      document
        .getElementById('main')
        .addEventListener('scroll', calculatePanelHeight)
      window.addEventListener('resize', calculatePanelHeight)
    }
    return () => {
      window.removeEventListener('scroll', calculatePanelHeight)
      window.removeEventListener('resize', calculatePanelHeight)
    }
  }, [tableStore.isTablePanelOpen])

  useLayoutEffect(() => {
    const generatedTableContent = generateTableContent(
      content,
      groupedContent,
      filtersStore.groupBy,
      pageData.page,
      tableStore.isTablePanelOpen,
      match.params,
      location.search,
      !isEveryObjectValueEmpty(selectedItem)
    )

    if (filtersStore.groupBy === 'name') {
      setTableContent({
        content: generatedTableContent,
        groupLatestItem: generateGroupLatestItem(
          pageData.page,
          generatedTableContent,
          match.params.pageTab
        ),
        groupWorkflowItems: [],
        mainRowItemsCount: pageData.mainRowItemsCount ?? 1
      })
    } else if (filtersStore.groupBy === 'workflow') {
      let groupWorkflowItem = map(groupedContent, (jobs, workflowId) =>
        workflows.find(workflow => workflow.id === workflowId)
      )

      setTableContent(state => ({
        ...state,
        content: generatedTableContent,
        groupLatestItem: [],
        groupWorkflowItems: createJobsContent(
          groupWorkflowItem,
          !isEveryObjectValueEmpty(selectedItem),
          match.params,
          location.search,
          true
        )
      }))
    } else if (filtersStore.groupBy === 'none') {
      setTableContent(state => ({
        ...state,
        groupLatestItem: [],
        groupWorkflowItems: [],
        content: generatedTableContent
      }))
    }
  }, [
    content,
    groupedContent,
    pageData.page,
    setLoading,
    workflows,
    pageData.mainRowItemsCount,
    tableStore.isTablePanelOpen,
    filtersStore.groupBy,
    match.params,
    location.search,
    selectedItem
  ])

  return (
    <>
      <TableView
        actionsMenu={actionsMenu}
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={cancelRequest}
        content={content}
        getCloseDetailsLink={getCloseDetailsLink}
        groupFilter={filtersStore.groupBy}
        groupLatestItem={
          isEmpty(tableContent.groupLatestItem)
            ? tableContent.groupWorkflowItems
            : tableContent.groupLatestItem
        }
        groupedContent={groupedContent}
        handleCancel={handleCancel}
        handleExpandRow={handleExpandRow}
        handleSelectItem={handleSelectItem}
        isTablePanelOpen={tableStore.isTablePanelOpen}
        mainRowItemsCount={tableContent.mainRowItemsCount}
        match={match}
        pageData={pageData}
        retryRequest={retryRequest}
        selectedItem={selectedItem}
        tableContent={tableContent.content}
        tableHeadRef={tableHeadRef}
        tablePanelRef={tablePanelRef}
        workflows={workflows}
      />
      {previewArtifact.isPreview && (
        <PreviewModal item={previewArtifact.selectedItem} />
      )}
    </>
  )
}

Table.defaultProps = {
  applyDetailsChanges: () => {},
  getCloseDetailsLink: null,
  groupedContent: {},
  groupLatestJob: [],
  handleExpandRow: () => {},
  selectedItem: {},
  setLoading: null
}

Table.propTypes = {
  actionsMenu: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.func
  ]).isRequired,
  applyDetailsChanges: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getCloseDetailsLink: PropTypes.func,
  groupedContent: PropTypes.shape({}),
  handleCancel: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  retryRequest: PropTypes.func.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}),
  setLoading: PropTypes.func
}

export default connect(
  ({ tableStore, filtersStore }) => ({
    tableStore,
    filtersStore
  }),
  {
    ...tableActions
  }
)(Table)

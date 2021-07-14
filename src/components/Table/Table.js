import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { isEmpty, map } from 'lodash'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'

import createJobsContent from '../../utils/createJobsContent'
import { generateTableContent } from '../../utils/generateTableContent'
import { generateGroupLatestItem } from '../../utils/generateGroupLatestItem'
import { FUNCTIONS_PAGE, JOBS_PAGE } from '../../constants'
import tableActions from '../../actions/table'

import './table.scss'

const Table = ({
  applyDetailsChanges,
  cancelRequest,
  content,
  filtersStore,
  groupedByName,
  groupedByWorkflow,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  match,
  pageData,
  retryRequest,
  selectedItem,
  setLoading,
  setTablePanelOpen,
  tableStore,
  toggleConvertToYaml
}) => {
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
  const workflows = useSelector(
    state =>
      pageData.page === JOBS_PAGE && state.projectStore.project.workflows.data
  )

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

  useEffect(() => {
    const generatedTableContent = generateTableContent(
      content,
      groupedByName,
      groupedByWorkflow,
      filtersStore.groupBy,
      pageData.page,
      tableStore.isTablePanelOpen,
      match.params.pageTab,
      match.params.projectName
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
      let groupWorkflowItem = map(groupedByWorkflow, (jobs, workflowId) =>
        workflows.find(workflow => workflow.id === workflowId)
      )

      setTableContent({
        content: generatedTableContent,
        groupLatestItem: [],
        groupWorkflowItems: createJobsContent(
          groupWorkflowItem,
          groupedByWorkflow
        )
      })
    } else if (filtersStore.groupBy === 'none') {
      setTableContent({
        groupLatestItem: [],
        groupWorkflowItems: [],
        content: generatedTableContent
      })
    }
  }, [
    content,
    groupedByWorkflow,
    groupedByName,
    pageData.page,
    setLoading,
    workflows,
    pageData.mainRowItemsCount,
    tableStore.isTablePanelOpen,
    filtersStore.groupBy,
    match.params.pageTab,
    match.params.projectName
  ])

  return (
    <>
      <TableView
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={cancelRequest}
        content={content}
        groupFilter={filtersStore.groupBy}
        groupLatestItem={
          isEmpty(tableContent.groupLatestItem)
            ? tableContent.groupWorkflowItems
            : tableContent.groupLatestItem
        }
        groupedByName={groupedByName}
        groupedByWorkflow={groupedByWorkflow}
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
        toggleConvertToYaml={toggleConvertToYaml}
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
  groupedByName: {},
  groupLatestJob: [],
  handleExpandRow: () => {},
  selectedItem: {},
  setLoading: null
}

Table.propTypes = {
  applyDetailsChanges: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groupedByName: PropTypes.shape({}),
  handleCancel: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}),
  setLoading: PropTypes.func,
  toggleConvertToYaml: PropTypes.func.isRequired
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

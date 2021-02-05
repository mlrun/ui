import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { isEmpty, map } from 'lodash'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Notification from '../../common/Notification/Notification'

import createJobsContent from '../../utils/createJobsContent'
import { generateTableContent } from '../../utils/generateTableContent'
import { generateGroupLatestItem } from '../../utils/generateGroupLatestItem'
import { FUNCTIONS_PAGE, JOBS_PAGE } from '../../constants'

import './table.scss'

const Table = ({
  applyDetailsChanges,
  cancelRequest,
  content,
  groupFilter,
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
  toggleConvertToYaml
}) => {
  const [tableContent, setTableContent] = useState({
    groupLatestItem: [],
    groupWorkflowItems: [],
    content: [],
    mainRowItemsCount: 1
  })

  const previewArtifact = useSelector(
    state => pageData.page !== FUNCTIONS_PAGE && state.artifactsStore.preview
  )
  const workflows = useSelector(
    state =>
      pageData.page === JOBS_PAGE && state.projectStore.project.workflows.data
  )

  useEffect(() => {
    const generatedTableContent = generateTableContent(
      content,
      groupedByName,
      groupedByWorkflow,
      groupFilter,
      pageData.page,
      match,
      setLoading
    )

    if (groupFilter === 'name') {
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
    } else if (groupFilter === 'workflow') {
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
    } else if (!groupFilter || groupFilter === 'none') {
      setTableContent({
        groupLatestItem: [],
        groupWorkflowItems: [],
        content: generatedTableContent
      })
    }
  }, [
    content,
    groupFilter,
    groupedByWorkflow,
    groupedByName,
    match,
    pageData.page,
    setLoading,
    workflows,
    pageData.mainRowItemsCount
  ])

  useEffect(() => {
    if (tableContent.content.length && setLoading) {
      setLoading(false)
    }
  }, [setLoading, tableContent])

  return (
    <>
      <TableView
        applyDetailsChanges={applyDetailsChanges}
        cancelRequest={cancelRequest}
        content={content}
        groupFilter={groupFilter}
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
        mainRowItemsCount={tableContent.mainRowItemsCount}
        match={match}
        pageData={pageData}
        retryRequest={retryRequest}
        selectedItem={selectedItem}
        tableContent={tableContent.content}
        toggleConvertToYaml={toggleConvertToYaml}
        workflows={workflows}
      />
      <Notification />
      {previewArtifact.isPreview && (
        <PreviewModal item={previewArtifact.selectedItem} />
      )}
    </>
  )
}

Table.defaultProps = {
  applyDetailsChanges: () => {},
  groupedByName: {},
  groupFilter: null,
  groupLatestJob: [],
  handleExpandRow: () => {},
  selectedItem: {},
  setLoading: null
}

Table.propTypes = {
  applyDetailsChanges: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groupFilter: PropTypes.string,
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

export default Table

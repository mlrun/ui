import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { isEmpty, map } from 'lodash'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import NotificationDownload from '../NotificationDownload/NotificationDownload'

import createJobsContent from '../../utils/createJobsContent'
import { generateTableContent } from '../../utils/generateTableContent'
import { generateGroupLatestItem } from '../../utils/generateGroupLatestItem'
import { FUNCTIONS_PAGE, JOBS_PAGE } from '../../constants'

import './table.scss'

const Table = ({
  content,
  groupFilter,
  groupedByName,
  groupedByWorkflow,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  match,
  pageData,
  selectedItem,
  setLoading,
  toggleConvertToYaml
}) => {
  console.log('here')
  const [tableContent, setTableContent] = useState({
    groupLatestItem: [],
    groupWorkflowItems: [],
    content: []
  })

  const previewArtifact = useSelector(
    state => pageData.page !== FUNCTIONS_PAGE && state.artifactsStore.preview
  )
  const workflows = useSelector(
    state => pageData.page === JOBS_PAGE && state.workflowsStore.workflows
  )

  useEffect(() => {
    const generatedTableContent = generateTableContent(
      content,
      groupedByName,
      groupedByWorkflow,
      groupFilter,
      pageData.page,
      setLoading
    )
    let groupLatest = []
    let groupWorkflowItem = []

    if (groupFilter === 'name') {
      groupLatest = generateGroupLatestItem(
        pageData.page,
        generatedTableContent
      )
    } else if (groupFilter === 'workflow') {
      groupWorkflowItem = map(groupedByWorkflow, (jobs, workflowId) =>
        workflows.find(workflow => workflow.id === workflowId)
      )
    }

    setTableContent({
      content: generatedTableContent,
      groupLatestItem: groupLatest,
      groupWorkflowItems: createJobsContent(groupWorkflowItem)
    })
  }, [
    content,
    groupedByName,
    groupFilter,
    groupedByWorkflow,
    workflows,
    pageData.page,
    setLoading
  ])

  useEffect(() => {
    if (groupFilter === 'none') {
      setTableContent({
        groupLatestItem: [],
        groupWorkflowItems: [],
        content: []
      })
    }
  }, [groupFilter])

  useEffect(() => {
    if (tableContent.content.length) {
      setLoading(false)
    }
  }, [setLoading, tableContent.content.length])

  return (
    <>
      <TableView
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
        match={match}
        pageData={pageData}
        selectedItem={selectedItem}
        tableContent={tableContent.content}
        toggleConvertToYaml={toggleConvertToYaml}
        workflows={workflows}
      />
      <NotificationDownload />
      {previewArtifact.isPreview && (
        <PreviewModal item={previewArtifact.item} />
      )}
    </>
  )
}

Table.defaultProps = {
  groupedByName: {},
  groupFilter: null,
  groupLatestJob: [],
  handleExpandRow: () => {},
  selectedItem: {},
  setLoading: null
}

Table.propTypes = {
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

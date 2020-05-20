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
  toggleConvertToYaml
}) => {
  const [groupLatestItem, setGroupLatestItem] = useState([])
  const [groupWorkflowItems, setGroupWorkflowItems] = useState([])
  const [tableContent, setTableContent] = useState([])

  const previewArtifact = useSelector(
    state => pageData.page !== FUNCTIONS_PAGE && state.artifactsStore.preview
  )
  const workflows = useSelector(
    state => pageData.page === JOBS_PAGE && state.workflowsStore.workflows
  )

  useEffect(() => {
    let generatedTableContent = generateTableContent(
      content,
      groupedByName,
      groupedByWorkflow,
      groupFilter,
      pageData.page
    )

    if (groupFilter === 'name') {
      const groupLatest = generateGroupLatestItem(
        pageData.page,
        generatedTableContent
      )

      setGroupLatestItem(groupLatest)
      setGroupWorkflowItems([])
    } else if (groupFilter === 'workflow') {
      const groupWorkflowItem = map(groupedByWorkflow, workflowId =>
        workflows.find(workflow => workflow.id === workflowId)
      )

      setGroupWorkflowItems(createJobsContent(groupWorkflowItem))
      setGroupLatestItem([])
    }

    setTableContent(generatedTableContent)
  }, [
    content,
    groupedByName,
    groupFilter,
    groupedByWorkflow,
    workflows,
    pageData.page
  ])

  useEffect(() => {
    if (groupFilter === 'none') {
      setGroupLatestItem([])
      setGroupWorkflowItems([])
      setTableContent([])
    }
  }, [groupFilter])

  return (
    <>
      <TableView
        content={content}
        groupFilter={groupFilter}
        groupLatestItem={
          isEmpty(groupLatestItem) ? groupWorkflowItems : groupLatestItem
        }
        groupedByName={groupedByName}
        groupedByWorkflow={groupedByWorkflow}
        handleCancel={handleCancel}
        handleExpandRow={handleExpandRow}
        handleSelectItem={handleSelectItem}
        match={match}
        pageData={pageData}
        selectedItem={selectedItem}
        tableContent={tableContent}
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
  groupLatestJob: [],
  handleExpandRow: () => {},
  selectedItem: {},
  groupedByName: {},
  groupFilter: null
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
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default Table

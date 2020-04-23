import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import NotificationDownload from '../NotificationDownload/NotificationDownload'

import './table.scss'

import createArtifactsContent from '../../utils/createArtifactsContent'
import createFunctionsContent from '../../utils/createFunctionsContent'
import createJobsContent from '../../utils/createJobsContent'
import { JOBS_PAGE, ARTIFACTS_PAGE } from '../../constants'

const Table = ({
  content,
  detailsMenu,
  groupFilter,
  groupedByName,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  match,
  page,
  selectedItem,
  toggleConvertToYaml,
  tableHeaders
}) => {
  const [tableContent, setTableContent] = useState([])
  const [groupLatestJob, setGroupLatestJob] = useState([])

  const previewArtifact = useSelector(state => state.artifactsStore.preview)

  useEffect(() => {
    const _tableContent =
      Object.keys(groupedByName).length > 0
        ? Object.values(groupedByName).map(group => {
            return createJobsContent(group)
          })
        : page === JOBS_PAGE
        ? createJobsContent(content)
        : page === ARTIFACTS_PAGE
        ? createArtifactsContent(content)
        : createFunctionsContent(content)

    if (groupFilter === 'name') {
      const groupLatest = _tableContent.map(group => {
        if (Array.isArray(group)) {
          return group.reduce((prev, curr) => {
            return new Date(prev.updated.value).getTime() >
              new Date(curr.updated.value).getTime()
              ? prev
              : curr
          })
        } else return group
      })

      setGroupLatestJob(groupLatest)
    }

    setTableContent(_tableContent)
  }, [page, content, groupedByName, groupFilter])

  useEffect(() => {
    if (groupFilter === 'none') {
      setGroupLatestJob([])
      setTableContent([])
    }
  }, [groupFilter])

  return (
    <>
      <TableView
        content={content}
        detailsMenu={detailsMenu}
        groupFilter={groupFilter}
        groupLatestJob={groupLatestJob}
        groupedByName={groupedByName}
        handleCancel={handleCancel}
        handleExpandRow={handleExpandRow}
        handleSelectItem={handleSelectItem}
        match={match}
        page={page}
        selectedItem={selectedItem}
        tableContent={tableContent}
        toggleConvertToYaml={toggleConvertToYaml}
        tableHeaders={tableHeaders}
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
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupFilter: PropTypes.string,
  groupedByName: PropTypes.shape({}),
  handleCancel: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}),
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default Table

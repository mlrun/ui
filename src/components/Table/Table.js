import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import NotificationDownload from '../NotificationDownload/NotificationDownload'

import './table.scss'

import createArtifactsContent from '../../utils/createArtifactsContent'
import createFunctionsContent from '../../utils/createFunctionsContent'
import { JOBS_PAGE, ARTIFACTS_PAGE } from '../../constants'
import createJobsContent from '../../utils/createJobsContent'

const Table = ({
  content,
  detailsMenu,
  groupFilter,
  groupedByName,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  isPreview,
  match,
  page,
  selectedItem,
  toggleConvertToYaml,
  tableHeaders
}) => {
  const [tableContent, setTableContent] = useState([])
  const [groupLatestJob, setGroupLatestJob] = useState([])

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

    if (groupFilter === 'Name') {
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
    if (groupFilter === 'None') {
      setGroupLatestJob([])
      setTableContent([])
    }
  }, [groupFilter])

  useEffect(() => {
    window.addEventListener('click', hideChips)
    return () => window.removeEventListener('click', hideChips)
  })

  const hideChips = e => {
    if (e.target.getAttribute('count-chips') === null) {
      const block = document.getElementsByClassName('chip-block showChips')[0]
      if (block) {
        block.classList.remove('showChips')
      }
    }
  }

  const handleShowElements = e => {
    if (e.target.getAttribute('count-chips')) {
      let blocksArr = document.getElementsByClassName('showChips')
      const parentBlock = e.target.closest('.chip-block')
      if (
        blocksArr.length > 0 &&
        !parentBlock.classList.contains('showChips')
      ) {
        blocksArr[0].classList.remove('showChips')
      }
      parentBlock.classList.contains('showChips')
        ? parentBlock.classList.remove('showChips')
        : parentBlock.classList.add('showChips')
    }
  }

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
        handleShowElements={handleShowElements}
        hideChips={hideChips}
        match={match}
        page={page}
        selectedItem={selectedItem}
        tableContent={tableContent}
        toggleConvertToYaml={toggleConvertToYaml}
        tableHeaders={tableHeaders}
      />
      <NotificationDownload />
      {isPreview && <PreviewModal item={selectedItem} cancel={handleCancel} />}
    </>
  )
}

Table.defaultProps = {
  groupLatestJob: [],
  handleExpandRow: () => {},
  selectedItem: {},
  groupedByName: {}
}

Table.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}),
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Table

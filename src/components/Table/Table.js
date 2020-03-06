import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import NotificationDownload from '../NotificationDownload/NotificationDownload'

import './table.scss'

const Table = ({
  groupLatestJob,
  handleCancel,
  match,
  tableContent,
  content,
  selectedItem,
  handleSelectItem,
  convertToYaml,
  tableHeaders,
  detailsMenu,
  page,
  handleExpandRow
}) => {
  const state = useSelector(state => state.artifactsStore.selectArtifact)
  const hideChips = e => {
    if (
      e.target.className !== 'table-body__results' &&
      e.target.className !== 'table-body__parameters' &&
      e.target.className !== 'table__item_details_item_data__parameters'
    ) {
      const block = document.getElementsByClassName(
        'table-body__chips__block showChips'
      )[0]
      if (block) {
        block.classList.remove('showChips')
      }
    }
  }

  const handleShowElements = e => {
    if (
      e.target.className === 'table-body__results' ||
      e.target.className === 'table-body__parameters' ||
      e.target.className === 'table__item_details_item_data__parameters'
    ) {
      let blocksArr = document.getElementsByClassName('showChips')
      const parentBlock = e.target.closest('.table-body__chips__block')
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
        groupLatestJob={groupLatestJob}
        hideChips={hideChips}
        handleShowElements={handleShowElements}
        handleCancel={handleCancel}
        match={match}
        tableContent={tableContent}
        content={content}
        selectedItem={selectedItem}
        handleSelectItem={handleSelectItem}
        convertToYaml={convertToYaml}
        tableHeaders={tableHeaders}
        detailsMenu={detailsMenu}
        page={page}
        handleExpandRow={handleExpandRow}
      />
      <NotificationDownload />
      {state.isPreview && (
        <PreviewModal item={selectedItem} cancel={handleCancel} />
      )}
    </>
  )
}

Table.defaultProps = {
  groupLatestJob: [],
  handleExpandRow: () => {},
  selectedItem: {}
}

Table.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  convertToYaml: PropTypes.func.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupLatestJob: PropTypes.arrayOf(PropTypes.shape({})),
  handleCancel: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}),
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Table

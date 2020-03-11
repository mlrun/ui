import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import TableView from './TableView'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import NotificationDownload from '../NotificationDownload/NotificationDownload'

import './table.scss'

const Table = ({
  handleCancel,
  match,
  tableContent,
  content,
  selectedItem,
  handleSelectItem,
  convertToYaml,
  tableHeaders,
  detailsMenu,
  page
}) => {
  const state = useSelector(state => state.artifactsStore.selectArtifact)
  const hideChips = e => {
    if (e.target.getAttribute('count-chips') === null) {
      const block = document.getElementsByClassName(
        'table_body__chips__block showChips'
      )[0]
      if (block) {
        block.classList.remove('showChips')
      }
    }
  }

  const handleShowElements = e => {
    if (e.target.getAttribute('count-chips')) {
      let blocksArr = document.getElementsByClassName('showChips')
      const parentBlock = e.target.closest('.table_body__chips__block')
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
      />
      <NotificationDownload />
      {state.isPreview && (
        <PreviewModal item={selectedItem} cancel={handleCancel} />
      )}
    </>
  )
}

Table.defaultProps = {
  selectedItem: {}
}

Table.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  convertToYaml: PropTypes.func.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}),
  tableContent: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Table

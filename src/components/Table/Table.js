import React, { useState } from 'react'
import PropTypes from 'prop-types'

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
  const [preview, setPreview] = useState({
    isShow: false,
    preview: {}
  })

  const hideChips = e => {
    if (
      e.target.className !== 'table_body__results' &&
      e.target.className !== 'table_body__parameters' &&
      e.target.className !== 'table__item_details_item_data__parameters'
    ) {
      const block = document.getElementsByClassName(
        'table_body__chips__block showChips'
      )[0]
      if (block) {
        block.classList.remove('showChips')
      }
    }
  }

  const handleHoverOnRowActions = e => {
    // const target = e.target.closest('.parent_row')
    // target.lastElementChild.style.display = 'block'
  }

  const handleMouseLeaveFromRowActions = e => {
    // const target = e.target.closest('.parent_row')
    const actions = document.getElementsByClassName('row__actions_visible')[0]
    // // target.lastElementChild.style.display = 'none'
    if (actions) {
      actions.classList.remove('row__actions_visible')
    }
  }

  const handleShowElements = e => {
    if (
      e.target.className === 'table_body__results' ||
      e.target.className === 'table_body__parameters' ||
      e.target.className === 'table__item_details_item_data__parameters'
    ) {
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

  const handlePreview = item => {
    setPreview(prev => {
      return { ...prev, isShow: true, preview: item }
    })
  }

  return (
    <>
      <TableView
        hideChips={hideChips}
        handleHoverOnRowActions={handleHoverOnRowActions}
        handleMouseLeaveFromRowActions={handleMouseLeaveFromRowActions}
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
        handlePreview={handlePreview}
      />
      <NotificationDownload />
      {preview.isShow && (
        <PreviewModal item={preview.preview} close={setPreview} />
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
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}),
  tableContent: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Table

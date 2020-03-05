import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TableView from './TableView'
import NotificationDownload from '../../elements/NotificationDownload/NotificationDownload'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useSelector, useDispatch } from 'react-redux'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
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
  loading,
  tableHeaders,
  detailsMenu,
  page,
  handleExpandRow
}) => {
  const state = useSelector(state => state.notificationDownloadStore)
  const dispatch = useDispatch()
  const [preview, setPreview] = useState({
    isShow: false,
    preview: {}
  })
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

  const handleHoverOnRowActions = e => {
    const target = e.target.closest('.parent-row')
    target.lastElementChild.style.display = 'block'
  }

  const handleMouseLeaveFromRowActions = e => {
    const target = e.target.closest('.parent-row')
    const actions = document.getElementsByClassName('row__actions_visible')[0]
    target.lastElementChild.style.display = 'none'
    if (actions) {
      actions.classList.remove('row__actions_visible')
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

  const handlePreview = item => {
    setPreview(prev => {
      return { ...prev, isShow: true, preview: item }
    })
  }

  return (
    <>
      <TableView
        groupLatestJob={groupLatestJob}
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
        loading={loading}
        tableHeaders={tableHeaders}
        detailsMenu={detailsMenu}
        page={page}
        handlePreview={handlePreview}
        handleExpandRow={handleExpandRow}
      />
      <TransitionGroup>
        {state.notification.map((item, index) => {
          return (
            <CSSTransition
              key={'css' + item.id}
              timeout={{
                enter: 500,
                exit: 500
              }}
              classNames="notification_download"
              onEntered={e => {
                setTimeout(
                  () => {
                    dispatch({
                      type: 'REMOVE_NOTIFICATION_DOWNLOAD',
                      payload: item.id
                    })
                  },
                  item.status === 200 ? 1000 : 2500
                )
              }}
            >
              <NotificationDownload
                key={item.id}
                status={item.status}
                url={item.url}
                file={item.file || null}
                id={item.id}
                dispatch={dispatch}
              />
            </CSSTransition>
          )
        })}
      </TransitionGroup>
      {preview.isShow && (
        <PreviewModal item={preview.preview} close={setPreview} />
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
  loading: PropTypes.bool.isRequired,
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

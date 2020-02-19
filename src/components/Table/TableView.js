import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'

const TableView = ({
  tableContent,
  hideChips,
  loading,
  selectedItem,
  match,
  tableHeaders,
  job,
  detailsMenu,
  page,
  handleCancel,
  handleShowElements,
  ...props
}) => {
  return (
    <div className="table" onClick={hideChips}>
      {loading && <Loader />}
      <div className={selectedItem && 'table__item_opened'}>
        <div className="table__content">
          <div className="table_head">
            {tableHeaders.map(item => (
              <div
                className={`table_head_item header__${item.size}`}
                key={item.header}
              >
                {item.header}
              </div>
            ))}
          </div>
          <div className="table_body">
            {tableContent.map((rowItem, i) => {
              if (match.path.includes('jobs')) {
                return (
                  <JobsTableRow
                    key={i}
                    match={match}
                    selectedItem={selectedItem}
                    index={i}
                    rowItem={rowItem}
                    {...props}
                  />
                )
              } else {
                return (
                  <ArtifactsTableRow
                    key={i}
                    rowItem={rowItem}
                    match={match}
                    index={i}
                    selectedItem={selectedItem}
                    {...props}
                  />
                )
              }
            })}
          </div>
        </div>
      </div>
      {selectedItem && (selectedItem.uid || selectedItem.hash) && (
        <Details
          match={match}
          item={selectedItem}
          detailsMenu={detailsMenu}
          page={page}
          handleCancel={handleCancel}
          handleShowElements={handleShowElements}
        />
      )}
    </div>
  )
}

TableView.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  job: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  hideChips: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default TableView

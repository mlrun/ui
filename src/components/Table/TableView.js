import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import JobsItemInternal from '../JobsItemInternal/JobsItemInternal'
import TableCell from '../../elements/TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'

const TableView = ({
  tableContent,
  hideChips,
  jobs,
  loading,
  selectedItem,
  handleSelectJob,
  match,
  handleHoverOnRowActions,
  handleMouseLeaveFromRowActions,
  convertToYaml,
  tableHeaders,
  job,
  ...props
}) => {
  return (
    <div className="table" onClick={hideChips}>
      {loading && <Loader />}
      <div className={selectedItem.uid && 'table__item_opened'}>
        <div className="table__content">
          <div className="table_head">
            {tableHeaders.map(item => (
              <div className={`table_head_item header_${item.size}`}>
                {item.header}
              </div>
            ))}
          </div>
          <div className="table_body">
            {tableContent.map((item, i) => {
              return (
                <div
                  key={`${item}${i}`}
                  className="table_body__row parent_row"
                  onMouseEnter={handleHoverOnRowActions}
                  onMouseLeave={handleMouseLeaveFromRowActions}
                >
                  {Object.values(item).map((value, index) => (
                    <TableCell
                      selectedItem={selectedItem}
                      item={item}
                      data={value}
                      link={
                        index === 0 &&
                        `/jobs/${item.uid}${
                          match.params.tab ? `/${match.params.tab}` : '/info'
                        }`
                      }
                      selectItem={handleSelectJob}
                    />
                  ))}
                  <div className="table_body__row__cell row__actions">
                    <ActionsMenu convertToYaml={convertToYaml} item={jobs[i]} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {selectedItem.uid && (
        <JobsItemInternal job={selectedItem} match={match} {...props} />
      )}
    </div>
  )
}

TableView.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleShowElements: PropTypes.func.isRequired,
  job: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  hideChips: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default TableView

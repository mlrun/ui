import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import jobsData from '../../components/JobsPage/jobsData'

const JobsTableRow = ({
  content,
  handleExpandRow,
  toggleConvertToYaml,
  handleSelectItem,
  index,
  match,
  rowItem,
  selectedItem,
  tableContent
}) => {
  const parent = useRef()

  return (
    <div
      className={`table-body__row ${
        rowItem.uid.value === selectedItem.uid &&
        parent.current &&
        !parent.current.classList.value.includes('parent-row-expanded')
          ? 'parent-row active'
          : parent.current &&
            parent.current.classList.value.includes('parent-row-expanded')
          ? 'parent-row parent-row-expanded'
          : 'parent-row'
      }`}
      ref={parent}
    >
      {parent.current &&
      parent.current.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          <div className="table-body__row">
            <TableCell
              handleExpandRow={handleExpandRow}
              data={rowItem.name}
              item={rowItem}
              selectItem={handleSelectItem}
              selectedItem={selectedItem}
              expandLink
              firstRow
            />
          </div>
          <>
            {tableContent.map((job, index) => {
              return (
                <div
                  className={
                    RegExp(job.uid.value.replace('...', ''), 'gi').test(
                      selectedItem.uid
                    )
                      ? 'table-body__row active'
                      : 'table-body__row'
                  }
                  key={index}
                >
                  {Object.values(job).map((value, i) => {
                    const currentItem =
                      content.length > 0 &&
                      content.find(item => item.uid === job.uid.value)
                    return (
                      <TableCell
                        data={i === 0 ? job.startTime : value}
                        item={currentItem}
                        link={
                          i === 0 &&
                          `/projects/${match.params.projectName}/jobs/${
                            currentItem.uid
                          }${
                            match.params.tab
                              ? `/${match.params.tab}`
                              : `/${jobsData.detailsMenu[0]}`
                          }`
                        }
                        key={value.value + i}
                        selectItem={handleSelectItem}
                        selectedItem={selectedItem}
                      />
                    )
                  })}
                  <div className="table-body__cell action_cell">
                    <TableActionsMenu
                      toggleConvertToYaml={toggleConvertToYaml}
                      item={content[index]}
                    />
                  </div>
                </div>
              )
            })}
          </>
        </div>
      ) : (
        <>
          {Object.values(rowItem).map((value, i, arr) => {
            return (
              <TableCell
                handleExpandRow={handleExpandRow}
                data={value}
                item={content.filter(item => item.uid === rowItem.uid.value)[0]}
                link={
                  i === 0 &&
                  `/projects/${match.params.projectName}/jobs/${content.length >
                    0 &&
                    content.filter(item => item.uid === rowItem.uid.value)[0]
                      ?.uid}${
                    match.params.tab
                      ? `/${match.params.tab}`
                      : `/${jobsData.detailsMenu[0]}`
                  }`
                }
                key={value.value + i}
                selectItem={handleSelectItem}
                selectedItem={selectedItem}
                expandLink={Array.isArray(tableContent)}
              />
            )
          })}
          <div className="table-body__cell action_cell">
            <TableActionsMenu
              toggleConvertToYaml={toggleConvertToYaml}
              item={content[index]}
            />
          </div>
        </>
      )}
    </div>
  )
}

JobsTableRow.defaultProps = {
  handleExpandRow: () => {}
}

JobsTableRow.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default JobsTableRow

import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import functionsData from '../../components/FunctionsPage/functionsData'
import { formatDatetime } from '../../utils'
import { compareDataForIdentity } from '../../utils/compareDataForIdentity'

const FunctionsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  index,
  match,
  rowItem,
  selectedItem,
  tableContent
}) => {
  const parent = useRef()

  const selectedItemDate =
    selectedItem.updated && formatDatetime(new Date(selectedItem.updated))
  const indentUpdatedOnMainRow = compareDataForIdentity(
    rowItem.updated.value,
    selectedItemDate
  )
  const indentHashOnMainRow = compareDataForIdentity(
    rowItem.hash.value,
    selectedItem.hash
  )

  return (
    <div
      className={`table-body__row ${
        indentUpdatedOnMainRow &&
        indentHashOnMainRow &&
        !parent.current?.classList.value.includes('parent-row-expanded')
          ? 'parent-row active'
          : parent.current &&
            parent.current.classList.value.includes('parent-row-expanded')
          ? 'parent-row parent-row-expanded'
          : 'parent-row'
      }`}
      ref={parent}
    >
      {parent.current?.classList.contains('parent-row-expanded') ? (
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
            {tableContent.map((func, index) => {
              const indentUpdatedOnSubRow = compareDataForIdentity(
                selectedItemDate,
                func.updated.value
              )
              const indexHashOnSubRow = compareDataForIdentity(
                func.hash.value,
                selectedItem.hash
              )

              return (
                <div
                  className={
                    indentUpdatedOnSubRow && indexHashOnSubRow
                      ? 'table-body__row active'
                      : 'table-body__row'
                  }
                  key={index}
                >
                  {Object.values(func).map((value, i) => {
                    const currentItem =
                      content.length > 0 &&
                      content.find(item => {
                        return (
                          formatDatetime(new Date(item.updated)) ===
                            func.updated.value && item.hash === func.hash.value
                        )
                      })

                    return (
                      <TableCell
                        data={i === 0 ? func.updated : value}
                        item={currentItem}
                        link={
                          i === 0 &&
                          `/projects/${match.params.projectName}/functions/${
                            currentItem.hash
                          }${
                            match.params.tab
                              ? `/${match.params.tab}`
                              : `/${functionsData.detailsMenu[0]}`
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
                      item={content[index]}
                      menu={actionsMenu}
                    />
                  </div>
                </div>
              )
            })}
          </>
        </div>
      ) : (
        <>
          {Object.values(rowItem).map((value, i) => {
            return (
              <TableCell
                data={value}
                expandLink={Array.isArray(tableContent)}
                handleExpandRow={handleExpandRow}
                item={
                  content.filter(item => item.hash === rowItem.hash.value)[0]
                }
                key={value.value + i}
                link={
                  i === 0 &&
                  `/projects/${
                    match.params.projectName
                  }/functions/${content.length > 0 &&
                    content.filter(item => item.hash === rowItem.hash.value)[0]
                      ?.hash}/${
                    match.params.tab
                      ? match.params.tab
                      : `${functionsData.detailsMenu[0].toLowerCase()}`
                  }`
                }
                match={match}
                selectedItem={selectedItem}
                selectItem={handleSelectItem}
              />
            )
          })}
          <div className="table-body__cell action_cell">
            <TableActionsMenu item={content[index]} menu={actionsMenu} />
          </div>
        </>
      )}
    </div>
  )
}

FunctionsTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default FunctionsTableRow

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { detailsMenu } from '../../components/FunctionsPage/functions.util'

const FunctionsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  match,
  rowItem,
  selectedItem,
  tableContent
}) => {
  const [currentItem, setCurrentItem] = useState(null)
  const parent = useRef()
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    getFunctionIdentifier(selectedItem, true) ===
      rowItem.name.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') &&
      'parent-row-expanded'
  )

  useEffect(() => {
    setCurrentItem(
      content.find(
        contentItem =>
          getFunctionIdentifier(contentItem, true) ===
          rowItem.name.identifierUnique
      )
    )
  }, [content, rowItem.name.identifierUnique, selectedItem])

  return (
    <div className={rowClassNames} ref={parent}>
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
              const subRowCurrentItem =
                content.length > 0 &&
                content.find(item => {
                  return (
                    getFunctionIdentifier(item, true) ===
                    func.name.identifierUnique
                  )
                })
              const isActiveSubRow =
                getFunctionIdentifier(selectedItem, true) ===
                func.name.identifierUnique

              return (
                <div
                  className={`table-body__row ${isActiveSubRow &&
                    'row_active'}`}
                  key={index}
                >
                  {Object.values(func).map((value, i) => {
                    return (
                      <TableCell
                        data={i === 0 ? func.updated : value}
                        item={subRowCurrentItem}
                        link={
                          i === 0 &&
                          `/projects/${match.params.projectName}/functions/${
                            subRowCurrentItem?.hash
                          }${
                            match.params.tab
                              ? `/${match.params.tab}`
                              : `/${detailsMenu[0].id}`
                          }`
                        }
                        key={value.id}
                        selectItem={handleSelectItem}
                        selectedItem={selectedItem}
                      />
                    )
                  })}
                  <div className="table-body__cell action_cell">
                    <ActionsMenu
                      dataItem={subRowCurrentItem}
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
              currentItem &&
              !value.hidden && (
                <TableCell
                  data={value}
                  expandLink={Array.isArray(tableContent)}
                  handleExpandRow={handleExpandRow}
                  item={currentItem}
                  key={value.id}
                  link={
                    i === 0 &&
                    `/projects/${
                      match.params.projectName
                    }/functions/${content.length > 0 && currentItem?.hash}/${
                      match.params.tab
                        ? match.params.tab
                        : `${detailsMenu[0].id}`
                    }`
                  }
                  match={match}
                  selectedItem={selectedItem}
                  selectItem={handleSelectItem}
                />
              )
            )
          })}
          <div className="table-body__cell action_cell">
            <ActionsMenu dataItem={currentItem} menu={actionsMenu} />
          </div>
        </>
      )}
    </div>
  )
}

FunctionsTableRow.propTypes = {
  actionsMenu: PropTypes.func.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default FunctionsTableRow

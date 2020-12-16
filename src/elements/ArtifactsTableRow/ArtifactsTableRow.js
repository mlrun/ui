import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import artifactsData from '../../components/Artifacts/artifactsData'

const ArtifactsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  index,
  match,
  rowItem,
  pageData,
  selectedItem,
  tableContent
}) => {
  const parent = useRef()
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    ((selectedItem?.db_key &&
      selectedItem?.db_key === content[index]?.db_key) ||
      (selectedItem?.name && selectedItem?.name === content[index]?.name)) &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') &&
      'parent-row-expanded'
  )

  return (
    <div className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          <div className="table-body__row">
            <TableCell
              handleExpandRow={handleExpandRow}
              data={rowItem.key || rowItem.name}
              item={rowItem}
              selectItem={handleSelectItem}
              selectedItem={selectedItem}
              expandLink
              firstRow
            />
          </div>
          <>
            {tableContent.map((artifact, index) => {
              const subRowClassNames = classnames(
                'table-body__row',
                ((selectedItem?.db_key &&
                  selectedItem?.db_key === content[index]?.db_key) ||
                  (selectedItem?.name &&
                    selectedItem?.name === content[index]?.name)) &&
                  'row_active'
              )
              let currentItem = {}

              return (
                <div className={subRowClassNames} key={index}>
                  {Object.values(artifact).map((value, i) => {
                    currentItem =
                      content.length > 0 &&
                      content.find(contentItem => {
                        return (
                          (contentItem.name === artifact.name ||
                            contentItem.db_key === artifact.db_key) &&
                          contentItem.tag === artifact.version.value
                        )
                      })

                    return (
                      <TableCell
                        data={
                          value.link
                            ? {
                                class: 'artifacts_medium',
                                value: currentItem.tag
                              }
                            : value
                        }
                        item={currentItem}
                        link={
                          value.link &&
                          (value.link === 'info'
                            ? `/projects/${
                                match.params.projectName
                              }/${pageData.page.toLowerCase()}${
                                match.params.pageTab
                                  ? `/${match.params.pageTab}`
                                  : ''
                              }/${rowItem.key.value}/${
                                match.params.tab
                                  ? match.params.tab
                                  : `${artifactsData.detailsMenu[0]}`
                              }`
                            : value.link)
                        }
                        match={match}
                        key={value.value + i}
                        selectItem={handleSelectItem}
                        selectedItem={selectedItem}
                      />
                    )
                  })}
                  <div className="table-body__cell action_cell">
                    <TableActionsMenu item={currentItem} menu={actionsMenu} />
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
                expandLink={Array.isArray(tableContent)}
                handleExpandRow={handleExpandRow}
                data={value}
                item={content[index]}
                key={Math.random() + i}
                link={
                  value.link &&
                  (value.link === 'info'
                    ? `/projects/${
                        match.params.projectName
                      }/${pageData.page.toLowerCase()}${
                        match.params.pageTab ? `/${match.params.pageTab}` : ''
                      }/${rowItem.key.value}/${
                        match.params.tab
                          ? match.params.tab
                          : `${artifactsData.detailsMenu[0]}`
                      }`
                    : value.link)
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

ArtifactsTableRow.defaultProps = {
  handleExpandRow: null,
  tableContent: null
}

ArtifactsTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({}))
}

export default React.memo(ArtifactsTableRow)

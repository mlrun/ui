import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import artifactsData from '../../components/Artifacts/artifactsData'
import { FEATURES_TAB } from '../../constants'

const ArtifactsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  index,
  mainRowItemsCount,
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
  const mainRowData = Object.values(rowItem)

  return (
    <div className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          <div className="table-body__row">
            {mainRowData.map((data, index) => {
              return index < mainRowItemsCount ? (
                <TableCell
                  key={data.value}
                  handleExpandRow={handleExpandRow}
                  data={data}
                  item={rowItem}
                  selectItem={handleSelectItem}
                  selectedItem={selectedItem}
                  expandLink={index === 0}
                  firstRow={index === 0}
                  link={data.link && data.link}
                />
              ) : null
            })}
          </div>
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

            if (match.params.pageTab === FEATURES_TAB) {
              currentItem = content.find(
                item =>
                  `${item.name}-${item.metadata?.name}` ===
                  `${artifact.key?.value}-${artifact.feature_set?.value}`
              )
            } else {
              currentItem = content.find(
                contentItem =>
                  (contentItem.name === artifact.name ||
                    contentItem.db_key === artifact.db_key) &&
                  contentItem.tag === artifact.version?.value
              )
            }

            return (
              <div className={subRowClassNames} key={index}>
                {pageData.selectedRowData &&
                (pageData.selectedRowData[artifact.key?.value]?.loading ||
                  pageData.selectedRowData[
                    `${artifact.key?.value}-${artifact.feature_set?.value}`
                  ]?.loading) ? (
                  <Loader key={index} />
                ) : pageData.selectedRowData &&
                  (pageData.selectedRowData[artifact.key?.value]?.error ||
                    pageData.selectedRowData[
                      `${artifact.key.value}-${artifact.feature_set?.value}`
                    ]?.error) ? (
                  <ErrorMessage
                    message={
                      pageData.selectedRowData[artifact.key?.value]?.error
                        ?.message ||
                      pageData.selectedRowData[
                        `${artifact.key.value}-${artifact.feature_set?.value}`
                      ]?.error.message
                    }
                  />
                ) : (
                  <>
                    {Object.values(artifact).map((value, i) => {
                      return (
                        <TableCell
                          data={
                            value.expandedCellContent
                              ? value.expandedCellContent
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
                      <TableActionsMenu
                        item={currentItem}
                        menu={actionsMenu}
                        subRow
                      />
                    </div>
                  </>
                )}
              </div>
            )
          })}
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
                  value.link === 'info'
                    ? `/projects/${
                        match.params.projectName
                      }/${pageData.page.toLowerCase()}${
                        match.params.pageTab ? `/${match.params.pageTab}` : ''
                      }/${rowItem.key.value}/${
                        match.params.tab
                          ? match.params.tab
                          : `${artifactsData.detailsMenu[0]}`
                      }`
                    : value.link
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
  mainRowItemsCount: 1,
  tableContent: null
}

ArtifactsTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  mainRowItemsCount: PropTypes.number,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({}))
}

export default React.memo(ArtifactsTableRow)

import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import FeatureSetsPanelTableRow from '../FeatureSetsPanelTableRow/FeatureSetsPanelTableRow'

import './featureSetsPanelTable.scss'

const FeatureSetsPanelTableView = ({
  actionButton,
  actionsMenu,
  addNewItem,
  children,
  className,
  content,
  headers
}) => {
  const tableClassNames = classnames(
    'new-item-side-panel__table',
    'feature-set-panel__table',
    addNewItem && 'no-border',
    className
  )

  return (
    <div className={tableClassNames}>
      {headers.length > 0 && (
        <div className="table__header table__row no-border_top no-hover">
          {headers.map((header, index) => (
            <div className="table__cell" key={index}>
              {header.label}
            </div>
          ))}
          <div className="table__cell-actions" />
        </div>
      )}
      {content?.map((contentItem, index) => (
        <FeatureSetsPanelTableRow
          actionsMenu={actionsMenu}
          actionButton={actionButton}
          contentItem={contentItem}
          key={index}
        />
      ))}
      {children}
    </div>
  )
}

FeatureSetsPanelTableView.defaultProps = {
  actionButton: null,
  actionsMenu: [],
  className: ''
}

FeatureSetsPanelTableView.propTypes = {
  actionButton: PropTypes.shape({
    className: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})),
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default FeatureSetsPanelTableView

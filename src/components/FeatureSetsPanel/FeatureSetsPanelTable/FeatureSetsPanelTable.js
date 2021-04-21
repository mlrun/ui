import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelTableView from './FeatureSetsPanelTableView'

const FeatureSetsPanelTable = ({
  actionsMenu,
  actionButton,
  addNewItem,
  className,
  children,
  content,
  headers
}) => {
  return (
    <FeatureSetsPanelTableView
      actionButton={actionButton}
      actionsMenu={actionsMenu}
      addNewItem={addNewItem}
      children={children}
      className={className}
      content={content}
      headers={headers}
    />
  )
}

FeatureSetsPanelTable.defaultProps = {
  actionButton: null,
  actionsMenu: [],
  className: ''
}

FeatureSetsPanelTable.propTypes = {
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

export default FeatureSetsPanelTable

import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Arrow } from '../../../images/arrow.svg'
import Accordion from '../../../common/Accordion/Accordion'

const ConfigFunctionTemplate = ({ selectedItem }) => {
  return (
    <Accordion
      accordionClassName="config-item"
      icon={<Arrow />}
      iconClassName="expand-icon"
    >
      <div className="config-item__title">Function template</div>
      <div className="config-item__content">
        <div className="row">
          <div className="row-label">URL:</div>
          <div className="row-value">{selectedItem.function?.url}</div>
        </div>
        <div className="row">
          <div className="row-label">Kind:</div>
          <div className="row-value">{selectedItem.function?.kind}</div>
        </div>
        <div className="row">
          <div className="row-label">Image:</div>
          <div className="row-value">{selectedItem.function?.image}</div>
        </div>
      </div>
    </Accordion>
  )
}

ConfigFunctionTemplate.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default ConfigFunctionTemplate

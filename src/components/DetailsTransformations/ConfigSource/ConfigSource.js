import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import cronstrue from 'cronstrue'

import { ReactComponent as Arrow } from '../../../images/arrow.svg'
import Accordion from '../../../common/Accordion/Accordion'
import ChipCell from '../../../common/ChipCell/ChipCell'

const ConfigSource = ({ selectedItem }) => {
  return (
    <Accordion
      accordionClassName="config-item"
      icon={<Arrow />}
      iconClassName="expand-icon"
      openByDefault
    >
      <div className="config-item__title">Source</div>
      <div className="config-item__content">
        <div className="row">
          <div className="row-label">Kind:</div>
          <div className="row-value">{selectedItem.source?.kind}</div>
        </div>
        <div className="row">
          <div className="row-label">URL:</div>
          <div className="row-value">{selectedItem.source?.path}</div>
        </div>
        <div className="row">
          <div className="row-label">Attributes:</div>
          <div className="row-value">
            <ChipCell
              elements={map(
                selectedItem.source?.attributes,
                (value, key) => `${key}: ${value}`
              )}
              tooltip
            />
          </div>
        </div>
        <div className="row">
          <div className="row-label">Workers:</div>
          <div className="row-value">{selectedItem.source?.workers}</div>
        </div>
        <div className="row">
          <div className="row-label">Schedule:</div>
          <div className="row-value">
            {selectedItem.source?.schedule &&
              cronstrue.toString(selectedItem.source?.schedule)}
          </div>
        </div>
        <div className="row">
          <div className="row-label">Key column:</div>
          <div className="row-value">{selectedItem.source?.key_column}</div>
        </div>
        <div className="row">
          <div className="row-label">Time column:</div>
          <div className="row-value">{selectedItem.source?.time_column}</div>
        </div>
      </div>
    </Accordion>
  )
}

ConfigSource.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default ConfigSource

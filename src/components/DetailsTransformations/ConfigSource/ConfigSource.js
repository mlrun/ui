import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import cronstrue from 'cronstrue'

import { ReactComponent as Arrow } from '../../../images/arrow.svg'
import Accordion from '../../../common/Accordion/Accordion'
import ChipCell from '../../../common/ChipCell/ChipCell'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../../common/Tooltip/Tooltip'

const ConfigSource = ({ selectedItem }) => {
  return (
    <Accordion
      accordionClassName="config-item"
      icon={<Arrow />}
      iconClassName="expand-icon"
    >
      <div className="config-item__title">Source</div>
      <div className="config-item__content">
        <div className="row">
          <div className="row-label">Kind:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.source?.kind} />
              }
            >
              {selectedItem.source?.kind}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">URL:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.source?.path} />
              }
            >
              {selectedItem.source?.path}
            </Tooltip>
          </div>
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
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.source?.workers} />
              }
            >
              {selectedItem.source?.workers}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Schedule:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={
                    selectedItem.source?.schedule &&
                    cronstrue.toString(selectedItem.source?.schedule)
                  }
                />
              }
            >
              {selectedItem.source?.schedule &&
                cronstrue.toString(selectedItem.source?.schedule)}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Key column:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.source?.key_column} />
              }
            >
              {selectedItem.source?.key_column}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Time column:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.source?.time_column} />
              }
            >
              {selectedItem.source?.time_column}
            </Tooltip>
          </div>
        </div>
      </div>
    </Accordion>
  )
}

ConfigSource.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default ConfigSource

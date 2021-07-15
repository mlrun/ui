import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Arrow } from '../../../images/arrow.svg'
import Accordion from '../../../common/Accordion/Accordion'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../../common/Tooltip/Tooltip'

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
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.function?.url} />
              }
            >
              {selectedItem.function?.url}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Kind:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.function?.kind} />
              }
            >
              {selectedItem.function?.kind}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Image:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate text={selectedItem.function?.image} />
              }
            >
              {selectedItem.function?.image}
            </Tooltip>
          </div>
        </div>
      </div>
    </Accordion>
  )
}

ConfigFunctionTemplate.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default ConfigFunctionTemplate

import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import Accordion from '../../common/Accordion/Accordion'

import Arrow from 'igz-controls/images/arrow.svg?react'

const RouterList = ({ graph }) => {
  const routesNames = Object.keys(graph?.routes || {})

  if (!routesNames.length) {
    return null
  }

  return (
    <div className="graph-container pipeline-content" data-testid="router-list">
      <div className="graph-pane">
        <div className="graph-pane__section">
          <Accordion
            accordionClassName="graph-pane__expand-item"
            icon={<Arrow />}
            iconClassName="graph-pane__expand-icon"
            openByDefault
          >
            <div className="graph-pane__expand-title">
              {graph.class_args?.name || graph.name || 'Router'}
            </div>
            <div className="graph-pane__expand-content">
              {routesNames.map(name => (
                <div className="graph-pane__row" key={name}>
                  <div className="graph-pane__row-value">
                    <Tooltip template={<TextTooltipTemplate text={name} />}>{name}</Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

RouterList.propTypes = {
  graph: PropTypes.object.isRequired
}

export default RouterList

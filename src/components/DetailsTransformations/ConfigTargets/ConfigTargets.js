import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Arrow } from '../../../images/arrow.svg'
import Accordion from '../../../common/Accordion/Accordion'
import Select from '../../../common/Select/Select'
import './configTargets.scss'

const ConfigTargets = ({ steps, targets }) => {
  const onSelectTargetAfterStep = (targetName, stepName) => {
    // TODO
  }

  return (
    <Accordion
      accordionClassName="config-item targets"
      icon={<Arrow />}
      iconClassName="expand-icon"
      openByDefault
    >
      <div className="config-item__title">Targets</div>
      <div className="config-item__content">
        {targets.map((target, index) => (
          <div className="row" key={index}>
            <div className="target-name">{target.name}</div>
            <div className="target-after">
              <Select
                density="dense"
                disabled
                label="After:"
                onClick={step => onSelectTargetAfterStep(target.name, step)}
                options={steps}
                selectedId={target.after_state}
                withoutBorder
              />
            </div>
          </div>
        ))}
      </div>
    </Accordion>
  )
}

ConfigTargets.defaultProps = {
  steps: [],
  targets: []
}

ConfigTargets.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  targets: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default ConfigTargets

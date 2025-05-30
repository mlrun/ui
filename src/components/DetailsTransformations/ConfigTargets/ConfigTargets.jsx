/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'

import Arrow from 'igz-controls/images/arrow.svg?react'
import Accordion from '../../../common/Accordion/Accordion'
import Select from '../../../common/Select/Select'
import './configTargets.scss'

const ConfigTargets = ({ steps = [], targets = [] }) => {
  // eslint-disable-next-line no-unused-vars
  const onSelectTargetAfterStep = (targetName, stepName) => {
    // TODO
  }

  return (
    <Accordion
      accordionClassName="config-item targets"
      icon={<Arrow />}
      iconClassName="expand-icon"
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

ConfigTargets.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ConfigTargets

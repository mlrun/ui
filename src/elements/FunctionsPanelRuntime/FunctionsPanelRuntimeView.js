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

import PanelSection from '../PanelSection/PanelSection'
import FunctionsPanelSecrets from '../FunctionsPanelSecrets/FunctionsPanelSecrets'
import FunctionsPanelTopology from '../FunctionsPanelTopology/FunctionsPanelTopology'
import FunctionsPanelAdvanced from '../FunctionsPanelAdvanced/FunctionsPanelAdvanced'

import './functionsPanelRuntime.scss'

const FunctionsPanelRuntimeView = ({
  defaultData,
  functionsStore,
  isStagingMode,
  sections,
  setValidation,
  validation
}) => {
  return (
    <div className="functions-panel__item new-item-side-panel__item runtime">
      <PanelSection
        title={`${functionsStore.newFunction.kind} runtime configuration`}
      >
        {sections.map(section =>
          section.id === 'topology' ? (
            <FunctionsPanelTopology
              defaultData={defaultData}
              key={section.id}
            />
          ) : section.id === 'secrets' && isStagingMode ? (
            <FunctionsPanelSecrets defaultData={defaultData} key={section.id} />
          ) : section.id === 'advanced' ? (
            <FunctionsPanelAdvanced
              defaultData={defaultData}
              key={section.id}
              setValidation={setValidation}
              validation={validation}
            />
          ) : null
        )}
      </PanelSection>
    </div>
  )
}

FunctionsPanelRuntimeView.propTypes = {
  defaultData: PropTypes.shape({}).isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  isStagingMode: PropTypes.bool.isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FunctionsPanelRuntimeView

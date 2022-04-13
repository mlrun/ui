import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
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
      <FunctionsPanelSection
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
      </FunctionsPanelSection>
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

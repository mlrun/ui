import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import FunctionsPanelSecrets from '../FunctionsPanelSecrets/FunctionsPanelSecrets'
import FunctionsPanelTopology from '../FunctionsPanelTopology/FunctionsPanelTopology'
import FunctionsPanelAdvanced from '../FunctionsPanelAdvanced/FunctionsPanelAdvanced'

import './functionsPanelRuntime.scss'

const FunctionsPanelRuntimeView = ({ functionsStore, sections }) => {
  return (
    <div className="functions-panel__item new-item-side-panel__item runtime">
      <FunctionsPanelSection
        title={`${functionsStore.newFunction.kind} runtime configuration`}
      >
        {sections.map(section =>
          section.id === 'topology' ? (
            <FunctionsPanelTopology key={section.id} />
          ) : section.id === 'secrets' ? (
            <FunctionsPanelSecrets key={section.id} />
          ) : section.id === 'advanced' ? (
            <FunctionsPanelAdvanced />
          ) : null
        )}
      </FunctionsPanelSection>
    </div>
  )
}

FunctionsPanelRuntimeView.propTypes = {
  functionsStore: PropTypes.shape({}).isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default FunctionsPanelRuntimeView

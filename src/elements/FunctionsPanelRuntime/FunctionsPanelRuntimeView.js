import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import FunctionsPanelSecrets from '../FunctionsPanelSecrets/FunctionsPanelSecrets'
import FunctionsPanelTopology from '../FunctionsPanelTopology/FunctionsPanelTopology'
import FunctionsPanelAdvanced from '../FunctionsPanelAdvanced/FunctionsPanelAdvanced'

import { isDemoMode } from '../../utils/helper'

import './functionsPanelRuntime.scss'

const FunctionsPanelRuntimeView = ({
  defaultData,
  functionsStore,
  location,
  sections
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
          ) : section.id === 'secrets' && isDemoMode(location.search) ? (
            <FunctionsPanelSecrets defaultData={defaultData} key={section.id} />
          ) : section.id === 'advanced' ? (
            <FunctionsPanelAdvanced
              defaultData={defaultData}
              key={section.id}
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
  location: PropTypes.shape({}).isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default FunctionsPanelRuntimeView

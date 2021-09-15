import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import FunctionPanelTopologyModelTable from '../FunctionPanelTopologyModelTable/FunctionPanelTopologyModelTable'
import Select from '../../common/Select/Select'
import CheckBox from '../../common/CheckBox/CheckBox'

import { routerTypeOptions } from './functionsPanelTopology.util'

import './functionsPanelTopology.scss'

const FunctionsPanelTopologyView = ({
  defaultData,
  data,
  handleTrackModels,
  selectRouterType
}) => {
  return (
    <FunctionsPanelSection className="topology" title="Topology">
      <div>
        <Select
          className="router-type"
          density="dense"
          floatingLabel
          label="Router Type"
          onClick={selectRouterType}
          options={routerTypeOptions}
          selectedId={data.class_name}
        />
      </div>
      <FunctionPanelTopologyModelTable defaultData={defaultData} />
      <CheckBox
        className="topology__model-tracking"
        item={{ id: 'trackModels', label: 'Model Tracking' }}
        onChange={handleTrackModels}
        selectedId={data.track_models}
      />
    </FunctionsPanelSection>
  )
}

FunctionsPanelTopologyView.propTypes = {
  defaultData: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({}).isRequired,
  handleTrackModels: PropTypes.func.isRequired,
  selectRouterType: PropTypes.func.isRequired
}

export default FunctionsPanelTopologyView

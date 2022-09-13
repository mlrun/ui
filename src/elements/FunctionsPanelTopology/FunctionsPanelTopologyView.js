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
    <PanelSection className="topology" title="Topology">
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
    </PanelSection>
  )
}

FunctionsPanelTopologyView.propTypes = {
  defaultData: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({}).isRequired,
  handleTrackModels: PropTypes.func.isRequired,
  selectRouterType: PropTypes.func.isRequired
}

export default FunctionsPanelTopologyView

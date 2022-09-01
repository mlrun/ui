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

import Select from '../../common/Select/Select'
import { VolumesTable } from '../VolumesTable/VolumesTable'
import PanelSection from '../PanelSection/PanelSection'
import PanelResourcesUnits from '../PanelResourcesUnits/PanelResourcesUnits'

import { volumePreemptionModeOptions } from '../../utils/panelResources.util'
import { VOLUME_MOUNT_MANUAL_TYPE, volumeMountOptions } from './functionsPanelResources.util'
import { PANEL_CREATE_MODE, PANEL_EDIT_MODE } from '../../constants'

import './functionsPanelResources.scss'

const FunctionsPanelResourcesView = ({
  data,
  gpuType,
  handleAddNewVolume,
  handleDeleteVolume,
  handleEditVolume,
  handleSelectCpuUnit,
  handleSelectMemoryUnit,
  handleSelectPreemptionMode,
  handleSelectVolumeMount,
  mode,
  podsPriorityClassName,
  selectPodsPriorityClassName,
  setCpuValue,
  setGpuValue,
  setMemoryValue,
  validFunctionPriorityClassNames,
  validation
}) => {
  return (
    <div className="functions-panel__item resources new-item-side-panel__item">
      <PanelSection title="Resources" />
      <div className="pods">
        {validFunctionPriorityClassNames.length > 0 && (
          <PanelSection title="Pods priority">
            <Select
              className="pods-priority"
              onClick={selectPodsPriorityClassName}
              options={validFunctionPriorityClassNames}
              selectedId={podsPriorityClassName}
              withSelectedIcon
            />
          </PanelSection>
        )}
        {data.preemptionMode && (
          <PanelSection title="Run On Spot Nodes">
            <Select
              className="pods-toleration"
              options={volumePreemptionModeOptions}
              onClick={handleSelectPreemptionMode}
              selectedId={data.preemptionMode}
              withSelectedIcon
            />
          </PanelSection>
        )}
      </div>
      <PanelSection
        className="volumes-section"
        title="Volumes"
        tip="Volumes that define data paths and the required information for accessing the data from the function"
      >
        {mode === PANEL_CREATE_MODE && (
          <Select
            className="volume-mount"
            floatingLabel
            label="Volume mount"
            options={volumeMountOptions}
            onClick={handleSelectVolumeMount}
            selectedId={data.volumeMount}
            withSelectedIcon
          />
        )}
        {(data.volumeMount === VOLUME_MOUNT_MANUAL_TYPE || mode === PANEL_EDIT_MODE) && (
          <VolumesTable
            handleAddNewVolume={handleAddNewVolume}
            handleDelete={handleDeleteVolume}
            handleEdit={handleEditVolume}
            className="volumes"
            volumeMounts={data.volumeMounts}
            volumes={data.volumes}
          />
        )}
      </PanelSection>
      <PanelResourcesUnits
        data={data}
        gpuType={gpuType}
        handleSelectCpuUnit={handleSelectCpuUnit}
        handleSelectMemoryUnit={handleSelectMemoryUnit}
        setCpuValue={setCpuValue}
        setGpuValue={setGpuValue}
        setMemoryValue={setMemoryValue}
        validation={validation}
      />
    </div>
  )
}

FunctionsPanelResourcesView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  gpuType: PropTypes.string.isRequired,
  handleAddNewVolume: PropTypes.func.isRequired,
  handleDeleteVolume: PropTypes.func.isRequired,
  handleEditVolume: PropTypes.func.isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  handleSelectPreemptionMode: PropTypes.func.isRequired,
  handleSelectVolumeMount: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  podsPriorityClassName: PropTypes.string.isRequired,
  selectPodsPriorityClassName: PropTypes.func.isRequired,
  setCpuValue: PropTypes.func.isRequired,
  setGpuValue: PropTypes.func.isRequired,
  setMemoryValue: PropTypes.func.isRequired,
  validFunctionPriorityClassNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  validation: PropTypes.shape({})
}

export default FunctionsPanelResourcesView

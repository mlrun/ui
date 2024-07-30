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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ChipCell from '../../../common/ChipCell/ChipCell'

import { generateKeyValues, parseKeyValues } from '../../../utils'
import { getChipOptions } from '../../../utils/getChipOptions'

const ProjectLabels = ({
  addProjectLabel = () => {},
  isEditMode = false,
  labels = {},
  shortChips = false,
  updateProjectLabel = () => {},
  visibleChipsMaxLength = 'all'
}) => {
  const projectLabels = useMemo(
    () => (!isEmpty(labels) ? parseKeyValues(labels || {}) : []),
    [labels]
  )
  const handleAddProjectLabel = (label, labels) => {
    const objectLabels = generateKeyValues(labels)
    const newLabel = {
      [label.split(':')[0]]: label.split(':')[1].replace(' ', '')
    }

    addProjectLabel(newLabel, objectLabels)
  }

  const handleUpdateProjectLabels = labels => {
    const objectLabels = {}

    labels.forEach(label => {
      const splitedLabel = label.split(':')

      objectLabels[splitedLabel[0]] = splitedLabel[1].replace(' ', '')
    })

    updateProjectLabel(objectLabels)
  }

  return (
    <ChipCell
      chipOptions={getChipOptions('metrics')}
      addChip={handleAddProjectLabel}
      editChip={handleUpdateProjectLabels}
      elements={projectLabels}
      isEditMode={isEditMode}
      removeChip={handleUpdateProjectLabels}
      visibleChipsMaxLength={visibleChipsMaxLength}
      shortChips={shortChips}
    />
  )
}

ProjectLabels.propTypes = {
  addProjectLabel: PropTypes.func,
  isEditMode: PropTypes.bool,
  labels: PropTypes.object,
  shortChips: PropTypes.bool,
  updateProjectLabel: PropTypes.func,
  visibleChipsMaxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default ProjectLabels

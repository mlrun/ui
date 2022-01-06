import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ChipCell from '../../../common/ChipCell/ChipCell'

import { generateKeyValues, parseKeyValues } from '../../../utils'
import { getChipOptions } from '../../../utils/getChipOptions'

const ProjectLabels = props => {
  const {
    addProjectLabel,
    isEditMode,
    labels,
    shortChips,
    updateProjectLabel,
    visibleChipsMaxLength
  } = props

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
      chipOptions={getChipOptions('labels')}
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

ProjectLabels.defaultProps = {
  visibleChipsMaxLength: 'all'
}

ProjectLabels.propTypes = {
  addProjectLabel: PropTypes.func,
  isEditMode: PropTypes.bool,
  labels: PropTypes.arrayOf(PropTypes.string),
  shortChips: PropTypes.bool,
  updateProjectLabel: PropTypes.func,
  visibleChipsMaxLength: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default ProjectLabels

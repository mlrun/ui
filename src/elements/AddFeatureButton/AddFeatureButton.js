import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import tableActions from '../../actions/table'

import { ReactComponent as AddCircle } from '../../images/add-circle.svg'
import { ReactComponent as AddCircleQuestion } from '../../images/add-circle-question.svg'

import './addFeatureButton.scss'

const AddFeatureButton = ({ feature, tableStore, updateGroupedFeatures }) => {
  const [isFeatureInvalid, setIsFeatureInvalid] = useState(true)
  const [isFeatureInList, setIsFeatureInList] = useState(true)
  const [tooltip, setTooltip] = useState('')

  useEffect(() => {
    setTooltip(
      isFeatureInvalid
        ? "This feature cannot be added because features from another tag of this feature's " +
            'set are already in the vector. If you want to allow adding this feature you must first remove ' +
            'all those features from the vector.'
        : 'Add feature'
    )
  }, [isFeatureInvalid])

  useEffect(() => {
    const currentFeatureInList = tableStore.features.groupedFeatures?.[
      tableStore.features.currentProject
    ]?.find(
      featureInList =>
        featureInList.feature === feature.name &&
        featureInList.featureSet === feature.metadata.name &&
        featureInList.tag === feature.metadata.tag
    )

    const isFeatureInvalid = tableStore.features.groupedFeatures?.[
      tableStore.features.currentProject
    ]?.find(
      featureInList =>
        featureInList.featureSet === feature.metadata.name &&
        featureInList.tag !== feature.metadata.tag
    )

    setIsFeatureInList(Boolean(currentFeatureInList))
    setIsFeatureInvalid(Boolean(isFeatureInvalid))
  }, [
    tableStore.features.groupedFeatures,
    tableStore.features.currentProject,
    feature
  ])

  const addFeature = () => {
    const existingFeatures =
      tableStore.features.groupedFeatures[tableStore.features.currentProject] ??
      []
    const newFeature = {
      project: feature.metadata.project,
      featureSet: feature.metadata.name,
      tag: feature.metadata.tag,
      feature: feature.name,
      alias: '',
      originalTemplate: `${feature.metadata.name}:${feature.metadata.tag}.${feature.name}`
    }

    updateGroupedFeatures([...existingFeatures, newFeature])
  }

  return (
    <div className="add-feature-button">
      {isFeatureInList ? null : isFeatureInvalid ? (
        <Tooltip template={<TextTooltipTemplate text={tooltip} />}>
          <AddCircleQuestion />
        </Tooltip>
      ) : (
        <Tooltip template={<TextTooltipTemplate text={tooltip} />}>
          <AddCircle onClick={addFeature} />
        </Tooltip>
      )}
    </div>
  )
}

AddFeatureButton.propTypes = {
  feature: PropTypes.shape({}).isRequired
}

export default connect(
  tableStore => ({
    ...tableStore
  }),
  { ...tableActions }
)(AddFeatureButton)

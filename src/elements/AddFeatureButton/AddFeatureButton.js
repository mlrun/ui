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
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { updateGroupedFeatures } from '../../reducers/tableReducer'

import { ReactComponent as AddCircle } from 'igz-controls/images/add-circle.svg'
import { ReactComponent as AddCircleQuestion } from 'igz-controls/images/add-circle-question.svg'

import './addFeatureButton.scss'

const AddFeatureButton = ({ feature }) => {
  const [isFeatureInvalid, setIsFeatureInvalid] = useState(true)
  const [isFeatureInList, setIsFeatureInList] = useState(true)
  const [tooltip, setTooltip] = useState('')
  const tableStore = useSelector(store => store.tableStore)
  const dispatch = useDispatch()

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
  }, [tableStore.features.groupedFeatures, tableStore.features.currentProject, feature])

  const addFeature = () => {
    const existingFeatures =
      tableStore.features.groupedFeatures[tableStore.features.currentProject] ?? []
    const newFeature = {
      project: feature.metadata.project,
      featureSet: feature.metadata.name,
      tag: feature.metadata.tag,
      feature: feature.name,
      alias: '',
      originalTemplate: `${feature.metadata.project}/${feature.metadata.name}:${feature.metadata.tag}.${feature.name}`
    }

    dispatch(
      updateGroupedFeatures({
        groupedFeatures: [...existingFeatures, newFeature],
        project: tableStore.features.currentProject
      })
    )
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

export default AddFeatureButton

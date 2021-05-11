import React, { useState } from 'react'
import { connect } from 'react-redux'

import FeatureSetsPanelTargetStoreView from './FeatureSetsPanelTargetStoreView'

import artifactsAction from '../../../actions/artifacts'
import { checkboxModels } from './featureSetsPanelTargetStore.util'

const FeatureSetsPanelTargetStore = ({
  artifactsStore,
  setNewFeatureSetTarget
}) => {
  const [selectedTargetKind, setSelectedTargetKind] = useState([])
  const [isOtherTargetExists, setOtherTargetExists] = useState(false)
  const [otherKindData, setOtherKindData] = useState({
    kind: 'csv',
    path: ''
  })

  const handleSelectTargetKind = kindId => {
    let newTargets = artifactsStore.newFeatureSet.spec.targets

    if (selectedTargetKind.find(kind => kind === kindId)) {
      newTargets = newTargets.filter(
        kind => kind.name !== checkboxModels[kindId].data.name
      )
      setSelectedTargetKind(state => state.filter(kind => kind !== kindId))

      if (kindId === checkboxModels.other.id) {
        setOtherTargetExists(false)
      }
    } else {
      newTargets.push(checkboxModels[kindId].data)
      setSelectedTargetKind(state => [...state, kindId])

      if (kindId === checkboxModels.other.id) {
        setOtherTargetExists(true)
      }
    }

    setNewFeatureSetTarget(newTargets)
  }

  const handleOtherKindPathOnBlur = event => {
    setNewFeatureSetTarget(
      artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === 'other') {
          targetKind.path = event.target.value
        }

        return targetKind
      })
    )
  }

  const handleOtherKindTypeChange = kind => {
    setOtherKindData(state => ({ ...state, kind }))
    setNewFeatureSetTarget(
      artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === 'other') {
          targetKind.kind = kind
        }

        return targetKind
      })
    )
  }

  return (
    <FeatureSetsPanelTargetStoreView
      handleOtherKindPathOnBlur={handleOtherKindPathOnBlur}
      handleOtherKindTypeChange={handleOtherKindTypeChange}
      handleSelectTargetKind={handleSelectTargetKind}
      isOtherTargetExists={isOtherTargetExists}
      otherKindData={otherKindData}
      selectedTargetKind={selectedTargetKind}
      setOtherKindData={setOtherKindData}
    />
  )
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanelTargetStore)

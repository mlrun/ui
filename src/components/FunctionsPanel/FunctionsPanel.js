import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { useHistory } from 'react-router-dom'

import FunctionsPanelView from './FunctionsPanelView'

import functionsActions from '../../actions/functions'

const FunctionsPanel = ({
  artifactsStore,
  closePanel,
  createNewFeatureSet,
  createFeatureSetSuccess,
  project,
  removeArtifactsError,
  startFeatureSetIngest
}) => {
  const [isNameValid, setNameValid] = useState(true)
  const [isTagValid, setTagValid] = useState(true)

  // const history = useHistory()

  // const handleSave = startIngestion => {
  //   if (isNameValid && isVersionValid && isUrlValid) {
  //     if (artifactsStore.newFeatureSet.metadata.name.length === 0) {
  //       return setNameValid(false)
  //     }
  //
  //     if (artifactsStore.newFeatureSet.metadata.tag.length === 0) {
  //       return setVersionValid(false)
  //     }
  //
  //     if (artifactsStore.newFeatureSet.spec.source.path.length === 0) {
  //       return setUrlValid(false)
  //     }
  //
  //     if (artifactsStore.error) {
  //       removeArtifactsError()
  //     }
  //
  //     createNewFeatureSet(
  //       {
  //         kind: 'FeatureSet',
  //         ...artifactsStore.newFeatureSet
  //       },
  //       project
  //     ).then(result => {
  //       if (startIngestion) {
  //         return handleStartFeatureSetIngest(result)
  //       }
  //
  //       createFeatureSetSuccess().then(() => {
  //         history.push(
  //           `/projects/${project}/feature-store/feature-sets/${result.data.metadata.name}/${result.data.metadata.tag}/overview`
  //         )
  //       })
  //     })
  //   }
  // }

  // const handleStartFeatureSetIngest = result => {
  //   return startFeatureSetIngest(
  //     project,
  //     result.data.metadata.name,
  //     result.data.metadata.uid,
  //     result.data.spec.source,
  //     result.data.spec.targets
  //   ).then(() => {
  //     createFeatureSetSuccess().then(() => {
  //       history.push(
  //         `/projects/${project}/feature-store/feature-sets/${result.data.metadata.name}/${result.data.metadata.tag}/overview`
  //       )
  //     })
  //   })
  // }

  return (
    <FunctionsPanelView
      closePanel={closePanel}
      // error={artifactsStore.error}
      // handleSave={handleSave}
      isNameValid={isNameValid}
      isTagValid={isTagValid}
      // loading={artifactsStore.loading}
      // removeArtifactsError={removeArtifactsError}
      setNameValid={setNameValid}
      setTagValid={setTagValid}
      // setTransformationsValue={setTransformationsValue}
      // transformationsValue={transformationsValue}
    />
  )
}

FunctionsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions
})(FunctionsPanel)

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import FeatureSetsPanelView from './FeatureSetsPanelView'

import artifactsAction from '../../actions/artifacts'

const FeatureSetsPanel = ({
  artifactsStore,
  closePanel,
  createNewFeatureSet,
  createNewFeatureSetError,
  createFeatureSetSuccess,
  project,
  removeArtifactsError
}) => {
  const [isNameValid, setNameValid] = useState(true)
  const [isVersionValid, setVersionValid] = useState(true)
  const [isUrlValid, setUrlValid] = useState(true)
  const history = useHistory()
  const dispatch = useDispatch()

  const handleSave = () => {
    if (isNameValid && isVersionValid && isUrlValid) {
      if (artifactsStore.newFeatureSet.metadata.name.length === 0) {
        return setNameValid(false)
      }

      if (artifactsStore.newFeatureSet.metadata.tag.length === 0) {
        return setVersionValid(false)
      }

      if (artifactsStore.newFeatureSet.spec.source.path.length === 0) {
        return setUrlValid(false)
      }

      if (artifactsStore.error) {
        removeArtifactsError()
      }

      createNewFeatureSet(
        {
          kind: 'FeatureSet',
          ...artifactsStore.newFeatureSet
        },
        project
      )
        .then(result => {
          createFeatureSetSuccess().then(() => {
            history.push(
              `/projects/${project}/feature-store/feature-sets/${result.data.metadata.name}/${result.data.metadata.tag}/overview`
            )
          })
        })
        .catch(error => {
          dispatch(createNewFeatureSetError(error.message))
        })
    }
  }

  return (
    <FeatureSetsPanelView
      closePanel={closePanel}
      error={artifactsStore.error}
      handleSave={handleSave}
      isNameValid={isNameValid}
      isUrlValid={isUrlValid}
      isVersionValid={isVersionValid}
      removeArtifactsError={removeArtifactsError}
      setNameValid={setNameValid}
      setUrlValid={setUrlValid}
      setVersionValid={setVersionValid}
    />
  )
}

FeatureSetsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ artifactsStore }) => ({ artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanel)

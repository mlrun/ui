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
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import FeatureSetsPanelTitleView from './FeatureSetsPanelTitleView'

import {
  setNewFeatureSetName,
  setNewFeatureSetPassthrough
} from '../../../reducers/featureStoreReducer'

const FeatureSetsPanelTitle = ({
  closePanel,
  formState,
  frontendSpec,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    passthrough: '',
    version: ''
  })
  const dispatch = useDispatch()
  const featureStore = useSelector(state => state.featureStore)

  const handleNameOnBlur = () => {
    if (data.name !== featureStore.newFeatureSet.metadata.name) {
      dispatch(setNewFeatureSetName(data.name))
    }
  }

  const handleCheckPassthrough = id => {
    const isPassthroughChecked = !featureStore.newFeatureSet.spec.passthrough

    dispatch(setNewFeatureSetPassthrough(isPassthroughChecked))
    setData(state => ({
      ...state,
      passthrough: isPassthroughChecked ? id : ''
    }))
  }

  useEffect(() => {
    if (featureStore.newFeatureSet.spec.passthrough !== Boolean(data.passthrough)) {
      queueMicrotask(() => {
        setData(state => ({
          ...state,
          passthrough: featureStore.newFeatureSet.spec.passthrough ? 'passthrough' : ''
        }))
      })
    }
  }, [data.passthrough, featureStore.newFeatureSet.spec.passthrough])

  return (
    <FeatureSetsPanelTitleView
      closePanel={closePanel}
      data={data}
      featureStore={featureStore}
      formState={formState}
      frontendSpec={frontendSpec}
      handleCheckPassthrough={handleCheckPassthrough}
      handleNameOnBlur={handleNameOnBlur}
      setData={setData}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

FeatureSetsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  formState: PropTypes.object.isRequired,
  frontendSpec: PropTypes.object.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default FeatureSetsPanelTitle

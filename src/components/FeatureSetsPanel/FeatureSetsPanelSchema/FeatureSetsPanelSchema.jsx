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
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import FeatureSetsPanelSchemaView from './FeatureSetsPanelSchemaView'

import { setNewFeatureSetDataSourceEntities } from '../../../reducers/featureStoreReducer'

const FeatureSetsPanelSchema = ({ setValidation, validation }) => {
  const [data, setData] = useState({
    entities: '',
    timestamp_key: ''
  })
  const dispatch = useDispatch()
  const featureStore = useSelector(state => state.featureStore)

  const handleEntitiesOnBlur = () => {
    const entitiesArray = data.entities
      .trim()
      .split(',')
      .map(entity => ({
        name: entity.trim(),
        value_type: 'str'
      }))
      .filter(item => item.name)

    if (
      data.entities.length > 0 &&
      JSON.stringify(entitiesArray) !== JSON.stringify(featureStore.newFeatureSet.spec.entities)
    ) {
      dispatch(setNewFeatureSetDataSourceEntities(entitiesArray))
      setValidation(prevState => ({
        ...prevState,
        isEntitiesValid: true
      }))
    } else if (data.entities.length === 0 && featureStore.newFeatureSet.spec.entities.length > 0) {
      dispatch(setNewFeatureSetDataSourceEntities([]))
    }
  }

  const handleEntitiesOnChange = entities => {
    if (!validation.isEntitiesValid && entities.length > 0) {
      setValidation(prevState => ({
        ...prevState,
        isEntitiesValid: true
      }))
    }

    setData(state => ({
      ...state,
      entities
    }))
  }

  return (
    <FeatureSetsPanelSchemaView
      data={data}
      featureStore={featureStore}
      handleEntitiesOnBlur={handleEntitiesOnBlur}
      handleEntitiesOnChange={handleEntitiesOnChange}
      setData={setData}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

FeatureSetsPanelSchema.propTypes = {
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default FeatureSetsPanelSchema

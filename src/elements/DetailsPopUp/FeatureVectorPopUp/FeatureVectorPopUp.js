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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, maxBy } from 'lodash'
import PropTypes from 'prop-types'

import DetailsPopUp from '../DetailsPopUp'

import { showErrorNotification } from '../../../utils/notifications.util'
import { parseFeatureVectors } from '../../../utils/parseFeatureVectors'
import {
  generateActionsMenu,
  generateDetailsFormInitialValue,
  generatePageData
} from '../../../components/FeatureStore/FeatureVectors/featureVectors.util'

import featureStoreApi from '../../../api/featureStore-api'
import { toggleYaml } from '../../../reducers/appReducer'

const FeatureVectorPopUp = ({ featureVectorData, isOpen, onResolve }) => {
  const dispatch = useDispatch()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeatureVector, setSelectedFeatureVector] = useState({})

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const actionsMenu = useMemo(
    () => generateActionsMenu(() => {}, toggleConvertedYaml, true),
    [toggleConvertedYaml]
  )
  const pageData = useMemo(() => generatePageData(selectedFeatureVector), [selectedFeatureVector])
  const detailsFormInitialValues = useMemo(
    () => generateDetailsFormInitialValue(selectedFeatureVector, frontendSpec.internal_labels),
    [frontendSpec.internal_labels, selectedFeatureVector]
  )

  const fetchFeatureVector = useCallback(() => {
    setIsLoading(true)

    featureStoreApi
      .getFeatureVector(featureVectorData.project, featureVectorData.key, featureVectorData.tag)
      .then(response => {
        if (response.data?.feature_vectors.length > 0) {
          const parsedFeatureVectors = parseFeatureVectors(response.data?.feature_vectors)
          const selectedFeatureVector =
            parsedFeatureVectors.length === 1
              ? parsedFeatureVectors[0]
              : parsedFeatureVectors.find(
                  featureVector =>
                    featureVector.tag === 'latest' || maxBy(parsedFeatureVectors, 'updated')
                )

          setSelectedFeatureVector(selectedFeatureVector)

          setIsLoading(false)
        } else {
          showErrorNotification(dispatch, {}, '', 'Failed to retrieve feature vector data')

          onResolve()
        }
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Failed to retrieve feature vector data')

        onResolve()
      })
  }, [dispatch, onResolve, featureVectorData.key, featureVectorData.project, featureVectorData.tag])

  useEffect(() => {
    if (isEmpty(selectedFeatureVector)) {
      fetchFeatureVector()
    }
  }, [fetchFeatureVector, selectedFeatureVector])

  return (
    <DetailsPopUp
      actionsMenu={actionsMenu}
      formInitialValues={detailsFormInitialValues}
      handleRefresh={fetchFeatureVector}
      isLoading={isLoading}
      isOpen={isOpen}
      onResolve={onResolve}
      pageData={pageData}
      selectedItem={selectedFeatureVector}
    />
  )
}

FeatureVectorPopUp.propTypes = {
  featureVectorData: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onResolve: PropTypes.func.isRequired
}

export default FeatureVectorPopUp

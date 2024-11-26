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
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import DetailsPopUp from '../DetailsPopUp'

import {
  generatePageData,
  generateActionsMenu
} from '../../../components/FeatureStore/FeatureSets/featureSets.util.js'
import { showErrorNotification } from '../../../utils/notifications.util'

import featureStoreActions from '../../../actions/featureStore'
import { toggleYaml } from '../../../reducers/appReducer'

const FeatureSetPopUp = ({ featureSetData, isOpen, onResolve }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeatureSet, setSelectedFeatureSet] = useState({})

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const actionsMenu = useMemo(
    () => generateActionsMenu(dispatch, selectedFeatureSet, toggleConvertedYaml),
    [dispatch, selectedFeatureSet, toggleConvertedYaml]
  )

  const pageData = useMemo(() => generatePageData(selectedFeatureSet), [selectedFeatureSet])

  const fetchFeatureSetData = useCallback(() => {
    setIsLoading(true)

    dispatch(
      featureStoreActions.fetchFeatureSet(
        featureSetData.project,
        featureSetData.name,
        featureSetData.tag
      )
    )
      .then(featureSet => {
        if (!isEmpty(featureSet)) {
          setSelectedFeatureSet(featureSet)
          setIsLoading(false)
        } else {
          showErrorNotification(dispatch, {}, '', 'Failed to retrieve feature set data')

          onResolve()
        }
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Failed to retrieve feature set data')

        onResolve()
      })
  }, [dispatch, featureSetData.name, featureSetData.project, featureSetData.tag, onResolve])

  useEffect(() => {
    if (isEmpty(selectedFeatureSet)) {
      fetchFeatureSetData()
    }
  }, [fetchFeatureSetData, selectedFeatureSet])

  return (
    <DetailsPopUp
      actionsMenu={actionsMenu}
      handleRefresh={fetchFeatureSetData}
      isLoading={isLoading}
      isOpen={isOpen}
      onResolve={onResolve}
      pageData={pageData}
      selectedItem={selectedFeatureSet}
    />
  )
}

FeatureSetPopUp.propTypes = {
  featureSetData: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onResolve: PropTypes.func.isRequired
}

export default FeatureSetPopUp

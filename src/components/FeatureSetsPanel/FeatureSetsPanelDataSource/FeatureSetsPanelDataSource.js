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
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'

import FeatureSetsPanelDataSourceView from './FeatureSetsPanelDataSourceView'

import featureStoreActions from '../../../actions/featureStore'
import projectsAction from '../../../actions/projects'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'

import { CSV, PARQUET } from './featureSetsPanelDataSource.util'
import { isUrlInputValid } from '../UrlPath.utils'
import { isEmpty } from 'lodash'

const FeatureSetsPanelDataSource = ({
  featureStore,
  setDisableButtons,
  setNewFeatureSetDataSourceKind,
  setNewFeatureSetDataSourceParseDates,
  setNewFeatureSetDataSourceUrl,
  setNewFeatureSetSchedule,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    attributes: [],
    kind: CSV,
    parseDates: '',
    url: {
      pathType: '',
      path: '',
      fullPath: ''
    },
    schedule: ''
  })
  const [showSchedule, setShowSchedule] = useState(false)

  const handleKindOnChange = useCallback(
    kind => {
      const url =
        data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
          ? data.url.fullPath.replace(/.*:\/\//g, '')
          : data.url.path

      if (kind === CSV) {
        setNewFeatureSetSchedule('')
        setValidation(prevState => ({
          ...prevState,
          isUrlValid: url.length > 0 ? isUrlInputValid(data.url.pathType, url, kind) : true
        }))
      } else if (kind === PARQUET) {
        setNewFeatureSetDataSourceParseDates('')
        setValidation(state => ({
          ...state,
          isUrlValid: true
        }))
      }

      setNewFeatureSetDataSourceKind(kind)
      setData(state => ({
        ...state,
        kind,
        parseDates: '',
        schedule: ''
      }))
    },
    [
      data.url.fullPath,
      data.url.path,
      data.url.pathType,
      setNewFeatureSetDataSourceKind,
      setNewFeatureSetSchedule,
      setNewFeatureSetDataSourceParseDates,
      setValidation
    ]
  )

  const handleUrlSelectOnChange = () => {
    setValidation(state => ({
      ...state,
      isUrlValid: true
    }))

    setNewFeatureSetDataSourceUrl('')
  }

  const handleUrlOnApply = ({ selectValue, inputValue, urlData }) => {
    let isUrlValid = true

    if (!isUrlInputValid(selectValue, inputValue, data.kind)) {
      setValidation(prevState => ({
        ...prevState,
        isUrlValid: false
      }))
      isUrlValid = false
    } else {
      if (!validation.isUrlValid) {
        setValidation(prevState => ({
          ...prevState,
          isUrlValid: true
        }))
      }

      setNewFeatureSetDataSourceUrl(`${selectValue}${inputValue}`)

      setData(state => ({
        ...state,
        url: {
          ...state.url,
          ...urlData,
          fullPath: `${selectValue}${inputValue}`
        }
      }))
    }

    return isUrlValid
  }

  const handleUrlOnEditModeChange = useCallback((isEditModeActive) => {
    setDisableButtons(state => ({
      ...state,
      isUrlEditModeClosed: !isEditModeActive
    }))
  }, [setDisableButtons])

  const handleUrlInputOnChange = path => {
    setValidation(state => ({
      ...state,
      isUrlValid: !isEmpty(path)
    }))
  }

  return (
    <FeatureSetsPanelDataSourceView
      data={data}
      featureStore={featureStore}
      handleKindOnChange={handleKindOnChange}
      handleUrlInputOnChange={handleUrlInputOnChange}
      handleUrlOnApply={handleUrlOnApply}
      handleUrlOnEditModeChange={handleUrlOnEditModeChange}
      handleUrlSelectOnChange={handleUrlSelectOnChange}
      setData={setData}
      setNewFeatureSetDataSourceParseDates={setNewFeatureSetDataSourceParseDates}
      setNewFeatureSetSchedule={setNewFeatureSetSchedule}
      setShowSchedule={setShowSchedule}
      setValidation={setValidation}
      showSchedule={showSchedule}
      validation={validation}
    />
  )
}

FeatureSetsPanelDataSource.propTypes = {
  setDisableButtons: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect((featureStore, projectStore) => ({ ...featureStore, ...projectStore }), {
  ...featureStoreActions,
  ...projectsAction
})(FeatureSetsPanelDataSource)

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
import { useParams } from 'react-router-dom'
import { isEmpty, orderBy } from 'lodash'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ArtifactsPreviewController from '../ArtifactsPreview/ArtifactsPreviewController'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import {
  ARTIFACT_OTHER_TYPE,
  DATASET_TYPE,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  MODEL_TYPE,
  TAG_FILTER_LATEST
} from '../../constants'
import { fetchArtifacts } from '../../reducers/artifactsReducer'
import featureStoreApi from '../../api/featureStore-api'
import { generateArtifactIdentifiers } from '../Details/details.util'
import { FEATURE_VECTORS_KIND, generateInputsTabContent } from './detailsInputs.util'
import { generateStoreResourceLink } from '../../utils/generateStoreResourceLink'
import { parseUri } from '../../utils'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { parseFeatureVectors } from '../../utils/parseFeatureVectors'

import './detailsInputs.scss'

const DetailsInputs = ({ inputs, isDetailsPopUp = false }) => {
  const [artifactsIds, setArtifactsIds] = useState([])
  const [inputsContent, setInputsContent] = useState([])
  const [requestsCounter, setRequestsCounter] = useState(0)

  const showArtifact = useCallback(
    id => {
      if (id) generateArtifactIdentifiers(artifactsIds, id, setArtifactsIds)
    },
    [artifactsIds, setArtifactsIds]
  )

  const inputsTabContent = useMemo(() => {
    return generateInputsTabContent(
      inputsContent,
      showArtifact,
      isDetailsPopUp
    )
  }, [inputsContent, isDetailsPopUp, showArtifact])

  const dispatch = useDispatch()
  const params = useParams()

  const fetchFeatureVector = useCallback((project, name, tag, uid) => {
    return featureStoreApi
      .getFeatureVectorByReference(project, name, tag ?? uid ?? TAG_FILTER_LATEST)
      .then(response => {
        if (response?.data) {
          return parseFeatureVectors([response.data])[0]
        }

        return null
      })
  }, [])

  const fetchArtifactByKind = useCallback(
    (projectName, artifactName, kind, tag, tree, iter) => {
      const params = {
        iter,
        category:
          kind === 'artifacts'
            ? ARTIFACT_OTHER_TYPE
            : kind === 'datasets'
              ? DATASET_TYPE
              : MODEL_TYPE
      }

      if (tag) {
        params.tag = tag
      }

      if (tree) {
        params.tree = tree
      }

      if (!tag && !tree) {
        params.tag = TAG_FILTER_LATEST
      }

      return dispatch(
        fetchArtifacts({
          project: projectName,
          filters: { name: artifactName },
          config: {
            params
          },
          withExactName: true
        })
      )
        .unwrap()
        .then(artifacts => {
          if (artifacts?.length) {
            return searchArtifactItem(
              orderBy(artifacts, ['metadata.updated'], 'desc'),
              artifactName,
              tag ?? tree ?? TAG_FILTER_LATEST,
              iter
            )
          }

          return null
        })
    },
    [dispatch]
  )

  useEffect(() => {
    Object.entries(inputs || {}).forEach(([inputName, inputPath]) => {
      if (inputPath.startsWith(MLRUN_STORAGE_INPUT_PATH_SCHEME)) {
        const { iteration, key, project, tag, kind, uid } = parseUri(inputPath)
        const isFeatureVector = kind === FEATURE_VECTORS_KIND
        const fetchData = isFeatureVector
          ? () => fetchFeatureVector(project, key, tag, uid)
          : () => fetchArtifactByKind(project, key, kind, tag, uid, iteration)

        setRequestsCounter(counter => ++counter)

        fetchData()
          .then(input => {
            if (input) {
              setInputsContent(state => [
                ...state,
                {
                  ...input,
                  ui: {
                    inputName: key,
                    inputPath,
                    inputResourceLink: generateStoreResourceLink(
                      input,
                      project ?? params.projectName
                    ),
                    isShowDetailsActive: true,
                    isPreviewable: kind !== FEATURE_VECTORS_KIND
                  }
                }
              ])
            } else {
              setInputsContent(state => [
                ...state,
                {
                  ui: {
                    inputName: key,
                    inputPath,
                    isShowDetailsActive: false,
                    isPreviewable: false,
                    inputResourceLink: ''
                  }
                }
              ])
            }
          })
          .catch(() => {
            setInputsContent(state => [
              ...state,
              {
                ui: {
                  inputName: key,
                  inputPath,
                  isShowDetailsActive: false,
                  isPreviewable: false,
                  inputResourceLink: ''
                }
              }
            ])
          })
          .finally(() => {
            setRequestsCounter(counter => --counter)
          })
      } else {
        setInputsContent(state => [
          ...state,
          {
            ui: {
              inputName,
              inputPath,
              isShowDetailsActive: false,
              isPreviewable: false,
              inputResourceLink: ''
            }
          }
        ])
      }
    })

    return () => {
      setInputsContent([])
      setArtifactsIds([])
    }
  }, [inputs, dispatch, params.projectName, fetchFeatureVector, fetchArtifactByKind])

  return requestsCounter ? (
    <Loader />
  ) : isEmpty(inputs) || isEmpty(inputsContent) ? (
    <NoData />
  ) : (
    <div className="item-inputs">
      <div className="table">
        <div className="table-header">
          <div className="table-row table-header-row">
            {inputsTabContent[0].map(({ headerId, headerLabel, className }) => (
              <div key={headerId} className={classnames('table-header__cell', className)}>
                {headerLabel}
              </div>
            ))}
          </div>
        </div>
        <div className="table-body">
          {inputsTabContent.map((inputRow, inputRowIndex) => (
            <div key={inputRow[0]?.artifact?.uid ?? inputRowIndex}>
              <div className="table-row">
                {inputRow.map((inputCell, inputCellIndex) => (
                  <div
                    key={inputCellIndex}
                    className={classnames('table-body__cell', inputCell.className)}
                  >
                    {inputCell.template ? (
                      inputCell.template
                    ) : (
                      <Tooltip template={<TextTooltipTemplate text={inputCell.value} />}>
                        {inputCell.value}
                      </Tooltip>
                    )}
                  </div>
                ))}
              </div>
              {inputRow[0]?.artifact?.uid && (
                <ArtifactsPreviewController
                  artifactsIds={artifactsIds}
                  artifact={inputRow[0]?.artifact}
                  artifactId={inputRow[0]?.artifact?.uid}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

DetailsInputs.propTypes = {
  inputs: PropTypes.shape({}).isRequired
}

export default DetailsInputs

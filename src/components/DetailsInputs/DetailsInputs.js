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
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ArtifactsPreviewController from '../ArtifactsPreview/ArtifactsPreviewController'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { MLRUN_STORAGE_INPUT_PATH_SCHEME, TAG_FILTER_LATEST } from '../../constants'
import { fetchArtifacts } from '../../reducers/artifactsReducer'
import { generateArtifactIdentifiers } from '../Details/details.util'
import { generateArtifactLink, generateInputsTabContent } from './detailsInputs.util'

import './detailsInputs.scss'

const DetailsInputs = ({ inputs }) => {
  const [artifactsIds, setArtifactsIds] = useState([])
  const [inputsContent, setInputsContent] = useState([])

  const showArtifact = useCallback(
    id => {
      if (id) generateArtifactIdentifiers(artifactsIds, id, setArtifactsIds)
    },
    [artifactsIds, setArtifactsIds]
  )

  const inputsTabContent = useMemo(() => {
    return generateInputsTabContent(inputsContent, showArtifact)
  }, [inputsContent, showArtifact])

  const artifactsStore = useSelector(store => store.artifactsStore)
  const dispatch = useDispatch()
  const params = useParams()

  useEffect(() => {
    Object.entries(inputs || {}).forEach(([key, value]) => {
      if (value.startsWith(MLRUN_STORAGE_INPUT_PATH_SCHEME)) {
        const [, , , project, dbKeyWithHash] = value.split('/')
        const [dbKeyWithIter, hash] = dbKeyWithHash.split(':')
        const [dbKey, iter] = dbKeyWithIter.split('#')

        dispatch(
          fetchArtifacts({
            project,
            filters: { name: dbKey },
            config: {
              params: {
                iter,
                tag: hash ?? TAG_FILTER_LATEST
              }
            }
          })
        )
          .unwrap()
          .then(artifacts => {
            if (artifacts?.length) {
              setInputsContent(state => [
                ...state,
                {
                  ...artifacts[0],
                  ui: {
                    inputName: key,
                    inputPath: value,
                    artifactLink: generateArtifactLink(artifacts[0], params.projectName),
                    isPreviewable: artifacts.length > 0
                  }
                }
              ])
            } else {
              setInputsContent(state => [
                ...state,
                {
                  ui: {
                    inputName: key,
                    inputPath: value,
                    isPreviewable: false,
                    artifactLink: ''
                  }
                }
              ])
            }
          })
      } else {
        setInputsContent(state => [
          ...state,
          {
            ui: {
              inputName: key,
              inputPath: value,
              isPreviewable: false,
              artifactLink: ''
            }
          }
        ])
      }
    })

    return () => {
      setInputsContent([])
      setArtifactsIds([])
    }
  }, [inputs, dispatch, params.projectName])

  return artifactsStore.loading ? (
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

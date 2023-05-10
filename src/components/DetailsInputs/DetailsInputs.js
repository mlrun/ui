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
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import classnames from 'classnames'

import ArtifactsPreviewController from '../ArtifactsPreview/ArtifactsPreviewController'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'
import Loader from '../../common/Loader/Loader'

import { fetchArtifacts } from '../../reducers/artifactsReducer'
import { generateArtifactIndexes } from '../Details/details.util'
import {
  DATASETS,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  MODELS_TAB,
  TAG_FILTER_LATEST
} from '../../constants'

import { ReactComponent as DetailsIcon } from 'igz-controls/images/view-details.svg'

import './detailsInputs.scss'

const DetailsInputs = ({ inputs }) => {
  const [artifactsIndexes, setArtifactsIndexes] = useState([])
  const [content, setContent] = useState([])

  const artifactsStore = useSelector(store => store.artifactsStore)
  const dispatch = useDispatch()
  const params = useParams()

  const generateArtifactLink = useCallback(
    artifact => {
      const artifactLinks = {
        model: `/projects/${params.projectName}/models/${MODELS_TAB}/${
          artifact.db_key || artifact.key
        }/${TAG_FILTER_LATEST}${artifact.iter ? `/${artifact.iter}` : ''}/overview`,
        dataset: `/projects/${params.projectName}/${DATASETS}/${
          artifact.db_key || artifact.key
        }/${TAG_FILTER_LATEST}${artifact.iter ? `/${artifact.iter}` : ''}/overview`,
        files: `/projects/${params.projectName}/files/${
          artifact.db_key || artifact.key
        }/${TAG_FILTER_LATEST}${artifact.iter ? `/${artifact.iter}` : ''}/overview`
      }

      return artifactLinks[artifact.kind ?? 'files']
    },
    [params.projectName]
  )

  useEffect(() => {
    Object.entries(inputs || {}).forEach(([key, value]) => {
      if (value.startsWith(MLRUN_STORAGE_INPUT_PATH_SCHEME)) {
        const [, , , project, dbKeyWithHash] = value.split('/')
        const [dbKey, hash] = dbKeyWithHash.split(':')

        dispatch(
          fetchArtifacts({
            project,
            filters: { name: dbKey },
            config: {
              params: {
                tag: hash ?? TAG_FILTER_LATEST
              }
            }
          })
        )
          .unwrap()
          .then(artifacts => {
            setContent(state => [
              ...state,
              {
                ...artifacts[0],
                key,
                value,
                ui: {
                  artifactLink: generateArtifactLink(artifacts[0]),
                  isPreviewable: artifacts.length > 0
                }
              }
            ])
          })
      } else {
        setContent(state => [
          ...state,
          {
            key,
            value,
            ui: {
              isPreviewable: false
            }
          }
        ])
      }
    })

    return () => {
      setContent([])
      setArtifactsIndexes([])
    }
  }, [inputs, dispatch, generateArtifactLink])

  const showArtifact = useCallback(
    index => {
      generateArtifactIndexes(artifactsIndexes, index, setArtifactsIndexes)
    },
    [artifactsIndexes, setArtifactsIndexes]
  )

  return (
    <div className="item-inputs">
      {artifactsStore.loading ? (
        <Loader />
      ) : isEmpty(inputs) ? (
        <NoData />
      ) : (
        content.map((artifact, index) => {
          const keyClassNames = classnames(artifact.ui.isPreviewable && 'item-inputs__name link')

          return (
            <div className="item-inputs__row-wrapper" key={artifact.key}>
              <div className="item-inputs__row">
                <div className="item-inputs__row-item">
                  <Tooltip template={<TextTooltipTemplate text={artifact.key} />}>
                    <span
                      className={keyClassNames}
                      onClick={() => artifact.ui.isPreviewable && showArtifact(index)}
                    >
                      {artifact.key}
                    </span>
                  </Tooltip>
                </div>
                <div className="item-inputs__row-item item-inputs__row-item_path">
                  {artifact.value}
                </div>
                {artifact.ui.isPreviewable && (
                  <div className="item-inputs__row-item item-inputs__row-item_preview">
                    <RoundedIcon tooltipText="Show Details">
                      <Link target="_blank" to={artifact.ui.artifactLink}>
                        <DetailsIcon />
                      </Link>
                    </RoundedIcon>
                  </div>
                )}
              </div>
              <ArtifactsPreviewController
                artifactsIndexes={artifactsIndexes}
                content={content}
                index={index}
              />
            </div>
          )
        })
      )}
    </div>
  )
}

DetailsInputs.propTypes = {
  inputs: PropTypes.shape({}).isRequired
}

export default DetailsInputs

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
import React, { useEffect, useState, useCallback } from 'react'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import ArtifactsPreviewController from '../../components/ArtifactsPreview/ArtifactsPreviewController'

import { generateExtraDataContent } from '../../utils/getArtifactPreview'
import { generateArtifactIndexes } from '../../components/Details/details.util'

const ArtifactExtraData = ({ artifact }) => {
  const [extraData, setExtraData] = useState([])
  const [artifactsIndexes, setArtifactsIndexes] = useState([])
  const params = useParams()

  const showArtifactPreview = useCallback(
    index => {
      generateArtifactIndexes(artifactsIndexes, index, setArtifactsIndexes)
    },
    [artifactsIndexes, setArtifactsIndexes]
  )

  useEffect(() => {
    if (artifact.extra_data && extraData.length === 0) {
      generateExtraDataContent(artifact.extra_data, setExtraData, showArtifactPreview)
    }
  }, [artifact, extraData.length, params.projectName, showArtifactPreview])

  useEffect(() => {
    return () => {
      setExtraData([])
    }
  }, [])

  return (
    <div className="artifact-extra-data">
      <h1 className="artifact-extra-data__header">Related artifacts</h1>
      <div className="table">
        <div className="table-header">
          <div className="table-row table-header-row">
            {extraData[0]?.map(({ headerId, headerLabel, className }) => {
              return (
                <div
                  key={headerId}
                  className={classnames('table-header__cell', className && className)}
                >
                  {headerLabel}
                </div>
              )
            })}
          </div>
        </div>
        <div className="table-body">
          {extraData.map((extraDataRow, extraDataRowIndex) => {
            return (
              <div key={extraDataRowIndex}>
                <div className="table-row">
                  {extraDataRow.map((extraDataCell, extraDataIndex) => (
                    <div
                      key={`${extraDataIndex}`}
                      className={classnames(
                        'table-body__cell',
                        extraDataCell.className && extraDataCell.className
                      )}
                    >
                      {extraDataCell.template ? (
                        extraDataCell.template
                      ) : (
                        <Tooltip
                          template={
                            <TextTooltipTemplate
                              text={extraDataCell.tooltipValue ?? extraDataCell.value}
                            />
                          }
                        >
                          {extraDataCell.value}
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
                <ArtifactsPreviewController
                  artifactsIndexes={artifactsIndexes}
                  artifact={{
                    target_path: artifact.extra_data[extraDataRowIndex].path,
                    db_key: artifact.db_key
                  }}
                  index={extraDataRowIndex}
                  withoutPopout
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

ArtifactExtraData.propTypes = {
  artifact: PropTypes.object.isRequired
}

export default ArtifactExtraData

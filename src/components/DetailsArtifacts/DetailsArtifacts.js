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
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { connect, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ArtifactsPreviewController from '../ArtifactsPreview/ArtifactsPreviewController'
import NoData from '../../common/NoData/NoData'
import { TextTooltipTemplate, Tooltip } from 'igz-controls/components'

import jobsActions from '../../actions/jobs'
import { generateArtifactIndexes } from '../Details/details.util'
import {
  generateArtifactsPreviewContent,
  generateArtifactsTabContent,
  getJobAccordingIteration
} from './detailsArtifacts.util'

import './detailsArtifacts.scss'

const DetailsArtifacts = ({
  fetchJob,
  iteration,
  jobsStore,
  selectedItem,
  setIteration,
  setIterationOption
}) => {
  const [artifactsPreviewContent, setArtifactsPreviewContent] = useState([])
  const [artifactsIndexes, setArtifactsIndexes] = useState([])
  const iterationOptions = useSelector(store => store.detailsStore.iterationOptions)
  const params = useParams()

  const showArtifact = useCallback(
    index => {
      generateArtifactIndexes(artifactsIndexes, index, setArtifactsIndexes)
    },
    [artifactsIndexes, setArtifactsIndexes]
  )

  const artifactsTabContent = useMemo(() => {
    return generateArtifactsTabContent(artifactsPreviewContent, params, iteration, showArtifact)
  }, [artifactsPreviewContent, iteration, params, showArtifact])

  const bestIteration = useMemo(
    () => selectedItem.results?.best_iteration,
    [selectedItem.results?.best_iteration]
  )

  useEffect(() => {
    if (selectedItem.iterationStats?.length > 0) {
      const iterIndex = selectedItem.iterationStats[0].indexOf('iter')
      const iterationsList = []

      selectedItem.iterationStats.forEach((item, index) => {
        if (index !== 0) {
          iterationsList.push(item[iterIndex])
        }
      })

      setIterationOption(
        iterationsList
          .sort((a, b) => a - b)
          .map(iteration => ({
            label:
              iteration === bestIteration ? `${bestIteration} (Best iteration)` : `${iteration}`,
            id: `${iteration}`
          }))
      )
    }
  }, [bestIteration, selectedItem.iterationStats, setIterationOption])

  useEffect(() => {
    if (!isNaN(parseInt(bestIteration))) {
      setIteration(`${bestIteration}`)
    } else if (selectedItem.iterationStats.length > 0 && iterationOptions.length > 0) {
      setIteration(iterationOptions[0].id)
    }

    return () => {
      setIteration('')
    }
  }, [bestIteration, setIteration, selectedItem.iterationStats, iterationOptions])

  useEffect(() => {
    if (selectedItem.iterationStats.length > 0 && iteration) {
      fetchJob(params.projectName, params.jobId, iteration).then(job => {
        const selectedJob = getJobAccordingIteration(job)

        setArtifactsPreviewContent(generateArtifactsPreviewContent(selectedJob))
      })
    } else if (selectedItem.iterationStats.length === 0) {
      setArtifactsPreviewContent(generateArtifactsPreviewContent(selectedItem))
    }

    return () => {
      setArtifactsPreviewContent([])
      setArtifactsIndexes([])
    }
  }, [fetchJob, iteration, params.jobId, params.projectName, selectedItem])

  return jobsStore.loading ? null : artifactsPreviewContent.length === 0 ? (
    <NoData />
  ) : (
    <div className="item-artifacts">
      <div className="table">
        <div className="table-header">
          <div className="table-row table-header-row">
            {artifactsTabContent[0].map(({ headerId, headerLabel, className }) => (
              <div
                key={headerId}
                className={classnames('table-header__cell', className && className)}
              >
                {headerLabel}
              </div>
            ))}
          </div>
        </div>
        <div className="table-body">
          {artifactsTabContent.map((artifactRow, artifactRowIndex) => (
            <div key={artifactRowIndex}>
              <div className="table-row">
                {artifactRow.map((artifactCell, artifactCellIndex) => (
                  <div
                    key={`${artifactCellIndex}`}
                    className={classnames(
                      'table-body__cell',
                      artifactCell.className && artifactCell.className
                    )}
                  >
                    {artifactCell.template ? (
                      artifactCell.template
                    ) : (
                      <Tooltip
                        template={
                          <TextTooltipTemplate
                            text={artifactCell.tooltipValue ?? artifactCell.value}
                          />
                        }
                      >
                        {artifactCell.value}
                      </Tooltip>
                    )}
                  </div>
                ))}
              </div>
              <ArtifactsPreviewController
                artifactsIndexes={artifactsIndexes}
                artifact={artifactsPreviewContent[artifactRowIndex]}
                index={artifactRowIndex}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

DetailsArtifacts.propTypes = {
  iteration: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIterationOption: PropTypes.func.isRequired
}

export default connect(({ jobsStore }) => ({ jobsStore }), { ...jobsActions })(DetailsArtifacts)

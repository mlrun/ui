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
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ArtifactsPreviewController from '../ArtifactsPreview/ArtifactsPreviewController'
import NoData from '../../common/NoData/NoData'
import { TextTooltipTemplate, Tooltip, Tip, Loader } from 'igz-controls/components'

import {
  generateArtifactsPreviewContent,
  generateArtifactsTabContent,
  getJobAccordingIteration
} from './detailsArtifacts.util'
import { ALLOW_SORT_BY, DEFAULT_SORT_BY, EXCLUDE_SORT_BY } from 'igz-controls/types'
import { fetchArtifacts } from '../../reducers/artifactsReducer'
import { fetchJob } from '../../reducers/jobReducer'
import { generateArtifactIdentifiers } from '../Details/details.util'
import { setIteration, setIterationOption } from '../../reducers/detailsReducer'
import { useSortTable } from '../../hooks/useSortTable.hook'

import './detailsArtifacts.scss'

const DetailsArtifacts = ({
  allowSortBy = null,
  defaultDirection = 'desc',
  defaultSortBy = null,
  excludeSortBy = null,
  isDetailsPopUp = false,
  iteration,
  selectedItem
}) => {
  const [artifactsPreviewContent, setArtifactsPreviewContent] = useState([])
  const [artifactsIds, setArtifactsIds] = useState([])
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const iterationOptions = useSelector(store => store.detailsStore.iterationOptions)
  const params = useParams()
  const getArtifactsHeaderCellClasses = (headerId, isSortable, className) =>
    classnames(
      'table-header__cell',
      isSortable && 'sortable-header-cell',
      isSortable && selectedColumnName === headerId && 'sortable-header-cell_active',
      className && className
    )

  const dispatch = useDispatch()
  const artifactsStore = useSelector(store => store.artifactsStore)

  const showArtifact = useCallback(
    id => {
      if (id) generateArtifactIdentifiers(artifactsIds, id, setArtifactsIds)
    },
    [artifactsIds, setArtifactsIds]
  )

  const artifactsTabContent = useMemo(() => {
    return generateArtifactsTabContent(
      artifactsPreviewContent,
      params,
      iteration,
      showArtifact,
      isDetailsPopUp
    )
  }, [artifactsPreviewContent, iteration, params, showArtifact, isDetailsPopUp])

  const { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders } =
    useSortTable({
      headers: artifactsTabContent?.[0] ?? [],
      content: artifactsTabContent,
      sortConfig: {
        allowSortBy,
        excludeSortBy,
        defaultSortBy,
        defaultDirection
      }
    })

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

      dispatch(
        setIterationOption(
          iterationsList
            .sort((a, b) => a - b)
            .map(iteration => ({
              label:
                iteration === bestIteration ? `${bestIteration} (Best iteration)` : `${iteration}`,
              id: `${iteration}`
            }))
        )
      )
    }
  }, [bestIteration, dispatch, selectedItem.iterationStats])

  useEffect(() => {
    if (!isNaN(parseInt(bestIteration))) {
      dispatch(setIteration(`${bestIteration}`))
    } else if (selectedItem.iterationStats?.length > 0 && iterationOptions?.length > 0) {
      dispatch(setIteration(iterationOptions[0].id))
    }

    return () => {
      dispatch(setIteration(''))
    }
  }, [bestIteration, selectedItem.iterationStats, iterationOptions, dispatch])

  const getJobArtifacts = useCallback(
    (job, iteration) => {
      const workflowId = (job.labels ?? []).find(label => label.key === 'workflow')?.value ?? ''
      const config = {
        params: { tree: job.uid }
      }

      if (workflowId) {
        return dispatch(
          fetchJob({
            project: job.project || params.projectName,
            jobId: job.uid || params.jobId,
            iter: iteration
          })
        )
          .unwrap()
          .then(responseJob => {
            if (responseJob) {
              const selectedJob = getJobAccordingIteration(responseJob)

              setArtifactsPreviewContent(
                generateArtifactsPreviewContent(selectedJob, selectedJob.artifacts)
              )
            }
          })
      } else {
        if (iteration) {
          config.params.iter = iteration
        }

        dispatch(
          fetchArtifacts({
            project: job.project || params.projectName,
            filters: {},
            config,
            setRequestErrorMessage
          })
        )
          .unwrap()
          .then(result => {
            if (result) {
              setArtifactsPreviewContent(generateArtifactsPreviewContent(job, result))
            }
          })
      }
    },
    [dispatch, params.jobId, params.projectName]
  )

  useEffect(() => {
    if (params.jobId === selectedItem.uid || isDetailsPopUp) {
      if (selectedItem.iterationStats?.length > 0 && iteration) {
        getJobArtifacts(selectedItem, iteration)
      } else if (selectedItem.iterationStats?.length === 0) {
        getJobArtifacts(selectedItem, null)
      }
    }
  }, [getJobArtifacts, iteration, params.jobId, params.projectName, selectedItem, isDetailsPopUp])

  useEffect(() => {
    return () => {
      setArtifactsPreviewContent([])
      setArtifactsIds([])
    }
  }, [params.jobId, params.projectName, selectedItem, iteration])

  return artifactsStore.loading ? (
    <Loader section />
  ) : artifactsPreviewContent.length === 0 ? (
    <NoData message={requestErrorMessage} />
  ) : (
    <div className="item-artifacts">
      <div className="table">
        <div className="table-header">
          <div className="table-row table-header-row">
            {sortedTableHeaders.map(({ headerLabel, headerId, isSortable, ...tableItem }) => (
              <div
                className={getArtifactsHeaderCellClasses(headerId, isSortable, tableItem.className)}
                key={`${headerId}`}
                onClick={isSortable ? () => sortTable(headerId) : null}
              >
                <Tooltip template={<TextTooltipTemplate text={headerLabel} />}>
                  <label className={isSortable ? 'sortable-header-label' : ''}>
                    <span className="data-ellipsis">{headerLabel}</span>
                    {isSortable && getSortingIcon(headerId)}
                  </label>
                </Tooltip>
                {tableItem.tip && <Tip text={tableItem.tip} />}
              </div>
            ))}
          </div>
        </div>
        <div className="table-body">
          {sortedTableContent.map(artifactRow => (
            <div key={artifactRow[0]?.artifact?.ui?.identifierUnique}>
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
                artifactsIds={artifactsIds}
                artifact={artifactRow[0]?.artifact}
                artifactId={artifactRow[0]?.artifact?.ui?.identifierUnique}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

DetailsArtifacts.propTypes = {
  allowSortBy: ALLOW_SORT_BY,
  defaultDirection: PropTypes.string,
  defaultSortBy: DEFAULT_SORT_BY,
  excludeSortBy: EXCLUDE_SORT_BY,
  isDetailsPopUp: PropTypes.bool,
  iteration: PropTypes.string.isRequired,
  selectedItem: PropTypes.object.isRequired
}

export default DetailsArtifacts

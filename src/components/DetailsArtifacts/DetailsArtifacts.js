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
import { TextTooltipTemplate, Tooltip, Tip } from 'igz-controls/components'

import jobsActions from '../../actions/jobs'
import { generateArtifactIdentifiers } from '../Details/details.util'
import {
  generateArtifactsPreviewContent,
  generateArtifactsTabContent,
  getJobAccordingIteration
} from './detailsArtifacts.util'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { ALLOW_SORT_BY, DEFAULT_SORT_BY, EXCLUDE_SORT_BY } from 'igz-controls/types'

import './detailsArtifacts.scss'

const DetailsArtifacts = ({
  allowSortBy,
  defaultSortBy,
  defaultDirection,
  excludeSortBy,
  fetchJob,
  iteration,
  jobsStore,
  selectedItem,
  setIteration,
  setIterationOption
}) => {
  const [artifactsPreviewContent, setArtifactsPreviewContent] = useState([])
  const [artifactsIds, setArtifactsIds] = useState([])
  const iterationOptions = useSelector(store => store.detailsStore.iterationOptions)
  const params = useParams()
  const getAtrifactsHeaderCellClasses = (headerId, isSortable, className) =>
    classnames(
      'table-header__cell',
      isSortable && 'sortable-header-cell',
      isSortable && selectedColumnName === headerId && 'sortable-header-cell_active',
      className && className
    )

  const showArtifact = useCallback(
    id => {
      if (id) generateArtifactIdentifiers(artifactsIds, id, setArtifactsIds)
    },
    [artifactsIds, setArtifactsIds]
  )

  const artifactsTabContent = useMemo(() => {
    return generateArtifactsTabContent(artifactsPreviewContent, params, iteration, showArtifact)
  }, [artifactsPreviewContent, iteration, params, showArtifact])

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
      setArtifactsIds([])
    }
  }, [fetchJob, iteration, params.jobId, params.projectName, selectedItem])

  return jobsStore.loading ? null : artifactsPreviewContent.length === 0 ? (
    <NoData />
  ) : (
    <div className="item-artifacts">
      <div className="table">
        <div className="table-header">
          <div className="table-row table-header-row">
            {sortedTableHeaders.map(({ headerLabel, headerId, isSortable, ...tableItem }) => (
              <div
                className={getAtrifactsHeaderCellClasses(headerId, isSortable, tableItem.className)}
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
          {sortedTableContent.map((artifactRow) => (
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

DetailsArtifacts.defaultProps = {
  allowSortBy: null,
  defaultSortBy: null,
  defaultDirection: 'desc',
  excludeSortBy: null
}

DetailsArtifacts.propTypes = {
  allowSortBy: ALLOW_SORT_BY,
  defaultSortBy: DEFAULT_SORT_BY,
  defaultDirection: PropTypes.string,
  excludeSortBy: EXCLUDE_SORT_BY,
  iteration: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIterationOption: PropTypes.func.isRequired
}

export default connect(({ jobsStore }) => ({ jobsStore }), { ...jobsActions })(DetailsArtifacts)

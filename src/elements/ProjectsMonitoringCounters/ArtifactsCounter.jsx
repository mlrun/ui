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
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import StatsCard from '../../common/StatsCard/StatsCard'
import Loader from '../../common/Loader/Loader'
import { PopUpDialog } from 'igz-controls/components'
import ClockIcon from 'igz-controls/images/clock.svg?react'

import './projectsMonitoringCounters.scss'
import classNames from 'classnames'

const DataAndArtifactsCounters = () => {
  const { projectName } = useParams()
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)
  const [showPopup, setShowPopup] = useState(false)
  const anchorRef = useRef(null)

  const handleOpenPopUp = () => {
    const width = anchorRef.current?.offsetWidth ?? 0
    setShowPopup(width < 110)
  }

  const dataStats = useMemo(() => {
    if (projectName) {
      const llm_prompts = projectStore.projectSummary.data?.llm_prompts || 0
      const files = projectStore.projectSummary.data?.files_count || 0
      const documents = projectStore.projectSummary.data?.documents_count || 0
      const datasets = projectStore.projectSummary.data?.datasets_count || 0

      return {
        llm_prompts,
        files,
        documents,
        datasets,
        total: llm_prompts + files + datasets + documents
      }
    }
    return (
      projectStore.jobsMonitoringData.artifacts || {
        llm_prompts: 0,
        files: 0,
        documents: 0,
        datasets: 0,
        total: 0
      }
    )
  }, [projectName, projectStore.jobsMonitoringData.artifacts, projectStore.projectSummary.data])

  const generateLink = useCallback(
    tab => projectName && `/projects/${projectName}/${tab}`,
    [projectName]
  )

  return (
    <StatsCard className="monitoring-stats">
      <div onMouseEnter={handleOpenPopUp} onMouseLeave={() => setShowPopup(false)} ref={anchorRef}>
        <StatsCard.Header title="Artifacts">
          <div className="project-card__info">
            <ClockIcon className="project-card__info-icon" />
            {projectName ? <span>24 hrs</span> : <span>Past 24 hrs</span>}
          </div>
        </StatsCard.Header>

        <StatsCard.Row>
          <div
            className={'stats__counter_header'}
            onClick={() => navigate(generateLink('artifacts'))}
            data-testid="data_total_counter"
          >
            <div className="stats__counter">
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                dataStats.total.toLocaleString()
              )}
            </div>
          </div>
        </StatsCard.Row>

        <div className="stats__details">
          <StatsCard.Row>
            <div
              className={classNames('stats__line', {
                stats__link: projectName
              })}
              onClick={() => navigate(generateLink('files'))}
            >
              <h6 className="stats__subtitle">Files</h6>
              <div className="stats__counter">{dataStats.files.toLocaleString()}</div>
            </div>
          </StatsCard.Row>
          <StatsCard.Row>
            <div
              className={classNames('stats__line', {
                stats__link: projectName
              })}
              onClick={() => navigate(generateLink('datasets'))}
            >
              <h6 className="stats__subtitle">Datasets</h6>
              <div className="stats__counter">{dataStats.datasets.toLocaleString()}</div>
            </div>
          </StatsCard.Row>
          <StatsCard.Row>
            <div
              className={classNames('stats__line', {
                stats__link: projectName
              })}
              onClick={() => navigate(generateLink('documents'))}
            >
              <h6 className="stats__subtitle">Documents</h6>
              <div className="stats__counter">{dataStats.documents.toLocaleString()}</div>
            </div>
          </StatsCard.Row>
          <StatsCard.Row>
            <div
              className={classNames({
                stats__link: projectName
              })}
              onClick={() => navigate(generateLink('llm-prompts'))}
            >
              <h6 className="stats__subtitle">LLM Prompts</h6>
              <div className="stats__counter">{dataStats.llm_prompts.toLocaleString()}</div>
            </div>
          </StatsCard.Row>
        </div>

        {showPopup && (
          <PopUpDialog
            className="card-popup"
            headerIsHidden
            customPosition={{
              element: anchorRef,
              position: 'bottom-right'
            }}
          >
            <div className="card-popup_text">
              {[
                { label: 'Files', value: dataStats.files, tab: 'files' },
                { label: 'Datasets', value: dataStats.datasets, tab: 'datasets' },
                { label: 'Documents', value: dataStats.documents, tab: 'documents' },
                { label: 'LLM Prompts', value: dataStats.llm_prompts, tab: 'llm-prompts' }
              ].map(item => (
                <div
                  key={item.tab}
                  className={classNames({
                    'card-popup_text_link': projectName
                  })}
                  onClick={() => navigate(generateLink(item.tab))}
                >
                  {item.label}: {item.value}
                </div>
              ))}
            </div>
          </PopUpDialog>
        )}
      </div>
    </StatsCard>
  )
}

export default React.memo(DataAndArtifactsCounters)

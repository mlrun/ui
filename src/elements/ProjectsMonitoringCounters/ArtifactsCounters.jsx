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

import React, { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { Loader, PopUpDialog } from 'igz-controls/components'
import ClockIcon from 'igz-controls/images/clock.svg?react'

import { ARTIFACTS_PAGE } from '../../constants'
import StatsCard from '../../common/StatsCard/StatsCard'
import { generateMonitoringStats } from '../../utils/generateMonitoringData'

import './projectsMonitoringCounters.scss'

const ArtifactsCounters = () => {
  const anchorRef = useRef(null)
  const detailsRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const { projectName } = useParams()
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)
  const timeLabel = projectName ? '24 hrs' : 'Past 24 hrs'

  const handleOpenPopUp = () => {
    const isHidden = !detailsRef.current?.offsetParent
    setShowPopup(isHidden)
  }

  const handleClosePopUp = () => {
    setShowPopup(false)
  }

  const dataStats = useMemo(() => {
    if (projectName) {
      const llm_prompts = projectStore?.projectSummary?.data?.llm_prompts || 0
      const files = projectStore?.projectSummary?.data?.files_count || 0
      const documents = projectStore?.projectSummary?.data?.documents_count || 0
      const datasets = projectStore?.projectSummary?.data?.datasets_count || 0

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

  const data = useMemo(
    () => generateMonitoringStats(dataStats, navigate, ARTIFACTS_PAGE, projectName),
    [dataStats, navigate, projectName]
  )

  return (
    <div onMouseEnter={handleOpenPopUp} onMouseLeave={handleClosePopUp}>
      <StatsCard className="monitoring-stats">
        <div ref={anchorRef}>
          <StatsCard.Header title="Artifacts">
            <div className="project-card__info">
              <ClockIcon className="project-card__info-icon" />
              <span>{timeLabel}</span>
            </div>
          </StatsCard.Header>
          <StatsCard.Row>
            <div className="stats__counter_header" data-testid="artifacts_total_counter">
              <div className="stats__counter">
                {projectStore.projectsSummary.loading ? (
                  <Loader section small secondary />
                ) : (
                  data?.total?.counter?.toLocaleString()
                )}
              </div>
            </div>
          </StatsCard.Row>
          <div ref={detailsRef} className="stats__details">
            <StatsCard.Row>
              <div className={data?.files?.className} onClick={data?.files?.link}>
                <h6 className="stats__subtitle">Files</h6>
                <div className="stats__counter">{data?.files?.counter?.toLocaleString()}</div>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div className={data?.datasets?.className} onClick={data?.datasets?.link}>
                <h6 className="stats__subtitle">Datasets</h6>
                <div className="stats__counter">{data?.datasets.counter?.toLocaleString()}</div>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div className={data?.documents?.className} onClick={data?.documents?.link}>
                <h6 className="stats__subtitle">Documents</h6>
                <div className="stats__counter">{data?.documents?.counter?.toLocaleString()}</div>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div className={data.llm_prompt.className} onClick={data.llm_prompt.link}>
                <h6 className="stats__subtitle">LLM Prompts</h6>
                <div className="stats__counter">{data?.llm_prompt?.counter?.toLocaleString()}</div>
              </div>
            </StatsCard.Row>
          </div>

          {showPopup && (
            <PopUpDialog
              className="card-popup"
              customPosition={{
                element: anchorRef,
                position: 'bottom-right'
              }}
              headerIsHidden
            >
              <div className="card-popup_text">
                {data.list.map(item => (
                  <div
                    key={item.key}
                    className={classNames({ 'card-popup_text_link': projectName })}
                    onClick={data[item.key].link}
                  >
                    {item.label}: {data[item.key].counter.toLocaleString()}
                  </div>
                ))}
              </div>
            </PopUpDialog>
          )}
        </div>
      </StatsCard>
    </div>
  )
}

export default React.memo(ArtifactsCounters)

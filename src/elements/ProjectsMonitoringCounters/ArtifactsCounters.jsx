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

  const handleOpenPopUp = () => {
    const isHidden = !detailsRef.current?.offsetParent
    setShowPopup(isHidden)
  }

  const handleClosePopUp = () => {
    setShowPopup(false)
  }

  const dataStats = useMemo(() => {
    if (projectName) {
      const llm_prompts = projectStore?.projectSummary?.data?.llm_prompts_count || 0
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
    <StatsCard className="monitoring-stats">
      <div ref={anchorRef}>
        <StatsCard.Header title="Artifacts"></StatsCard.Header>
        <div onMouseEnter={handleOpenPopUp} onMouseLeave={handleClosePopUp}>
          <StatsCard.Row>
            <StatsCard.MainCounter id="artifacts_total_counter">
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                data?.total?.counter?.toLocaleString()
              )}
            </StatsCard.MainCounter>
          </StatsCard.Row>
          <div ref={detailsRef} className="stats__details">
            <StatsCard.Row>
              <div
                className={data?.datasets?.className}
                data-testid="artifacts_datasets_counter"
                onClick={data?.datasets?.link}
              >
                <h6 className="stats__subtitle">Datasets</h6>
                <StatsCard.SecondaryCounter>
                  {projectStore.projectsSummary.loading ? (
                    <Loader section small secondary />
                  ) : (
                    data?.datasets.counter?.toLocaleString()
                  )}
                </StatsCard.SecondaryCounter>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div
                data-testid="artifacts_documents_counter"
                className={data?.documents?.className}
                onClick={data?.documents?.link}
              >
                <h6 className="stats__subtitle">Documents</h6>
                <StatsCard.SecondaryCounter>
                  {projectStore.projectsSummary.loading ? (
                    <Loader section small secondary />
                  ) : (
                    data?.documents?.counter?.toLocaleString()
                  )}
                </StatsCard.SecondaryCounter>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div
                data-testid="artifacts_llm_counter"
                className={data.llm_prompt.className}
                onClick={data.llm_prompt.link}
              >
                <h6 className="stats__subtitle">LLM prompt artifacts</h6>
                <StatsCard.SecondaryCounter>
                  {projectStore.projectsSummary.loading ? (
                    <Loader section small secondary />
                  ) : (
                    data?.llm_prompt?.counter?.toLocaleString()
                  )}
                </StatsCard.SecondaryCounter>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div
                data-testid="artifacts_other_counter"
                className={data?.files?.className}
                onClick={data?.files?.link}
              >
                <h6 className="stats__subtitle">Other artifacts</h6>
                <StatsCard.SecondaryCounter>
                  {projectStore.projectsSummary.loading ? (
                    <Loader section small secondary />
                  ) : (
                    data?.files?.counter?.toLocaleString()
                  )}
                </StatsCard.SecondaryCounter>

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
      </div>
    </StatsCard>
  )
}

export default React.memo(ArtifactsCounters)

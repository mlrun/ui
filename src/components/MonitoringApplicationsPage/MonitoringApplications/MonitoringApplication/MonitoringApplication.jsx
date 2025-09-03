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
import React, { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import NoData from '../../../../common/NoData/NoData'
import SectionTable from '../../../../elements/SectionTable/SectionTable'
import { Tip } from 'igz-controls/components'

import {
  generateArtifactsTableContent,
  generateMetricsTableContent,
  generateResultsTableContent,
  generateShardsStatusTableContent
} from './MonitoringApplication.util'
import { FILES_PAGE, LABELS_FILTER } from '../../../../constants'
import { MONITORING_APPLICATIONS_NO_DATA_MESSAGE } from '../../MonitoringApplicationsPage.util'
import { removeArtifacts } from '../../../../reducers/artifactsReducer'
import { removeMonitoringApplication } from '../../../../reducers/monitoringApplicationsReducer'

import './monitoringApplication.scss'

const MonitoringApplication = () => {
  const dispatch = useDispatch()
  const { artifacts } = useSelector(store => store.artifactsStore)
  const { monitoringApplication, loading } = useSelector(store => store.monitoringApplicationsStore)
  const params = useParams()

  const artifactsTable = useMemo(() => {
    return generateArtifactsTableContent(artifacts)
  }, [artifacts])
  const resultsTable = useMemo(() => {
    return generateResultsTableContent(monitoringApplication?.stats?.metrics)
  }, [monitoringApplication?.stats?.metrics])
  const metricsTable = useMemo(() => {
    return generateMetricsTableContent(monitoringApplication?.stats?.metrics)
  }, [monitoringApplication?.stats?.metrics])
  const shardsTable = useMemo(() => {
    return generateShardsStatusTableContent(monitoringApplication?.stats?.stream_stats)
  }, [monitoringApplication])

  useEffect(() => {
    return () => {
      dispatch(removeArtifacts())
      dispatch(removeMonitoringApplication())
    }
  }, [dispatch, params.projectName])

  return (
    <div className="monitoring-apps">
      <div className="monitoring-app__section">
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>Artifacts</span>
          </div>
          {artifacts.length === 0 && !loading ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <>
              <SectionTable loading={loading} params={params} table={artifactsTable} />
              <Link
                className="link monitoring-app__see-all-link"
                to={`/projects/${params.projectName}/${FILES_PAGE}?${LABELS_FILTER}=mlrun/app-name=${params.name}`}
              >
                See all
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="monitoring-app__section section_small">
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>Results</span>
            <Tip text="This table displays the values of the last results captured by the monitoring application. If there are results for more than one model endpoint at the same time, the table displays only one of those." />
          </div>
          {resultsTable.body.length === 0 && !loading ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <SectionTable loading={loading} params={params} table={resultsTable} />
          )}
        </div>
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>Metrics</span>
            <Tip text="This table displays the values of the last metrics captured by the monitoring application. If there are metrics for more than one model endpoint at the same time, the table displays only one of those." />
          </div>
          {metricsTable.body.length === 0 && !loading ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <SectionTable loading={loading} params={params} table={metricsTable} />
          )}
        </div>
      </div>
      <div className="monitoring-app__section section_small">
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>Shards/partitions status</span>
            <Tip text="This table displays the current status of each shard" />
          </div>
          {shardsTable.body.length === 0 && !loading ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <SectionTable loading={loading} params={params} table={shardsTable} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MonitoringApplication

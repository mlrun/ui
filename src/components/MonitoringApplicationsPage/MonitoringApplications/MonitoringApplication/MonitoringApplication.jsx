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
import { FILES_PAGE, NAME_FILTER } from '../../../../constants'
import { MONITORING_APPLICATIONS_NO_DATA_MESSAGE } from '../../MonitoringApplicationsPage.util'
import { removeArtifacts } from '../../../../reducers/artifactsReducer'
import { removeMonitoringApplication } from '../../../../reducers/monitoringApplicationsReducer'

import './monitoringApplication.scss'

const MonitoringApplication = () => {
  const dispatch = useDispatch()
  // const { artifacts } = useSelector(store => store.artifactsStore)
  const artifactsMock = useMemo(
    () => [
      {
        kind: '',
        project: 'default',
        uid: '5a44b12b-9ef3-4239-87e8-e0cbdae-2',
        key: 'content',
        iter: 0,
        tree: '1f8b29a5-cdab-4b84-aad7-7f9bc20daf0b',
        updated: '2021-08-29T20:01:03.457008+00:00',
        tag: 'latest',
        labels: {
          'my-key': 'my-value',
          'mlrun/app-name': 'monitorAppV1',
          owner: 'admin',
          v3io_user: 'admin'
        },
        created: '2021-08-29T20:01:03.457008+00:00',
        target_path: 'v3io://artifacts/image_mock_data.png',
        size: 20480,
        db_key: 'download_content',
        producer: {
          name: 'download',
          kind: 'run',
          uri: 'default/59f8e3d6f3db4dd8ab890c4bf84a0a23',
          owner: 'admin',
          workflow: '1f8b29a5-cdab-4b84-aad7-7f9bc20daf0b'
        },
        sources: [
          {
            name: 'archive_url',
            path: 'https://s3.wasabisys.com/iguazio/data/image-classification/catsndogs.zip'
          }
        ],
        status: {}
      },
      {
        kind: '',
        project: 'default',
        uid: '5a44b12b-9ef3-4239-87e8-e0cbdae-2',
        key: 'content',
        iter: 0,
        tree: '1f8b29a5-cdab-4b84-aad7-7f9bc20daf0b',
        updated: '2021-08-29T20:01:03.457008+00:00',
        tag: 'latest',
        labels: {
          'my-key': 'my-value',
          'mlrun/app-name': 'monitorAppV1',
          owner: 'admin',
          v3io_user: 'admin'
        },
        created: '2021-08-29T20:01:03.457008+00:00',
        target_path: 'v3io://artifacts/image_mock_data.png',
        size: 20480,
        db_key: 'download_content',
        producer: {
          name: 'download',
          kind: 'run',
          uri: 'default/59f8e3d6f3db4dd8ab890c4bf84a0a23',
          owner: 'admin',
          workflow: '1f8b29a5-cdab-4b84-aad7-7f9bc20daf0b'
        },
        sources: [
          {
            name: 'archive_url',
            path: 'https://s3.wasabisys.com/iguazio/data/image-classification/catsndogs.zip'
          }
        ],
        status: {}
      },
      {
        kind: 'dataset',
        hash: '1bc83ed07eecbc358d0de91598dfc1d4',
        description: '',
        framework: '',
        project: 'default',
        uid: '5a44b12b-9ef3-4239-87e8-e0cbdae-24',
        key: 'cleaned_data',
        iter: 0,
        tree: '27ec4218-34c8-4315-a053-236e326ed645',
        labels: {
          'my-key': 'my-value',
          v3io_user: 'admin',
          owner: 'admin',
          type: 'dataset',
          'mlrun/app-name': 'monitorAppV1'
        },
        updated: '2022-07-18T14:20:04.121Z',
        tag: 'latest',
        created: '2022-07-18T14:20:04.121Z',
        target_path: 'path',
        size: null,
        db_key: 'cleaned_data',
        producer: {
          kind: 'api',
          uri: 'localhost:3000'
        },
        sources: [],
        status: {}
      }
    ],
    []
  )
  const { monitoringApplication } = useSelector(store => store.monitoringApplicationsStore)
  const params = useParams()

  const artifactsTable = useMemo(() => {
    return generateArtifactsTableContent(artifactsMock)
  }, [artifactsMock])
  const resultsTable = useMemo(() => {
    return generateResultsTableContent(monitoringApplication?.stats?.metrics)
  }, [monitoringApplication?.stats?.metrics])
  const metricsTable = useMemo(() => {
    return generateMetricsTableContent(monitoringApplication?.stats?.metrics)
  }, [monitoringApplication?.stats?.metrics])
  const shardsTable = useMemo(() => {
    return generateShardsStatusTableContent(monitoringApplication?.stats?.shards)
  }, [monitoringApplication])

  useEffect(() => {
    return () => {
      dispatch(removeArtifacts())
      dispatch(removeMonitoringApplication())
    }
  }, [dispatch])

  return (
    <div className="monitoring-apps">
      <div className="monitoring-app__section">
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>Artifacts</span>
          </div>
          {artifactsMock.length === 0 ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <>
              <SectionTable params={params} table={artifactsTable} />
              <Link
                className="link monitoring-app__see-all-link"
                to={`/projects/${params.projectName}/${FILES_PAGE}?${NAME_FILTER}=${params.name}`}
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
          {resultsTable.body.length === 0 ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <SectionTable params={params} table={resultsTable} />
          )}
        </div>
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>Metrics</span>
            <Tip text="This table displays the values of the last metrics captured by the monitoring application. If there are metrics for more than one model endpoint at the same time, the table displays only one of those." />
          </div>
          {metricsTable.body.length === 0 ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <SectionTable params={params} table={metricsTable} />
          )}
        </div>
      </div>
      <div className="monitoring-app__section section_small">
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>Shards/partitions status</span>
            <Tip text="This table displays the current status of each shard" />
          </div>
          {shardsTable.body.length === 0 ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <SectionTable params={params} table={shardsTable} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MonitoringApplication

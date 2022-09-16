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
import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import FilterMenu from '../../FilterMenu/FilterMenu'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import JobsPanel from '../../JobsPanel/JobsPanel'
import YamlModal from '../../../common/YamlModal/YamlModal'
import JobsTableRow from '../../../elements/JobsTableRow/JobsTableRow'

import { JOBS_PAGE, PANEL_EDIT_MODE, SCHEDULE_TAB } from '../../../constants'
import { getNoDataMessage } from '../../../layout/Content/content.util'
import { ACTIONS_MENU } from '../../../types'

const ScheduledJobsView = ({
  actionsMenu,
  convertedYaml,
  editableItem,
  filters,
  filtersStore,
  handleSuccessRerunJob,
  jobs,
  jobsStore,
  onEditJob,
  pageData,
  refreshJobs,
  removeNewJob,
  setEditableItem,
  tableContent,
  toggleConvertedYaml
}) => {
  const params = useParams()

  return (
    <>
      <div className="content__action-bar">
        <FilterMenu filters={filters} onChange={refreshJobs} page={JOBS_PAGE} withoutExpandButton />
      </div>
      {jobsStore.loading ? null : jobs.length === 0 ? (
        <NoData message={getNoDataMessage(filtersStore, filters, SCHEDULE_TAB, JOBS_PAGE)} />
      ) : (
        <>
          <Table
            actionsMenu={actionsMenu}
            content={jobs}
            pageData={pageData}
            retryRequest={refreshJobs}
            tab={SCHEDULE_TAB}
            tableHeaders={tableContent[0]?.content ?? []}
          >
            <div className="table-body">
              {tableContent.map((tableItem, index) => (
                <JobsTableRow actionsMenu={actionsMenu} key={index} rowItem={tableItem} />
              ))}
            </div>
          </Table>
        </>
      )}
      {editableItem && (
        <JobsPanel
          closePanel={() => {
            setEditableItem(null)
            removeNewJob()
          }}
          defaultData={editableItem?.scheduled_object}
          mode={PANEL_EDIT_MODE}
          onEditJob={onEditJob}
          onSuccessRun={tab => {
            if (editableItem) {
              handleSuccessRerunJob(tab)
            }
          }}
          project={params.projectName}
          withSaveChanges
        />
      )}
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
    </>
  )
}

ScheduledJobsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  editableItem: PropTypes.object,
  filters: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, type: PropTypes.string.isRequired })
  ).isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleSuccessRerunJob: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobsStore: PropTypes.object.isRequired,
  onEditJob: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  removeNewJob: PropTypes.func.isRequired,
  tableContent: PropTypes.array.isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default ScheduledJobsView

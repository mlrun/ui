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
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import ProjectStatisticsCounter from '../ProjectStatisticsCounter/ProjectStatisticsCounter'

import { setFilters, setFiltersValues, setModalFiltersValues } from '../../reducers/filtersReducer'
import {
  ANY_TIME_DATE_OPTION,
  datePickerPastOptions,
  PAST_24_HOUR_DATE_OPTION
} from '../../utils/datePicker.util'
import {
  DATES_FILTER,
  FAILED_STATE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  SCHEDULE_TAB,
  STATUS_FILTER
} from '../../constants'

import './projectStatistics.scss'

const ProjectStatistics = ({ statistics }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onNavigate = (statistic, key) => {
    let filters = {}
    let pageFilters = {}
    let modalFilters = {}

    if (['running', 'workflows'].includes(key)) {
      const anyTimeOption = datePickerPastOptions.find(option => option.id === ANY_TIME_DATE_OPTION)
      filters = {
        saveFilters: true
      }
      pageFilters = {
        name: key === 'workflows' ? MONITOR_WORKFLOWS_TAB : MONITOR_JOBS_TAB,
        value: {
          [DATES_FILTER]: {
            value: anyTimeOption.handler(),
            isPredefined: false,
            initialSelectedOptionId: anyTimeOption.id
          }
        }
      }
      modalFilters = {
        name: key === 'workflows' ? MONITOR_WORKFLOWS_TAB : MONITOR_JOBS_TAB,
        value: {
          [STATUS_FILTER]: key === 'workflows' ? ['running'] : ['running', 'pending', 'aborting']
        }
      }
    } else if (key === FAILED_STATE) {
      const past24HourOption = datePickerPastOptions.find(
        option => option.id === PAST_24_HOUR_DATE_OPTION
      )
      filters = {
        saveFilters: true
      }
      pageFilters = {
        name: MONITOR_JOBS_TAB,
        value: {
          [DATES_FILTER]: {
            value: past24HourOption.handler(),
            isPredefined: past24HourOption.isPredefined,
            initialSelectedOptionId: past24HourOption.id
          }
        }
      }
      modalFilters = {
        name: MONITOR_JOBS_TAB,
        value: { [STATUS_FILTER]: ['error', 'aborted'] }
      }
    } else if (key === 'scheduled') {
      const anyTimeOption = datePickerPastOptions.find(option => option.id === ANY_TIME_DATE_OPTION)
      filters = {
        saveFilters: true
      }
      pageFilters = {
        name: SCHEDULE_TAB,
        value: {
          [DATES_FILTER]: {
            value: anyTimeOption.handler(),
            isPredefined: false,
            initialSelectedOptionId: anyTimeOption.id
          }
        }
      }
    }

    dispatch(setFilters(filters))
    dispatch(setModalFiltersValues(modalFilters))
    dispatch(setFiltersValues(pageFilters))
    navigate(statistic.link)
  }

  return Object.keys(statistics).map((key, index) => {
    return (
      <div key={key + index} className="project-data-card__statistics-item">
        {statistics[key].href ? (
          <a
            href={statistics[key].href}
            target="_top"
            className="project-data-card__statistics-link"
          >
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </a>
        ) : statistics[key].link ? (
          <div
            className="project-data-card__statistics-link"
            onClick={() => onNavigate(statistics[key], key)}
          >
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </div>
        ) : (
          <div className="project-data-card__statistics-data">
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </div>
        )}
      </div>
    )
  })
}

ProjectStatistics.propTypes = {
  statistics: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectStatistics)

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
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep, isEqual } from 'lodash'

import CheckBox from '../../common/CheckBox/CheckBox'
import DatePicker from '../../common/DatePicker/DatePicker'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import TagFilter from '../../common/TagFilter/TagFilter'
import { Button, RoundedIcon } from 'igz-controls/components'

import RefreshIcon from 'igz-controls/images/refresh.svg?react'
import CollapseIcon from 'igz-controls/images/collapse.svg?react'
import ExpandIcon from 'igz-controls/images/expand.svg?react'

import {
  AUTO_REFRESH,
  AUTO_REFRESH_ID,
  DATE_RANGE_TIME_FILTER,
  ENTITIES_FILTER,
  GROUP_BY_FILTER,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  KEY_CODES,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  REQUEST_CANCELED,
  SHOW_ITERATIONS,
  SORT_BY,
  STATUS_FILTER,
  TAG_FILTER
} from '../../constants'
import { filterSelectOptions, tagFilterOptions } from './filterMenu.settings'
import { generateProjectsList } from '../../utils/projects'
import { getDefaultCloseDetailsLink } from '../../utils/link-helper.util'
import { removeFilters, setFilterProjectOptions, setFilters } from '../../reducers/filtersReducer'
import { setFiltersWasHandled, showWarning } from 'igz-controls/reducers/commonDetailsReducer'

import './filterMenu.scss'

const FilterMenu = ({
  actionButton = null,
  autoRefreshIsEnabled = false,
  autoRefreshIsStopped = false,
  cancelRequest = () => {},
  expand = false,
  filters,
  hidden = false,
  onChange,
  page,
  tab = '',
  toggleAllRows = () => {},
  withoutExpandButton = false
}) => {
  const [labels, setLabels] = useState('')
  const [name, setName] = useState('')
  const [entities, setEntities] = useState('')
  const [tagOptions, setTagOptions] = useState(tagFilterOptions)
  const [autoRefresh, setAutoRefresh] = useState(AUTO_REFRESH_ID)
  const params = useParams()
  const selectOptions = useMemo(() => cloneDeep(filterSelectOptions), [])
  const dispatch = useDispatch()
  const filtersStore = useSelector(store => store.filtersStore)
  const projectStore = useSelector(store => store.projectStore)
  const changes = useSelector(store => store.commonDetailsStore.changes)

  useEffect(() => {
    setLabels(filtersStore.labels)
    setName(filtersStore.name)
    setEntities(filtersStore.entities)
  }, [filtersStore.entities, filtersStore.labels, filtersStore.name])

  useEffect(() => {
    if (filters.find(filter => filter.type === TAG_FILTER)) {
      let newTagOptions = tagFilterOptions

      if (filtersStore.tagOptions?.length > 0) {
        const defaultOptionsTags = tagFilterOptions.map(option => option.id)
        newTagOptions = [
          ...tagFilterOptions,
          ...filtersStore.tagOptions.reduce((acc, tag) => {
            if (!defaultOptionsTags.includes(tag)) {
              acc.push({
                label: tag,
                id: tag
              })
            }

            return acc
          }, [])
        ]
      }

      if (!isEqual(newTagOptions, filtersStore.tagOptions)) {
        setTagOptions(() => newTagOptions)
      }
    }
  }, [dispatch, filters, filtersStore.tagOptions])

  useLayoutEffect(() => {
    if (
      filtersStore.projectOptions.length === 0 &&
      filters.some(filter => filter.type === PROJECT_FILTER)
    ) {
      dispatch(
        setFilterProjectOptions(
          generateProjectsList(projectStore.projectsNames.data, params.projectName)
        )
      )
      dispatch(
        setFilters({
          project: params.projectName
        })
      )
    }
  }, [
    dispatch,
    filters,
    filtersStore.projectOptions.length,
    params.projectName,
    projectStore.projectsNames.data
  ])

  const applyChanges = useCallback(
    (data, isRefreshed) => {
      if (isRefreshed && changes.counter > 0) {
        cancelRequest(REQUEST_CANCELED)
      } else {
        if ((params.jobId || params.name) && !isRefreshed) {
          getDefaultCloseDetailsLink(params, page, tab)
        }

        toggleAllRows && toggleAllRows(true)
        onChange(data)
      }
    },
    [params, page, tab, toggleAllRows, onChange, changes.counter, cancelRequest]
  )

  const filtersHelper = async (changes, dispatch) => {
    let handleChangeFilters = Promise.resolve(true)

    if (changes.counter > 0) {
      handleChangeFilters = await new Promise(resolve => {
        const handleDiscardChanges = () => {
          window.removeEventListener('discardChanges', handleDiscardChanges)
          resolve(true)
        }
        window.addEventListener('discardChanges', handleDiscardChanges)

        dispatch(setFiltersWasHandled(true))
        dispatch(showWarning(true))
      })
    }

    return handleChangeFilters
  }

  const handleSelectOption = useCallback(
    async (item, filter) => {
      const filtersHelperResult = await filtersHelper(changes, dispatch)

      if (filtersHelperResult) {
        if (filter.type === STATUS_FILTER) {
          dispatch(setFilters({ state: item }))
          applyChanges({
            ...filtersStore,
            state: item
          })
        } else if (filter.type === SORT_BY) {
          dispatch(setFilters({ sortBy: item }))
        } else if (filter.type === GROUP_BY_FILTER) {
          dispatch(setFilters({ groupBy: item }))
        } else if (filter.type === TAG_FILTER && item !== filtersStore.tag) {
          dispatch(setFilters({ tag: item }))
          applyChanges({
            ...filtersStore,
            tag: item
          })
        } else if (filter.type === PROJECT_FILTER) {
          dispatch(
            setFilters({
              project: item
            })
          )
          applyChanges({
            ...filtersStore,
            project: item.toLowerCase()
          })
        }
      }
    },
    [applyChanges, changes, dispatch, filtersStore]
  )

  const onKeyDown = useCallback(
    async event => {
      if (event.keyCode === KEY_CODES.ENTER) {
        const filtersHelperResult = await filtersHelper(changes, dispatch)

        if (filtersHelperResult) {
          dispatch(
            setFilters({
              labels,
              name,
              entities
            })
          )
          applyChanges({
            ...filtersStore,
            labels,
            name,
            entities
          })
        }
      }
    },
    [applyChanges, changes, dispatch, entities, filtersStore, labels, name]
  )

  const onBlur = useCallback(() => {
    dispatch(
      setFilters({
        labels,
        name,
        entities
      })
    )
  }, [dispatch, entities, labels, name])

  const handleChangeDates = useCallback(
    (dates, isPredefined, optionId) => {
      const generatedDates = [...dates]

      if (generatedDates.length === 1) {
        generatedDates.push(new Date())
      }

      dispatch(
        setFilters({
          dates: {
            value: generatedDates,
            isPredefined,
            initialSelectedOptionId: optionId
          }
        })
      )
      applyChanges({
        ...filtersStore,
        dates: {
          value: generatedDates,
          isPredefined
        }
      })
    },
    [applyChanges, dispatch, filtersStore]
  )

  const handleIter = useCallback(
    async iteration => {
      const iterValue = filtersStore.iter !== iteration ? SHOW_ITERATIONS : ''
      const filtersHelperResult = await filtersHelper(changes, dispatch)

      if (filtersHelperResult) {
        dispatch(
          setFilters({
            iter: iterValue
          })
        )
        applyChanges({
          ...filtersStore,
          iter: iterValue
        })
      }
    },
    [applyChanges, changes, dispatch, filtersStore]
  )

  const handleAutoRefresh = itemId => {
    setAutoRefresh(prevAutoRefresh => (prevAutoRefresh === itemId ? '' : AUTO_REFRESH_ID))
  }

  useLayoutEffect(() => {
    return () => {
      dispatch(removeFilters())
    }
  }, [params.pageTab, params.projectName, page, dispatch])

  useEffect(() => {
    if (autoRefreshIsEnabled && autoRefresh === AUTO_REFRESH_ID && !hidden) {
      const intervalId = setInterval(() => {
        if (!autoRefreshIsStopped) {
          applyChanges(filtersStore, true)
        }
      }, 30000)

      return () => clearInterval(intervalId)
    }
  }, [autoRefresh, hidden, autoRefreshIsEnabled, filtersStore, applyChanges, autoRefreshIsStopped])

  const getFilterTemplate = useCallback(
    filter => {
      switch (filter.type) {
        case TAG_FILTER:
          return (
            <TagFilter
              label={filter.label}
              onChange={item => handleSelectOption(item, filter)}
              page={page}
              tagFilterOptions={tagOptions}
              value={filtersStore[TAG_FILTER]}
            />
          )
        case LABELS_FILTER:
          return (
            <Input
              density="dense"
              label={filter.label}
              onChange={setLabels}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              placeholder="key1,key2=value,..."
              type="text"
              value={labels}
              tip="Add ~ before the filter value to return substring and case insensitive value."
            />
          )
        case NAME_FILTER:
          return (
            <Input
              density="dense"
              label={filter.label}
              onChange={setName}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              type="text"
              value={name}
            />
          )
        case ENTITIES_FILTER:
          return (
            <Input
              density="dense"
              label={filter.label}
              onChange={setEntities}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              type="text"
              value={entities}
            />
          )
        case DATE_RANGE_TIME_FILTER:
          return (
            <DatePicker
              date={filtersStore.dates.value[0]}
              dateTo={filtersStore.dates.value[1] || new Date()}
              label={filter.label}
              onChange={handleChangeDates}
              selectedOptionId={filtersStore.dates.initialSelectedOptionId}
              type="date-range-time"
            />
          )
        case ITERATIONS_FILTER:
          return (
            <CheckBox
              item={{ label: filter.label, id: 'iter' }}
              onChange={handleIter}
              selectedId={filtersStore.iter}
            />
          )
        case PROJECT_FILTER:
          return (
            <Select
              density="dense"
              className=""
              label={filter.label}
              onClick={project => handleSelectOption(project, filter)}
              options={filtersStore.projectOptions}
              selectedId={filtersStore.project}
            />
          )
        default:
          return (
            <Select
              density="dense"
              className=""
              label={`${filter.type.replace(/([A-Z])/g, ' $1')}:`}
              key={filter.type}
              onClick={item => handleSelectOption(item, filter)}
              options={filter.options || selectOptions[filter.type]}
              selectedId={
                (filter.type === STATUS_FILTER && filtersStore.state) ||
                (filter.type === GROUP_BY_FILTER && filtersStore.groupBy) ||
                (filter.type === SORT_BY && filtersStore.sortBy)
              }
            />
          )
      }
    },
    [
      entities,
      filtersStore,
      handleChangeDates,
      handleIter,
      handleSelectOption,
      labels,
      name,
      onBlur,
      onKeyDown,
      page,
      selectOptions,
      tagOptions
    ]
  )

  return (
    !hidden && (
      <>
        <div className="filters">
          {filters.map(filter => {
            if (filter.hidden) return null

            return (
              <div className="filter-column" key={filter.type}>
                {getFilterTemplate(filter)}
              </div>
            )
          })}
        </div>
        {actionButton &&
          !actionButton.hidden &&
          (actionButton.getCustomTemplate ? (
            actionButton.getCustomTemplate(actionButton)
          ) : (
            <Button
              variant={actionButton.variant}
              label={actionButton.label}
              tooltip={actionButton.tooltip}
              disabled={actionButton.disabled}
              onClick={actionButton.onClick}
            />
          ))}

        <div className="actions">
          {autoRefreshIsEnabled && (
            <CheckBox
              key={AUTO_REFRESH_ID}
              item={{ label: AUTO_REFRESH, id: AUTO_REFRESH_ID }}
              onChange={handleAutoRefresh}
              selectedId={autoRefresh}
            />
          )}
          <RoundedIcon
            tooltipText="Refresh"
            onClick={() => applyChanges(filtersStore, true)}
            id="refresh"
          >
            <RefreshIcon />
          </RoundedIcon>
          {!withoutExpandButton && filtersStore.groupBy !== GROUP_BY_NONE && (
            <RoundedIcon
              id="toggle-collapse"
              tooltipText={expand ? 'Collapse' : 'Expand all'}
              onClick={() => toggleAllRows(expand)}
            >
              {expand ? <CollapseIcon /> : <ExpandIcon />}
            </RoundedIcon>
          )}
        </div>
      </>
    )
  )
}

FilterMenu.propTypes = {
  actionButton: PropTypes.object,
  autoRefreshIsEnabled: PropTypes.bool,
  autoRefreshIsStopped: PropTypes.bool,
  cancelRequest: PropTypes.func,
  expand: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  hidden: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  tab: PropTypes.string,
  toggleAllRows: PropTypes.func,
  withoutExpandButton: PropTypes.bool
}

export default React.memo(FilterMenu)

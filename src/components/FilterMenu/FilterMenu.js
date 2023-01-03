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
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

import CheckBox from '../../common/CheckBox/CheckBox'
import DatePicker from '../../common/DatePicker/DatePicker'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import TagFilter from '../../common/TagFilter/TagFilter'
import { Button, RoundedIcon } from 'igz-controls/components'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'
import { ReactComponent as CollapseIcon } from 'igz-controls/images/collapse.svg'
import { ReactComponent as ExpandIcon } from 'igz-controls/images/expand.svg'

import {
  DATE_RANGE_TIME_FILTER,
  ENTITIES_FILTER,
  GROUP_BY_FILTER,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  KEY_CODES,
  LABELS_FILTER,
  NAME_FILTER,
  PERIOD_FILTER,
  PROJECT_FILTER,
  SHOW_ITERATIONS,
  SHOW_UNTAGGED_FILTER,
  SHOW_UNTAGGED_ITEMS,
  SORT_BY,
  STATUS_FILTER,
  TAG_FILTER
} from '../../constants'
import { filterSelectOptions, tagFilterOptions } from './filterMenu.settings'
import { generateProjectsList } from '../../utils/projects'
import { removeFilters, setFilterProjectOptions, setFilters } from '../../reducers/filtersReducer'
import detailsActions from '../../actions/details'

import './filterMenu.scss'

const FilterMenu = ({
  actionButton,
  cancelRequest,
  expand,
  filters,
  handleExpandAll,
  hidden,
  onChange,
  page,
  tab,
  withoutExpandButton
}) => {
  const [labels, setLabels] = useState('')
  const [name, setName] = useState('')
  const [entities, setEntities] = useState('')
  const [tagOptions, setTagOptions] = useState(tagFilterOptions)
  const navigate = useNavigate()
  const params = useParams()
  const selectOptions = useMemo(() => cloneDeep(filterSelectOptions), [])
  const dispatch = useDispatch()
  const filtersStore = useSelector(store => store.filtersStore)
  const projectStore = useSelector(store => store.projectStore)
  const changes = useSelector(store => store.detailsStore.changes)

  useEffect(() => {
    return () => {
      dispatch(removeFilters())
      setLabels('')
      setName('')
      setEntities('')
      setTagOptions(tagFilterOptions)
    }
  }, [params.pageTab, params.projectName, page, params.jobName, dispatch])

  useEffect(() => {
    setLabels(filtersStore.labels)
    setName(filtersStore.name)
  }, [filtersStore.labels, filtersStore.name])

  useEffect(() => {
    if (filters.find(filter => filter.type === TAG_FILTER)) {
      if (filtersStore.tagOptions.length > 0) {
        setTagOptions(() => {
          const defaultOptionsTags = tagFilterOptions.map(option => option.id)

          return [
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
        })
      } else {
        setTagOptions(tagFilterOptions)
      }
    }
  }, [filters, filtersStore.tagOptions])

  useEffect(() => {
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

  const applyChanges = (data, isRefreshed) => {
    if (isRefreshed && changes.counter > 0) {
      cancelRequest('cancel')
    } else {
      if ((params.jobId || params.name) && !isRefreshed) {
        navigate(
          `/projects/${params.projectName}/${page.toLowerCase()}${
            params.pageTab ? `/${params.pageTab}` : tab ? `/${tab}` : ''
          }`
        )
      }

      handleExpandAll && handleExpandAll(true)
      onChange(data)
    }
  }

  const filtersHelper = async (changes, dispatch) => {
    let handleChangeFilters = Promise.resolve(true)

    if (changes.counter > 0) {
      handleChangeFilters = await new Promise(resolve => {
        const handleDiscardChanges = () => {
          window.removeEventListener('discardChanges', handleDiscardChanges)
          resolve(true)
        }
        window.addEventListener('discardChanges', handleDiscardChanges)

        dispatch(detailsActions.setFiltersWasHandled(true))
        dispatch(detailsActions.showWarning(true))
      })
    }

    return handleChangeFilters
  }

  const handleSelectOption = async (item, filter) => {
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
  }

  const onKeyDown = async event => {
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
  }

  const onBlur = () => {
    dispatch(
      setFilters({
        labels,
        name,
        entities
      })
    )
  }

  const handleChangeDates = (dates, isPredefined) => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    dispatch(
      setFilters({
        dates: {
          value: generatedDates,
          isPredefined
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
  }

  const handleIter = async iteration => {
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
  }

  const handleShowUntagged = async showUntagged => {
    const showUntaggedValue = filtersStore.showUntagged === showUntagged ? '' : showUntagged
    const filtersHelperResult = await filtersHelper(changes, dispatch)

    if (filtersHelperResult) {
      dispatch(
        setFilters({
          showUntagged: showUntaggedValue
        })
      )
      applyChanges({
        ...filtersStore,
        showUntagged: showUntaggedValue
      })
    }
  }

  return (
    !hidden && (
      <>
        <div className="filters">
          {filters.map(filter => {
            if (!filter.hidden) {
              switch (filter.type) {
                case TAG_FILTER:
                  return (
                    <TagFilter
                      key={filter.type}
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
                      key={filter.type}
                      label={filter.label}
                      onChange={setLabels}
                      onBlur={onBlur}
                      onKeyDown={onKeyDown}
                      placeholder="key1,key2=value,..."
                      type="text"
                      value={labels}
                    />
                  )
                case NAME_FILTER:
                  return (
                    <Input
                      density="dense"
                      key={filter.type}
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
                      key={filter.type}
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
                      dateTo={filtersStore.dates.value[1]}
                      key={filter.type}
                      label={filter.label}
                      onChange={handleChangeDates}
                      type="date-range-time"
                      withOptions
                    />
                  )
                case ITERATIONS_FILTER:
                  return (
                    <CheckBox
                      key={filter.type}
                      item={{ label: filter.label, id: 'iter' }}
                      onChange={handleIter}
                      selectedId={filtersStore.iter}
                    />
                  )
                case SHOW_UNTAGGED_FILTER:
                  return (
                    <CheckBox
                      key={filter.type}
                      className="filters-checkbox"
                      item={{ label: filter.label, id: SHOW_UNTAGGED_ITEMS }}
                      onChange={handleShowUntagged}
                      selectedId={filtersStore.showUntagged}
                    />
                  )
                case PROJECT_FILTER:
                  return (
                    <Select
                      density="dense"
                      className={''}
                      label={filter.label}
                      key={filter.type}
                      onClick={project => handleSelectOption(project, filter)}
                      options={filtersStore.projectOptions}
                      selectedId={filtersStore.project}
                    />
                  )
                default:
                  return (
                    <Select
                      density="dense"
                      className={filter.type === PERIOD_FILTER ? 'period-filter' : ''}
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
            } else {
              return null
            }
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
          <RoundedIcon
            tooltipText="Refresh"
            onClick={() => applyChanges(filtersStore, true)}
            id="refresh"
          >
            <RefreshIcon />
          </RoundedIcon>
          {!withoutExpandButton && filtersStore.groupBy !== GROUP_BY_NONE && (
            <RoundedIcon
              tooltipText={expand ? 'Collapse' : 'Expand all'}
              onClick={() => handleExpandAll()}
            >
              {expand ? <CollapseIcon /> : <ExpandIcon />}
            </RoundedIcon>
          )}
        </div>
      </>
    )
  )
}

FilterMenu.defaultProps = {
  actionButton: null,
  cancelRequest: () => {},
  changes: {},
  expand: false,
  handleExpandAll: () => {},
  hidden: false,
  tab: '',
  withoutExpandButton: false
}

FilterMenu.propTypes = {
  actionButton: PropTypes.shape({}),
  cancelRequest: PropTypes.func,
  changes: PropTypes.shape({}),
  expand: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleExpandAll: PropTypes.func,
  hidden: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  tab: PropTypes.string,
  withoutExpandButton: PropTypes.bool
}

export default FilterMenu

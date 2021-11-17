import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'

import Select from '../../common/Select/Select'
import Input from '../../common/Input/Input'
import CheckBox from '../../common/CheckBox/CheckBox'
import Button from '../../common/Button/Button'
import DatePicker from '../../common/DatePicker/DatePicker'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'
import TagFilter from '../../common/TagFilter/TagFilter'

import { ReactComponent as RefreshIcon } from '../../images/refresh.svg'
import { ReactComponent as CollapseIcon } from '../../images/collapse.svg'
import { ReactComponent as ExpandIcon } from '../../images/expand.svg'

import {
  DATE_RANGE_TIME_FILTER,
  GROUP_BY_FILTER,
  ITERATIONS_FILTER,
  KEY_CODES,
  LABELS_FILTER,
  NAME_FILTER,
  PERIOD_FILTER,
  PROJECT_FILTER,
  SHOW_UNTAGGED_FILTER,
  SORT_BY,
  STATUS_FILTER,
  TAG_FILTER,
  TREE_FILTER
} from '../../constants'
import filtersActions from '../../actions/filters'
import { filterSelectOptions, tagFilterOptions } from './filterMenu.settings'
import { generateProjectsList } from '../../utils/projects'

import './filterMenu.scss'

const FilterMenu = ({
  actionButton,
  expand,
  filters,
  filtersStore,
  handleExpandAll,
  match,
  onChange,
  page,
  projectStore,
  removeFilters,
  setFilterProjectOptions,
  setFilters,
  withoutExpandButton
}) => {
  const [labels, setLabels] = useState('')
  const [name, setName] = useState('')
  const [tagOptions, setTagOptions] = useState(tagFilterOptions)
  const history = useHistory()
  const selectOptions = useMemo(() => cloneDeep(filterSelectOptions), [])

  useEffect(() => {
    return () => {
      removeFilters()
      setLabels('')
      setName('')
      setTagOptions(tagFilterOptions)
    }
  }, [removeFilters, match.params.pageTab, match.params.projectName, page])

  useEffect(() => {
    if (
      filtersStore.tagOptions.length > 0 &&
      filters.find(
        filter => filter.type === TREE_FILTER || filter.type === TAG_FILTER
      )
    ) {
      setTagOptions([
        ...filtersStore.tagOptions.map(tag => ({
          label: tag,
          id: tag
        }))
      ])
    }
  }, [filters, filtersStore.tagOptions])

  useEffect(() => {
    if (
      filtersStore.projectOptions.length === 0 &&
      filters.some(filter => filter.type === PROJECT_FILTER)
    ) {
      setFilterProjectOptions(
        generateProjectsList(
          projectStore.projectsNames.data,
          match.params.projectName
        )
      )
      setFilters({
        project: match.params.projectName
      })
    }
  }, [
    filters,
    filtersStore.projectOptions.length,
    match.params.projectName,
    projectStore.projectsNames.data,
    setFilterProjectOptions,
    setFilters
  ])

  const applyChanges = (data, isRefreshed) => {
    if ((match.params.jobId || match.params.name) && !isRefreshed) {
      history.push(
        `/projects/${match.params.projectName}/${page.toLowerCase()}${
          match.params.pageTab ? `/${match.params.pageTab}` : ''
        }`
      )
    }

    handleExpandAll(true)
    onChange(data)
  }

  const handleSelectOption = (item, filter) => {
    if (filter.type === STATUS_FILTER) {
      setFilters({ state: item })
      applyChanges({
        ...filtersStore,
        state: item
      })
    } else if (filter.type === SORT_BY) {
      setFilters({ sortBy: item })
    } else if (filter.type === GROUP_BY_FILTER) {
      setFilters({ groupBy: item })
    } else if (
      (filter.type === TREE_FILTER || filter.type === TAG_FILTER) &&
      item !== filtersStore.tag
    ) {
      setFilters({ tag: item.toLowerCase() })
      applyChanges({
        ...filtersStore,
        tag: item.toLowerCase()
      })
    } else if (filter.type === PROJECT_FILTER) {
      setFilters({
        project: item
      })
      applyChanges({
        ...filtersStore,
        project: item.toLowerCase()
      })
    }
  }

  const onKeyDown = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      setFilters({
        labels,
        name
      })
      applyChanges({
        ...filtersStore,
        labels,
        name
      })
    }
  }

  const onBlur = () => {
    setFilters({
      labels,
      name
    })
  }

  const handleChangeDates = (dates, isPredefined) => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    setFilters({
      dates: {
        value: generatedDates,
        isPredefined
      }
    })
    applyChanges({
      ...filtersStore,
      dates: {
        value: generatedDates,
        isPredefined
      }
    })
  }

  const handleIter = iteration => {
    const iterValue = filtersStore.iter === iteration ? 'iter' : ''

    setFilters({
      iter: iterValue
    })
    applyChanges({
      ...filtersStore,
      iter: iterValue
    })
  }

  const handleShowUntagged = showUntagged => {
    const showUntaggedValue =
      filtersStore.showUntagged === showUntagged ? '' : showUntagged
    setFilters({
      showUntagged: showUntaggedValue
    })
    applyChanges({
      ...filtersStore,
      showUntagged: showUntaggedValue
    })
  }

  return (
    <>
      <div className="filters">
        {filters.map(filter => {
          switch (filter.type) {
            case TREE_FILTER:
            case TAG_FILTER:
              return (
                <TagFilter
                  key={filter.type}
                  label={filter.label}
                  match={match}
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
                  item={{ label: filter.label, id: '' }}
                  onChange={handleIter}
                  selectedId={filtersStore.iter}
                />
              )
            case SHOW_UNTAGGED_FILTER:
              return (
                <CheckBox
                  key={filter.type}
                  className="filters-checkbox"
                  item={{ label: filter.label, id: 'showUntagged' }}
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
                  className={
                    filter.type === PERIOD_FILTER ? 'period-filter' : ''
                  }
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
        {!withoutExpandButton && filtersStore.groupBy !== 'none' && (
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
}

FilterMenu.defaultProps = {
  actionButton: null,
  withoutExpandButton: false
}

FilterMenu.propTypes = {
  actionButton: PropTypes.shape({}),
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  withoutExpandButton: PropTypes.bool
}

export default connect(
  ({ filtersStore, projectStore }) => ({
    filtersStore,
    projectStore
  }),
  { ...filtersActions }
)(FilterMenu)

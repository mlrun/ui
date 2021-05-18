import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Input from '../../common/Input/Input'
import CheckBox from '../../common/CheckBox/CheckBox'
import Button from '../../common/Button/Button'
import DatePicker from '../../common/DatePicker/DatePicker'

import { ReactComponent as Refresh } from '../../images/refresh.svg'
import { ReactComponent as Collapse } from '../../images/collapse.svg'
import { ReactComponent as Expand } from '../../images/expand.svg'

import {
  ARTIFACTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  KEY_CODES,
  MODELS_PAGE,
  MONITOR_TAB
} from '../../constants'
import artifactsAction from '../../actions/artifacts'
import {
  selectOptions,
  filterTreeOptions,
  initialStateFilter
} from './filterMenu.settings'

import './filterMenu.scss'

const FilterMenu = ({
  actionButton,
  expand,
  filters,
  groupFilter,
  handleExpandAll,
  match,
  onChange,
  page,
  setGroupFilter,
  showUntagged,
  toggleShowUntagged
}) => {
  const [labels, setLabels] = useState('')
  const [owner, setOwner] = useState('')
  const [name, setName] = useState('')
  const [iter, setIter] = useState('')
  const [tag, setTag] = useState('latest')
  const [dates, setDates] = useState(['', ''])
  const [treeOptions, setTreeOptions] = useState(filterTreeOptions)
  const [stateFilter, setStateFilter] = useState(initialStateFilter)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (filters.find(filter => filter.type === 'iterations')) {
      setIter('iter')
    }
  }, [filters])

  useEffect(() => {
    if (
      page === JOBS_PAGE &&
      !selectOptions.groupBy.find(option => option.id === 'workflow')
    ) {
      selectOptions.groupBy.push({ label: 'Workflow', id: 'workflow' })
    }

    return () => {
      setLabels('')
      setName('')
      setIter('')
      setTag('latest')
    }
  }, [page, match.params.pageTab])

  useEffect(() => {
    if (filters.find(filter => filter.type === 'tree')) {
      dispatch(
        artifactsAction.fetchArtifactTags(match.params.projectName)
      ).then(({ data }) => {
        setTreeOptions(state => [
          ...state,
          ...data.tags
            .filter(tag => tag !== 'latest')
            .map(tag => ({
              label: tag,
              id: tag
            }))
        ])
      })
    }
  }, [dispatch, filters, match.params.projectName])

  useEffect(() => {
    if (match.params.pageTab === MONITOR_TAB) {
      onChange({ dates: ['', ''] })
      setDates(['', ''])
    }
  }, [match.params.pageTab, onChange])

  const applyChanges = data => {
    if (match.params.jobId || match.params.name) {
      history.push(
        `/projects/${match.params.projectName}/${page.toLowerCase()}${
          match.params.pageTab ? `/${match.params.pageTab}` : ''
        }`
      )
    }

    if (
      [ARTIFACTS_PAGE, FILES_PAGE, MODELS_PAGE, FEATURE_STORE_PAGE].includes(
        page
      )
    ) {
      onChange(data)
    } else {
      page === JOBS_PAGE ? onChange(data) : onChange({ name })
    }
  }

  const handleSelectOption = (item, filter) => {
    if (filter.type === 'status') {
      setStateFilter(item)
      applyChanges({
        labels,
        name,
        owner,
        dates,
        state: item !== initialStateFilter && item,
        iter,
        tag
      })
    } else if (filter.type === 'groupBy') {
      setGroupFilter(item)
    }
  }

  const handleSelectTree = filter => {
    applyChanges({
      tag: filter,
      labels,
      name,
      dates,
      state: stateFilter !== initialStateFilter && stateFilter,
      iter
    })
    setTag(filter)
  }

  const onKeyDown = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      applyChanges({
        tag,
        labels,
        name,
        dates,
        state: stateFilter !== initialStateFilter && stateFilter,
        iter
      })
    }
  }

  const handleChangeDates = dates => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    applyChanges({
      tag,
      labels,
      name,
      owner,
      dates,
      state: stateFilter !== initialStateFilter && stateFilter,
      iter
    })
    setDates(generatedDates)
  }

  return (
    <>
      <div className="filters">
        {filters.map(filter => {
          switch (filter.type) {
            case 'tree':
            case 'tag':
              return (
                <ArtifactFilterTree
                  filterTreeOptions={treeOptions}
                  key={filter.type}
                  label={filter.label}
                  match={match}
                  onChange={handleSelectTree}
                  page={page}
                  value={tag}
                />
              )
            case 'labels':
              return (
                <Input
                  type="text"
                  label={filter.label}
                  placeholder="key1,key2=value,..."
                  key={filter.type}
                  onChange={setLabels}
                  value={labels}
                  onKeyDown={onKeyDown}
                />
              )
            case 'name':
              return (
                <Input
                  type="text"
                  label={filter.label}
                  key={filter.type}
                  onChange={setName}
                  value={name}
                  onKeyDown={onKeyDown}
                />
              )
            case 'owner':
              return (
                <Input
                  type="text"
                  label={filter.label}
                  key={filter.type}
                  onChange={setOwner}
                  value={owner}
                  onKeyDown={onKeyDown}
                />
              )
            case 'date-range-time':
              return (
                <DatePicker
                  key={filter.type}
                  label={filter.label}
                  onChange={handleChangeDates}
                  date={dates[0]}
                  dateTo={dates[1]}
                  type="date-range-time"
                  withOptions
                />
              )
            case 'iterations':
              return (
                <CheckBox
                  key={filter.type}
                  item={{ label: filter.label, id: '' }}
                  onChange={iteration => {
                    applyChanges({
                      labels,
                      name,
                      owner,
                      dates,
                      tag,
                      state: stateFilter !== initialStateFilter && stateFilter,
                      iter: iter === iteration ? 'iter' : ''
                    })
                    setIter(state => (state === iteration ? 'iter' : iteration))
                  }}
                  selectedId={iter}
                />
              )
            default:
              return (
                <Select
                  className={filter.type === 'period' ? 'period-filter' : ''}
                  options={selectOptions[filter.type]}
                  label={`${filter.type.replace(/([A-Z])/g, ' $1')}:`}
                  key={filter.type}
                  selectedId={
                    (filter.type === 'status' && stateFilter) ||
                    (filter.type === 'groupBy' && groupFilter)
                  }
                  onClick={item => handleSelectOption(item, filter)}
                />
              )
          }
        })}
        {page === FUNCTIONS_PAGE && (
          <CheckBox
            className="filters-checkbox"
            item={{
              label: 'Show untagged',
              id: 'showUntagged'
            }}
            onChange={toggleShowUntagged}
            selectedId={showUntagged}
          />
        )}
      </div>
      {actionButton &&
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
        <Tooltip template={<TextTooltipTemplate text="Refresh" />}>
          <button
            onClick={() => {
              ![JOBS_PAGE, FUNCTIONS_PAGE].includes(page)
                ? applyChanges({
                    tag,
                    labels,
                    name,
                    iter
                  })
                : applyChanges({ labels, name, dates })
            }}
            id="refresh"
          >
            <Refresh />
          </button>
        </Tooltip>
        {groupFilter && groupFilter?.toLowerCase() !== 'none' && (
          <Tooltip
            template={
              <TextTooltipTemplate text={expand ? 'Collapse' : 'Expand'} />
            }
          >
            <button onClick={handleExpandAll}>
              {expand ? <Collapse /> : <Expand />}
            </button>
          </Tooltip>
        )}
      </div>
    </>
  )
}

FilterMenu.defaultProps = {
  actionButton: null,
  groupFilter: '',
  setGroupFilter: null,
  showUntagged: '',
  toggleShowUntagged: null
}

FilterMenu.propTypes = {
  actionButton: PropTypes.shape({}),
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groupFilter: PropTypes.string,
  setGroupFilter: PropTypes.func,
  showUntagged: PropTypes.string,
  toggleShowUntagged: PropTypes.func
}

export default FilterMenu

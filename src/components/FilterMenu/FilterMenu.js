import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../../elements/ArtifactsFilterTree/ArtifactsFilterTree'
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
  MODELS_PAGE
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
  handleArtifactFilterTree,
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
  const [dates, setDates] = useState(['', ''])
  const [treeOptions, setTreeOptions] = useState(filterTreeOptions)
  const [stateFilter, setStateFilter] = useState(initialStateFilter)
  const history = useHistory()
  const artifactFilter = useSelector(store => store.artifactsStore.filter)
  const dispatch = useDispatch()

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

  const applyChanges = () => {
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
      dispatch(
        artifactsAction.setArtifactFilter({
          ...artifactFilter,
          labels,
          name
        })
      )
      onChange({
        tag: artifactFilter.tag,
        project: match.params.projectName,
        labels,
        name
      })
    } else {
      page === JOBS_PAGE
        ? onChange({
            labels,
            name,
            owner,
            dates,
            state: stateFilter !== initialStateFilter && stateFilter
          })
        : onChange({ name })
    }
  }

  const handleSelectOption = (item, filter) => {
    if (match.params.jobId || match.params.name) {
      history.push(
        `/projects/${match.params.projectName}/${page.toLowerCase()}${
          match.params.pageTab ? `/${match.params.pageTab}` : ''
        }`
      )
    }

    if (filter.type === 'status') {
      setStateFilter(item)
      onChange({
        labels,
        name,
        owner,
        dates,
        state: item !== initialStateFilter && item
      })
    } else if (filter.type === 'groupBy') {
      setGroupFilter(item)
    }
  }

  const onKeyDown = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      applyChanges()
    }
  }

  const handleChangeDates = dates => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    onChange({
      labels,
      name,
      owner,
      dates,
      state: stateFilter !== initialStateFilter && stateFilter
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
                  onChange={handleArtifactFilterTree}
                  page={page}
                  value={artifactFilter.tag}
                />
              )
            case 'labels':
              return (
                <Input
                  density="dense"
                  key={filter.type}
                  label={filter.label}
                  onChange={setLabels}
                  onKeyDown={onKeyDown}
                  placeholder="key1,key2=value,..."
                  type="text"
                  value={labels}
                />
              )
            case 'name':
              return (
                <Input
                  density="dense"
                  key={filter.type}
                  label={filter.label}
                  onChange={setName}
                  onKeyDown={onKeyDown}
                  type="text"
                  value={name}
                />
              )
            case 'owner':
              return (
                <Input
                  density="dense"
                  key={filter.type}
                  label={filter.label}
                  onChange={setOwner}
                  onKeyDown={onKeyDown}
                  value={owner}
                  type="text"
                />
              )
            case 'date-range-time':
              return (
                <DatePicker
                  date={dates[0]}
                  dateTo={dates[1]}
                  key={filter.type}
                  label={filter.label}
                  onChange={handleChangeDates}
                  type="date-range-time"
                  withOptions
                />
              )
            default:
              return (
                <Select
                  density="dense"
                  className={filter.type === 'period' ? 'period-filter' : ''}
                  label={`${filter.type.replace(/([A-Z])/g, ' $1')}:`}
                  key={filter.type}
                  onClick={item => handleSelectOption(item, filter)}
                  options={selectOptions[filter.type]}
                  selectedId={
                    (filter.type === 'status' && stateFilter) ||
                    (filter.type === 'groupBy' && groupFilter)
                  }
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
                ? onChange({
                    tag: artifactFilter.tag,
                    project: match.params.projectName,
                    labels,
                    name
                  })
                : onChange({ labels, name, dates })
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
  handleArtifactFilterTree: null,
  setGroupFilter: null,
  showUntagged: '',
  toggleShowUntagged: null
}

FilterMenu.propTypes = {
  actionButton: PropTypes.shape({}),
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groupFilter: PropTypes.string,
  handleArtifactFilterTree: PropTypes.func,
  setGroupFilter: PropTypes.func,
  showUntagged: PropTypes.string,
  toggleShowUntagged: PropTypes.func
}

export default FilterMenu

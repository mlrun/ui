import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Input from '../../common/Input/Input'
import CheckBox from '../../common/CheckBox/CheckBox'
import Button from '../../common/Button/Button'

import { ReactComponent as Refresh } from '../../images/refresh.svg'
import { ReactComponent as Collapse } from '../../images/collapse.svg'
import { ReactComponent as Expand } from '../../images/expand.svg'

import {
  ARTIFACTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE
} from '../../constants'
import artifactsAction from '../../actions/artifacts'
import { selectOptions, filterTreeOptions } from './filterMenu.settings'

import DatePicker from '../../common/DatePicker/DatePicker'

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
  setStateFilter,
  showUntagged,
  stateFilter,
  toggleShowUntagged
}) => {
  const [labels, setLabels] = useState('')
  const [owner, setOwner] = useState('')
  const [name, setName] = useState('')
  const [dates, setDates] = useState(['', ''])
  const [treeOptions, setTreeOptions] = useState(filterTreeOptions)
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
        ? onChange({ labels, name, owner, dates })
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
    } else if (filter.type === 'groupBy') {
      setGroupFilter(item)
    }
  }

  const onKeyDown = event => {
    if (event.keyCode === 13) {
      applyChanges()
    }
  }

  useEffect(() => {
    applyChanges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates])

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
                  onChange={setDates}
                  splitCharacter="."
                  date={dates[0]}
                  dateTo={dates[1]}
                  type="date-range-time"
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
      {actionButton && (
        <Button
          variant={actionButton.variant}
          label={actionButton.label}
          tooltip={actionButton.tooltip}
          disabled={actionButton.disabled}
          onClick={actionButton.onClick}
        />
      )}
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
  setStateFilter: null,
  showUntagged: '',
  stateFilter: '',
  toggleShowUntagged: null
}

FilterMenu.propTypes = {
  actionButton: PropTypes.shape({}),
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groupFilter: PropTypes.string,
  handleArtifactFilterTree: PropTypes.func,
  setGroupFilter: PropTypes.func,
  setStateFilter: PropTypes.func,
  showUntagged: PropTypes.string,
  stateFilter: PropTypes.string,
  toggleShowUntagged: PropTypes.func
}

export default FilterMenu

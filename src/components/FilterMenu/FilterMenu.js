import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
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
  handleExpandAll,
  handleArtifactFilterTree,
  match,
  onChange,
  page,
  setGroupFilter,
  setIteration,
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
  const [showActionButton, setShowActionButton] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const artifactFilter = useSelector(store => store.artifactsStore.filter)
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      page !== FUNCTIONS_PAGE ||
      new URLSearchParams(location.search).get('demo') === 'true'
    ) {
      setShowActionButton(true)
    } else if (showActionButton) {
      setShowActionButton(false)
    }
  }, [location.search, page, showActionButton])

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
  }, [page])

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

  const applyChanges = (data, isRefreshed) => {
    if ((match.params.jobId || match.params.name) && !isRefreshed) {
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
    handleArtifactFilterTree({
      labels,
      name,
      owner,
      dates,
      state: stateFilter !== initialStateFilter && stateFilter,
      iter,
      tag: filter
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

  const handleIterClick = iteration => {
    handleExpandAll(true)
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
    setIteration(state => (state === iteration ? 'iter' : iteration))
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
            case 'iterations':
              return (
                <CheckBox
                  key={filter.type}
                  item={{ label: filter.label, id: '' }}
                  onChange={handleIterClick}
                  selectedId={iter}
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
        ) : showActionButton ? (
          <Button
            variant={actionButton.variant}
            label={actionButton.label}
            tooltip={actionButton.tooltip}
            disabled={actionButton.disabled}
            onClick={actionButton.onClick}
          />
        ) : null)}
      <div className="actions">
        <Tooltip template={<TextTooltipTemplate text="Refresh" />}>
          <button
            onClick={() => {
              ![JOBS_PAGE, FUNCTIONS_PAGE].includes(page)
                ? applyChanges(
                    {
                      tag,
                      labels,
                      name,
                      iter
                    },
                    true
                  )
                : applyChanges({ labels, name, dates }, true)
            }}
            id="refresh"
          >
            <Refresh />
          </button>
        </Tooltip>
        {groupFilter && groupFilter?.toLowerCase() !== 'none' && (
          <Tooltip
            template={
              <TextTooltipTemplate text={expand ? 'Collapse' : 'Expand all'} />
            }
          >
            <button onClick={() => handleExpandAll()}>
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
  setIteration: () => {},
  showUntagged: '',
  toggleShowUntagged: null
}

FilterMenu.propTypes = {
  actionButton: PropTypes.shape({}),
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groupFilter: PropTypes.string,
  handleArtifactFilterTree: PropTypes.func,
  setGroupFilter: PropTypes.func,
  setIteration: PropTypes.func,
  showUntagged: PropTypes.string,
  toggleShowUntagged: PropTypes.func
}

export default FilterMenu

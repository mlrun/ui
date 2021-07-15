import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, connect } from 'react-redux'

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

import { INIT_TAG_FILTER, JOBS_PAGE, KEY_CODES } from '../../constants'
import artifactsAction from '../../actions/artifacts'
import filtersActions from '../../actions/filters'
import { selectOptions, filterTreeOptions } from './filterMenu.settings'

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
  removeFilters,
  setFilters,
  withoutExpandButton
}) => {
  const [labels, setLabels] = useState('')
  const [name, setName] = useState('')
  const [treeOptions, setTreeOptions] = useState(filterTreeOptions)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      removeFilters()
      setLabels('')
      setName('')
      setTreeOptions(filterTreeOptions)
    }
  }, [removeFilters, match.params.pageTab, match.params.projectName, page])

  useEffect(() => {
    if (
      page === JOBS_PAGE &&
      !selectOptions.groupBy.find(option => option.id === 'workflow')
    ) {
      selectOptions.groupBy.push({ label: 'Workflow', id: 'workflow' })
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
            .filter(tag => tag !== INIT_TAG_FILTER)
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

    onChange(data)
  }

  const handleSelectOption = (item, filter) => {
    if (filter.type === 'status') {
      setFilters({ state: item })
      applyChanges({
        ...filtersStore,
        state: item
      })
    } else if (filter.type === 'groupBy') {
      setFilters({ groupBy: item })
    } else if (
      (filter.type === 'tree' || filter.type === 'tag') &&
      item !== filtersStore.tag
    ) {
      setFilters({ tag: item.toLowerCase() })
      applyChanges({
        ...filtersStore,
        tag: item.toLowerCase()
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

  const handleChangeDates = dates => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    setFilters({ dates: generatedDates })
    applyChanges({
      ...filtersStore,
      dates: generatedDates
    })
  }

  const handleIter = iteration => {
    const iterValue = filtersStore.iter === iteration ? 'iter' : ''

    handleExpandAll(true)
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
            case 'tree':
            case 'tag':
              return (
                <ArtifactFilterTree
                  filterTreeOptions={treeOptions}
                  key={filter.type}
                  label={filter.label}
                  match={match}
                  onChange={item => handleSelectOption(item, filter)}
                  page={page}
                  value={filtersStore.tag}
                />
              )
            case 'labels':
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
            case 'name':
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
            case 'date-range-time':
              return (
                <DatePicker
                  date={filtersStore.dates[0]}
                  dateTo={filtersStore.dates[1]}
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
                  onChange={handleIter}
                  selectedId={filtersStore.iter}
                />
              )
            case 'show-untagged':
              return (
                <CheckBox
                  key={filter.type}
                  className="filters-checkbox"
                  item={{ label: filter.label, id: 'showUntagged' }}
                  onChange={handleShowUntagged}
                  selectedId={filtersStore.showUntagged}
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
                    (filter.type === 'status' && filtersStore.state) ||
                    (filter.type === 'groupBy' && filtersStore.groupBy)
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
        <Tooltip template={<TextTooltipTemplate text="Refresh" />}>
          <button onClick={() => applyChanges(filtersStore, true)} id="refresh">
            <Refresh />
          </button>
        </Tooltip>
        {!withoutExpandButton && filtersStore.groupBy !== 'none' && (
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
  withoutExpandButton: false
}

FilterMenu.propTypes = {
  actionButton: PropTypes.shape({}),
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  withoutExpandButton: PropTypes.bool
}

export default connect(
  ({ filtersStore }) => ({
    filtersStore
  }),
  filtersActions
)(FilterMenu)

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

import './filterMenu.scss'

const FilterMenu = ({
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
  }, [page])

  const onKeyDown = event => {
    if (event.keyCode === 13) {
      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}${
            match.params.pageTab ? `/${match.params.pageTab}` : ''
          }`
        )
      }
      if (
        page === ARTIFACTS_PAGE ||
        page === FILES_PAGE ||
        page === MODELS_PAGE ||
        page === FEATURE_STORE_PAGE
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
          ? onChange({ labels, name, owner })
          : onChange({ name })
      }
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

    if (filter === 'status') {
      setStateFilter(item)
    } else if (filter === 'groupBy') {
      setGroupFilter(item)
    }
  }

  return (
    <>
      <div className="filters">
        {filters.map(filter => {
          switch (filter.type) {
            case 'tree':
              return (
                <ArtifactFilterTree
                  filterTreeOptions={filterTreeOptions}
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
                  placeholder="key1=value1,…"
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
      <div className="buttons">
        <Tooltip template={<TextTooltipTemplate text="Refresh" />}>
          <button
            onClick={() => {
              page === ARTIFACTS_PAGE ||
              page === FILES_PAGE ||
              page === MODELS_PAGE ||
              page === FEATURE_STORE_PAGE
                ? onChange({
                    tag: artifactFilter.tag,
                    project: match.params.projectName,
                    labels,
                    name
                  })
                : onChange({ labels, name })
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
  groupFilter: '',
  handleArtifactFilterTree: null,
  setGroupFilter: null,
  setStateFilter: null,
  showUntagged: '',
  stateFilter: '',
  toggleShowUntagged: null
}

FilterMenu.propTypes = {
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

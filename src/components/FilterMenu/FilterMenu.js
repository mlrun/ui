import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Input from '../../common/Input/Input'
import CheckBox from '../../common/CheckBox/CheckBox'

import { ReactComponent as Refresh } from '../../images/refresh.svg'
import { ReactComponent as Collapse } from '../../images/collapse.svg'
import { ReactComponent as Expand } from '../../images/expand.svg'

import { ARTIFACTS_PAGE, FUNCTIONS_PAGE, JOBS_PAGE } from '../../constants.js'

import artifactsData from '../Artifacts/artifactsData'
import { selectOptions, filterTreeOptions } from './filterMenu.settings'

import './filterMenu.scss'

const FilterMenu = ({
  expand,
  filters,
  handleExpandAll,
  match,
  onChange,
  page,
  groupFilter,
  setStateFilter,
  setGroupFilter,
  showUntagged,
  stateFilter,
  toggleShowUntagged
}) => {
  const [valueFilterTree, setValueFilterTree] = useState('latest')
  const [labels, setLabels] = useState('')
  const [name, setName] = useState('')
  const history = useHistory()

  if (page === JOBS_PAGE) {
    selectOptions.groupBy.push({ label: 'Workflow', id: 'workflow' })
  }

  const handleChangeArtifactFilterTree = item => {
    const value = item.toLowerCase() !== 'latest' ? item.toLowerCase() : ''
    onChange({ tag: value, project: match.params.projectName, name, labels })
    setValueFilterTree(value)
  }

  const onKeyDown = event => {
    if (event.keyCode === 13) {
      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
      }

      page === ARTIFACTS_PAGE
        ? onChange({
            tag: valueFilterTree,
            project: match.params.projectName,
            labels,
            name
          })
        : page === JOBS_PAGE
        ? onChange({ labels, name })
        : onChange({ name })
    }
  }

  return (
    <>
      <div className="filters">
        {filters.map(filter => {
          switch (filter) {
            case 'tree':
              return (
                <ArtifactFilterTree
                  filterTreeOptions={filterTreeOptions}
                  key={filter}
                  label="Tree:"
                  match={match}
                  onChange={handleChangeArtifactFilterTree}
                  page={page}
                  value={valueFilterTree}
                />
              )
            case 'labels':
              return (
                <Input
                  type="text"
                  label="labels:"
                  placeholder="key1=value1,…"
                  key={filter}
                  onChange={setLabels}
                  value={labels}
                  onKeyDown={onKeyDown}
                />
              )
            case 'name':
              return (
                <Input
                  type="text"
                  label="name:"
                  key={filter}
                  onChange={setName}
                  value={name}
                  onKeyDown={onKeyDown}
                />
              )
            default:
              return (
                <Select
                  className={filter === 'period' ? 'period-filter' : ''}
                  options={selectOptions[filter]}
                  label={`${filter.replace(/([A-Z])/g, ' $1')}:`}
                  key={filter}
                  selectedId={
                    (filter === 'status' && stateFilter) ||
                    (filter === 'groupBy' && groupFilter)
                  }
                  selectType={filter === 'status' ? 'checkbox' : ''}
                  match={match}
                  onClick={
                    (filter === 'status' && setStateFilter) ||
                    (filter === 'groupBy' && setGroupFilter)
                  }
                  page={page}
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
              page === artifactsData.page
                ? onChange({
                    tag: valueFilterTree !== 'latest' ? valueFilterTree : '',
                    project: match.params.projectName,
                    labels,
                    name
                  })
                : onChange({ labels, name })
            }}
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
  setStateFilter: null,
  setGroupFilter: null,
  showUntagged: '',
  stateFilter: '',
  toggleShowUntagged: null
}

FilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupFilter: PropTypes.string,
  setStateFilter: PropTypes.func,
  setGroupFilter: PropTypes.func,
  showUntagged: PropTypes.string,
  stateFilter: PropTypes.string,
  toggleShowUntagged: PropTypes.func
}

export default FilterMenu

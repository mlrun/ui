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

import { ARTIFACTS_PAGE, FUNCTIONS_PAGE } from '../../constants.js'

import artifactsData from '../Artifacts/artifactsData'

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
  setShowUntagged,
  showUntagged,
  stateFilter
}) => {
  const [itemsFilterTree] = useState(['Latest'])
  const [valueFilterTree, setValueFilterTree] = useState('')
  const [labels, setLabels] = useState('')
  const [name, setName] = useState('')
  const history = useHistory()
  const selectOptions = {
    period: [
      { label: 'Last 7 days', id: 'last7Days' },
      { label: 'Last 14 days', id: 'last14Days' },
      { label: 'Last months', id: 'lastMonths' },
      { label: 'Last 6 months', id: 'last6Months' }
    ],
    status: [
      { label: 'All', id: 'all' },
      { label: 'Completed', id: 'completed' },
      { label: 'Running', id: 'running' },
      { label: 'Error', id: 'error' }
    ],
    groupBy: [
      { label: 'None', id: 'none' },
      { label: 'Name', id: 'name' }
    ]
  }

  const handleChangeArtifactFilterTree = item => {
    const value = item.toLowerCase()
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
        : onChange({ labels, name })
    }
  }

  return (
    <>
      <div className="filters">
        {filters.map(filter =>
          filter === 'tree' ? (
            <ArtifactFilterTree
              key={filter}
              value={valueFilterTree || 'Latest'}
              label="Tree:"
              items={itemsFilterTree}
              match={match}
              onChange={handleChangeArtifactFilterTree}
              page={page}
            />
          ) : filter === 'labels' || filter === 'name' ? (
            <Input
              type="text"
              label={filter === 'labels' ? 'labels:' : 'name:'}
              placeholder={filter === 'labels' ? 'key1=value1,…' : ''}
              key={filter}
              onChange={filter === 'labels' ? setLabels : setName}
              value={filter === 'labels' ? labels : name}
              onKeyDown={onKeyDown}
            />
          ) : (
            <Select
              options={selectOptions[filter]}
              label={`${filter}:`}
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
        )}
        {page === FUNCTIONS_PAGE && (
          <CheckBox
            className="filters-checkbox"
            item={{
              label: 'Show untagged',
              id: 'showUntagged'
            }}
            onChange={setShowUntagged}
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
                    tag: valueFilterTree.toLowerCase(),
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
        {groupFilter?.toLowerCase() !== 'none' && groupFilter !== '' && (
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
  setShowUntagged: null,
  showUntagged: '',
  stateFilter: ''
}

FilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupFilter: PropTypes.string,
  setStateFilter: PropTypes.func,
  setGroupFilter: PropTypes.func,
  setShowUntagged: PropTypes.func,
  showUntagged: PropTypes.string,
  stateFilter: PropTypes.string
}

export default FilterMenu

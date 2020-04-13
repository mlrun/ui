import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Input from '../../common/Input/Input'

import { ReactComponent as Refresh } from '../../images/refresh.svg'
import { ReactComponent as Collapse } from '../../images/collapse.svg'
import { ReactComponent as Expand } from '../../images/expand.svg'

import { ARTIFACTS_PAGE } from '../../constants.js'

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
  stateFilter
}) => {
  const [itemsFilterTree] = useState(['Latest'])
  const [valueFilterTree, setValueFilterTree] = useState('')
  const [labels, setLabels] = useState('')
  const [name, setName] = useState('')
  const history = useHistory()

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
              label={filter === 'labels' ? 'labels' : 'name'}
              placeholder={filter === 'labels' ? 'key1=value1,…' : ''}
              key={filter}
              onChange={filter === 'labels' ? setLabels : setName}
              value={filter === 'labels' ? labels : name}
              onKeyDown={onKeyDown}
            />
          ) : (
            <Select
              option={filter}
              label={`${filter}:`}
              key={filter}
              value={
                (filter === 'status' && stateFilter) ||
                (filter === 'group by' && groupFilter)
              }
              match={match}
              onClick={
                (filter === 'status' && setStateFilter) ||
                (filter === 'group by' && setGroupFilter)
              }
              page={page}
            />
          )
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
        {groupFilter.toLowerCase() !== 'none' && groupFilter !== '' && (
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
  setStateFilter: () => {},
  setGroupFilter: () => {},
  stateFilter: ''
}

FilterMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupFilter: PropTypes.string,
  setStateFilter: PropTypes.func,
  setGroupFilter: PropTypes.func,
  stateFilter: PropTypes.string
}

export default FilterMenu

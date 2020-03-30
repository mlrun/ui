import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Select from '../../common/Select/Select'
import ArtifactFilterTree from '../ArtifactsFilterTree/ArtifactsFilterTree'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import ArtifactFilterLabels from '../ArtifactFilterLabels/ArtifactFilterLabels'

import { ReactComponent as Refresh } from '../../svg/refresh.svg'
import { ReactComponent as Collapse } from '../../svg/collapse.svg'
import { ReactComponent as Expand } from '../../svg/expand.svg'

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

  const handleChangeArtifactFilterTree = item => {
    const value = item.toLowerCase()
    onChange({ tag: value, project: match.params.projectName })
    setValueFilterTree(value)
  }

  const handleLabels = event => {
    setLabels(event)
    page === ARTIFACTS_PAGE
      ? onChange({
          tag: valueFilterTree,
          project: match.params.projectName,
          labels: event
        })
      : onChange(event)
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
          ) : filter === 'labels' ? (
            <ArtifactFilterLabels
              key={filter}
              match={match}
              onChange={handleLabels}
              page={page}
              value={labels}
            />
          ) : (
            <Select
              option={filter}
              label={filter}
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
                    project: match.params.projectName
                  })
                : onChange()
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

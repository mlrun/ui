import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import artifactsAction from '../../actions/artifacts'

import './artefactsfiltermenu.scss'
import Search from '../../common/Search/Search'
import { useState } from 'react'

const ArtifactsFilerMenu = () => {
  const dispatch = useDispatch()
  const [, setSearch] = useState('')

  const refreshArtifacts = useCallback(() => {
    dispatch(artifactsAction.refreshArtifacts(true))
  }, [dispatch])

  return (
    <div className="artefacts-filter-container">
      <div className="artefacts-filter-period">
        <select className="font period">
          <option value="7">Last 7 days</option>
        </select>
      </div>
      <div className="artefacts-filter-group">
        <select className="font group">
          <option value="name">Name</option>
        </select>
      </div>
      <div className="artefacts-filter-status">
        <select className="font status">
          <option value="all">All</option>
        </select>
      </div>
      <Search onChange={value => setSearch(value)} />
      <div className="artefacts-filter-refresh">
        <button onClick={() => refreshArtifacts()}></button>
      </div>
    </div>
  )
}

export default React.memo(ArtifactsFilerMenu)

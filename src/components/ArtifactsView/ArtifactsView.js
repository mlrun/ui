import React from 'react'
import PropTypes from 'prop-types'
import ArtifactsFilerMenu from '../ArtifacstFilterMenu/ArtifactsFilerMenu'
import Loader from '../../common/Loader/Loader'
import ArtifactsTable from '../../elements/ArtifactsTable/ArtifactsTable'

import './artifactsview.scss'

const ArtifactView = ({ loading, artifacts, refresh, onChangeFilter }) => {
  return (
    <>
      <div className="menu_container">
        <div className="menu_item active">Monitor</div>
        {/*<div className="menu-item">Edit</div>*/}
        {/*<div className="menu-item">Create</div>*/}
      </div>
      <div className="artifacts_table">
        <ArtifactsFilerMenu
          refreshArtifacts={refresh}
          onChangeFilter={onChangeFilter}
        />
        {loading ? <Loader /> : <ArtifactsTable artifacts={artifacts} />}
      </div>
    </>
  )
}

ArtifactView.propTypes = {
  artifacts: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  refresh: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired
}

export default ArtifactView

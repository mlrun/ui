import React from 'react'
import PropTypes from 'prop-types'
import ArtifactsFilerMenu from '../ArtifacstFilterMenu/ArtifactsFilerMenu'
import Loader from '../../common/Loader/Loader'
import ArtifactsTable from '../../elements/ArtifactsTable/ArtifactsTable'

import './artifactsview.scss'

const ArtifactView = ({ artifacts, loading }) => {
  return (
    <>
      <div className="menu-container">
        <div className="menu-item active">Monitor</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">Create</div>
      </div>
      <div className="artifacts-table">
        <ArtifactsFilerMenu />
        {loading ? <Loader /> : <ArtifactsTable artifacts={artifacts} />}
      </div>
    </>
  )
}

ArtifactView.propTypes = {
  artifacts: PropTypes.array.isRequired,
  loading: PropTypes.bool
}

export default React.memo(ArtifactView)

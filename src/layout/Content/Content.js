import React from 'react'
import PropTypes from 'prop-types'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
// import JobsTable from '../JobsTable/JobsTable'
import YamlModal from '../../common/YamlModal/YamlModal'

// import searchIcon from '../../images/search-icon.png'
import refreshIcon from '../../images/refresh.png'

import './content.scss'
import ArtifactsFilerMenu from '../../components/ArtifacstFilterMenu/ArtifactsFilerMenu'
import Table from '../../components/Table/Table'

const Content = ({ match, refresh, handleCancel, convertedYaml, ...props }) => (
  <>
    <div className="content__header">
      <Breadcrumbs match={match} onClick={handleCancel} />
    </div>
    <div className="content">
      <div className="content__menu">
        <ul className="content__menu__list">
          <li className="content__menu__list_item active">Monitor</li>
          {/*<li className="jobs__menu__list_item">Edit</li>*/}
          {/*<li className="jobs__menu__list_item">Create</li>*/}
        </ul>
      </div>
      <div className="content__action_bar">
        <ArtifactsFilerMenu filters={['period', 'status']} />
        {/*<button*/}
        {/*  className="jobs__parameters__button_search"*/}
        {/*  onClick={handleFilterClick}*/}
        {/*>*/}
        {/*  <img src={searchIcon} alt="search icon" />*/}
        {/*</button>*/}
        <button className="content__action_bar_refresh" onClick={refresh}>
          <img src={refreshIcon} alt="refresh" />
        </button>
      </div>

      <YamlModal convertedYaml={convertedYaml} />
      <Table handleCancel={handleCancel} match={match} {...props} />
    </div>
  </>
)

Content.defaultProps = {
  job: {}
}

Content.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleFilterClick: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  job: PropTypes.shape({}),
  jobs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  refreshJobs: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  setFilterValue: PropTypes.func.isRequired
}

export default Content

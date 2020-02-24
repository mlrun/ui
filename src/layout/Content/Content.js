import React from 'react'
import PropTypes from 'prop-types'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'

import refreshIcon from '../../images/refresh.png'

import './content.scss'

const Content = ({
  convertedYaml,
  filters,
  handleCancel,
  match,
  refresh,
  ...props
}) => {
  return (
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
          <FilterMenu filters={filters} />
          <button className="content__action_bar_refresh" onClick={refresh}>
            <img src={refreshIcon} alt="refresh" />
          </button>
        </div>

        <YamlModal convertedYaml={convertedYaml} />
        <Table handleCancel={handleCancel} match={match} {...props} />
      </div>
    </>
  )
}

Content.defaultProps = {
  convertedYaml: '',
  selectedItem: {}
}

Content.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  convertToYaml: PropTypes.func.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  tableContent: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Content

import React from 'react'
import PropTypes from 'prop-types'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'

import refreshIcon from '../../images/refresh.png'
import collapseIcon from '../../images/collapse.png'
import expandIcon from '../../images/expand.png'

import './content.scss'

const Content = ({
  convertedYaml,
  filters,
  groupFilter,
  groupLatestJob,
  setGroupFilter,
  handleCancel,
  match,
  refresh,
  tableContent,
  content,
  selectedItem,
  handleSelectItem,
  convertToYaml,
  loading,
  tableHeaders,
  detailsMenu,
  page,
  stateFilter,
  setStateFilter,
  expand,
  handleExpandRow,
  handleExpandAll
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
          <FilterMenu
            filters={filters}
            groupFilter={groupFilter}
            setGroupFilter={setGroupFilter}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
          />
          <div className="content__buttons">
            <button className="content__action_bar_refresh" onClick={refresh}>
              <img src={refreshIcon} alt="refresh" />
            </button>
            <button onClick={handleExpandAll}>
              <img
                src={expand ? collapseIcon : expandIcon}
                alt="Collapse / Expand icon"
              />
            </button>
          </div>
        </div>

        <YamlModal convertedYaml={convertedYaml} />
        <Table
          groupLatestJob={groupLatestJob}
          handleCancel={handleCancel}
          match={match}
          tableContent={tableContent}
          content={content}
          selectedItem={selectedItem}
          handleSelectItem={handleSelectItem}
          convertToYaml={convertToYaml}
          loading={loading}
          tableHeaders={tableHeaders}
          detailsMenu={detailsMenu}
          page={page}
          handleExpandRow={handleExpandRow}
        />
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
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Content

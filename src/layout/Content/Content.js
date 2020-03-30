import React, { useState } from 'react'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'

import { JOBS_PAGE, ARTIFACTS_PAGE, FUNCTIONS_PAGE } from '../../constants'

import './content.scss'

const Content = ({
  content,
  detailsMenu,
  expand,
  filters,
  groupFilter,
  groupedByName,
  handleCancel,
  handleExpandAll,
  handleExpandRow,
  handleSelectItem,
  isPreview,
  loading,
  match,
  refresh,
  page,
  selectedItem,
  setGroupFilter,
  setStateFilter,
  stateFilter,
  tableHeaders,
  yamlContent
}) => {
  const [convertedYaml, setConvertedYaml] = useState('')

  const toggleConvertToYaml = item => {
    if (convertedYaml.length > 0) {
      return setConvertedYaml('')
    }
    const jobJson =
      page === JOBS_PAGE &&
      yamlContent.filter(job => job.metadata.uid === item.uid)[0]
    const functionJson =
      page === FUNCTIONS_PAGE &&
      yamlContent.filter(func => func.metadata.hash === item.hash)[0]
    const artifactJson =
      page === ARTIFACTS_PAGE &&
      yamlContent.filter(_item => _item.key === item.key)[0].data

    switch (page) {
      case JOBS_PAGE:
        return setConvertedYaml(
          yaml.dump(jobJson, {
            lineWidth: -1
          })
        )
      case ARTIFACTS_PAGE:
        return setConvertedYaml(
          yaml.dump(artifactJson, {
            lineWidth: -1
          })
        )
      default:
        return setConvertedYaml(
          yaml.safeDump(functionJson, {
            lineWidth: -1
          })
        )
    }
  }

  return (
    <>
      <div className="content__header">
        <Breadcrumbs match={match} onClick={handleCancel} />
        <PageActionsMenu match={match} page={page} />
      </div>
      <div className={`content ${loading && 'isLoading'}`}>
        <ContentMenu />
        <div className="content__action-bar">
          <FilterMenu
            expand={expand}
            filters={filters}
            groupFilter={groupFilter}
            handleExpandAll={handleExpandAll}
            setGroupFilter={setGroupFilter}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
            match={match}
            onChange={refresh}
            page={page}
          />
        </div>
        <YamlModal
          convertedYaml={convertedYaml}
          toggleConvertToYaml={toggleConvertToYaml}
        />
        <div className="table-container">
          {content.length !== 0 ? (
            <Table
              content={content}
              detailsMenu={detailsMenu}
              groupFilter={groupFilter}
              groupedByName={groupedByName}
              handleCancel={handleCancel}
              handleExpandRow={handleExpandRow}
              handleSelectItem={handleSelectItem}
              isPreview={isPreview}
              match={match}
              page={page}
              selectedItem={selectedItem}
              toggleConvertToYaml={toggleConvertToYaml}
              tableHeaders={tableHeaders}
            />
          ) : loading ? null : (
            <NoData />
          )}
        </div>
      </div>
    </>
  )
}

Content.defaultProps = {
  convertedYaml: '',
  expand: null,
  filters: [],
  selectedItem: {},
  isPreview: null
}

Content.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  convertedYaml: PropTypes.string.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  expand: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.string),
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  isPreview: PropTypes.bool,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default Content

import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactApi from '../../api/artifacts-api'
import artifactsAction from '../../actions/artifacts'
import artifactsData from './artifactsData'
import { DETAILS_ANALYSIS_TAB, DETAILS_METADATA_TAB } from '../../constants'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'

import './artifacts.scss'

const Artifacts = ({
  artifactsStore,
  fetchArtifacts,
  history,
  match,
  removeArtifacts,
  setArtifactFilter
}) => {
  const [artifacts, setArtifacts] = useState([])
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    detailsMenu: artifactsData.detailsMenu,
    filters: artifactsData.filters,
    page: artifactsData.page,
    tableHeaders: artifactsData.tableHeaders,
    infoHeaders: artifactsData.infoHeaders,
    registerArtifactDialogTitle: artifactsData.registerArtifactDialogTitle
  })
  const [selectedArtifact, setSelectedArtifact] = useState({})

  const fetchData = useCallback(
    item => {
      fetchArtifacts(item).then(data => {
        let artifacts = []

        if (data) {
          artifacts = generateArtifacts(data)

          setArtifacts(artifacts)
        }

        return artifacts
      })
    },
    [fetchArtifacts]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setArtifacts([])
      removeArtifacts()
    }
  }, [fetchData, match.params.projectName, removeArtifacts])

  useEffect(() => {
    if (match.params.name && artifactsStore.artifacts.length !== 0) {
      const { name } = match.params

      const [searchItem] = artifactsStore.artifacts.filter(
        item => item.key === name
      )

      if (!searchItem) {
        history.push(`/projects/${match.params.projectName}/artifacts`)
      } else {
        const [artifact] = searchItem.data.filter(item => {
          if (searchItem.link_iteration) {
            const { link_iteration } = searchItem.link_iteration
            return link_iteration === item.iter
          }

          return true
        })

        setSelectedArtifact({ item: artifact })
      }
    }
  }, [match.params, artifactsStore.artifacts, history])

  useEffect(() => {
    artifactApi.getArtifactTag(match.params.projectName)
  }, [match.params.projectName])

  useEffect(() => {
    if (
      (match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
        !selectedArtifact.item?.schema) ||
      (match.params.tab === DETAILS_ANALYSIS_TAB &&
        ((selectedArtifact.item?.kind === 'dataset' &&
          !selectedArtifact.item?.extra_data) ||
          selectedArtifact.item?.kind !== 'dataset'))
    ) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/overview`
      )
    }

    setPageData(state => {
      const newDetailsMenu = [...artifactsData.detailsMenu]

      if (selectedArtifact.item?.schema) {
        newDetailsMenu.push('metadata')
      }

      if (
        selectedArtifact.item?.kind === 'dataset' &&
        selectedArtifact.item?.extra_data
      ) {
        newDetailsMenu.push('analysis')
      }

      return {
        ...state,
        detailsMenu: [...newDetailsMenu]
      }
    })
  }, [
    match.params.tab,
    match.params.projectName,
    match.params.name,
    history,
    selectedArtifact.item
  ])

  const handleArtifactFilterTree = useCallback(
    item => {
      handleArtifactTreeFilterChange(
        fetchData,
        artifactsStore.filter,
        item,
        match.params.projectName,
        setArtifactFilter
      )
    },
    [
      artifactsStore.filter,
      fetchData,
      match.params.projectName,
      setArtifactFilter
    ]
  )

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={artifacts}
        handleArtifactFilterTree={handleArtifactFilterTree}
        handleCancel={() => setSelectedArtifact({})}
        handleSelectItem={item => setSelectedArtifact({ item })}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedArtifact.item}
        yamlContent={artifactsStore.artifacts}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactFilter={artifactsStore.filter}
          match={match}
          pageData={pageData}
          refresh={fetchData}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
          title={pageData.registerArtifactDialogTitle}
        />
      )}
    </>
  )
}

Artifacts.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  artifactsStore => artifactsStore,
  artifactsAction
)(Artifacts)

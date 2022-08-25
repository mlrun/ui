/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'

import './artifacts.scss'

const Artifacts = ({
  artifactsStore,
  fetchArtifacts,
  history,
  match,
  removeArtifacts
}) => {
  const [artifacts, setArtifacts] = useState([])
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    details: {
      menu: artifactsData.detailsMenu,
      infoHeaders: artifactsData.infoHeaders
    },
    filters: artifactsData.filters,
    page: artifactsData.page,
    tableHeaders: artifactsData.tableHeaders,
    registerArtifactDialogTitle: artifactsData.registerArtifactDialogTitle
  })
  const [selectedArtifact, setSelectedArtifact] = useState({})

  const fetchData = useCallback(
    filters => {
      fetchArtifacts(match.params.projectName, filters).then(data => {
        let artifacts = []

        if (data) {
          artifacts = generateArtifacts(data)

          setArtifacts(artifacts)
        }

        return artifacts
      })
    },
    [fetchArtifacts, match.params.projectName]
  )

  useEffect(() => {
    fetchData()

    return () => {
      setArtifacts([])
      removeArtifacts()
    }
  }, [fetchData, match.params.projectName, removeArtifacts])

  useEffect(() => {
    if (match.params.name && artifactsStore.artifacts.length !== 0) {
      const { name } = match.params

      const searchItem = artifactsStore.artifacts.find(
        item => item.key === name
      )

      if (!searchItem) {
        history.replace(`/projects/${match.params.projectName}/artifacts`)
      } else {
        const artifact = searchItem.data.find(item => {
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
        newDetailsMenu.push({
          label: 'metadata',
          id: 'metadata'
        })
      }

      if (
        selectedArtifact.item?.kind === 'dataset' &&
        selectedArtifact.item?.extra_data
      ) {
        newDetailsMenu.push({
          label: 'analysis',
          id: 'analysis'
        })
      }

      return {
        ...state,
        details: {
          ...state.details,
          menu: [...newDetailsMenu]
        }
      }
    })
  }, [
    match.params.tab,
    match.params.projectName,
    match.params.name,
    history,
    selectedArtifact.item
  ])

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={artifacts}
        handleActionsMenuClick={() => setIsPopupDialogOpen(true)}
        handleCancel={() => setSelectedArtifact({})}
        handleSelectItem={item => setSelectedArtifact({ item })}
        loading={artifactsStore.loading}
        match={match}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedArtifact.item}
        getIdentifier={getArtifactIdentifier}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          match={match}
          pageData={pageData}
          refresh={fetchData}
          setIsPopupOpen={setIsPopupDialogOpen}
          title={pageData.actionsMenuHeader}
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

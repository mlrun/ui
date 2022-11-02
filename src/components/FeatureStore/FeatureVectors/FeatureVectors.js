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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'

import FeatureVectorsView from './FeatureVectorsView'

import {
  FEATURE_STORE_PAGE,
  FEATURE_VECTORS_TAB,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../../../constants'
import { useOpenPanel } from '../../../hooks/openPanel.hook'
import { useGetTagOptions } from '../../../hooks/useGetTagOptions.hook'
import { getFeatureVectorIdentifier } from '../../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { checkTabIsValid, handleApplyDetailsChanges } from '../featureStore.util'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { createFeatureVectorsRowData } from '../../../utils/createFeatureStoreContent'
import { FeatureStoreContext } from '../FeatureStore'
import {
  featuresActionCreator,
  featureVectorsFilters,
  generateActionsMenu,
  generatePageData
} from './featureVectors.util'
import { DANGER_BUTTON, LABEL_BUTTON } from 'igz-controls/constants'
import { parseFeatureVectors } from '../../../utils/parseFeatureVectors'
import { setFeaturesPanelData } from '../../../reducers/tableReducer'
import { cancelRequest } from '../../../utils/cancelRequest'

const FeatureVectors = ({
  deleteFeatureVector,
  fetchFeatureVector,
  fetchFeatureVectors,
  fetchFeatureVectorsTags,
  getFilterTagOptions,
  removeFeatureVector,
  removeFeatureVectors,
  setFilters,
  setNotification,
  updateFeatureStoreData
}) => {
  const [featureVectors, setFeatureVectors] = useState([])
  const [selectedFeatureVector, setSelectedFeatureVector] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const openPanelByDefault = useOpenPanel()
  const urlTagOption = useGetTagOptions(fetchFeatureVectorsTags, featureVectorsFilters)
  const params = useParams()
  const featureStore = useSelector(store => store.featureStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const featureVectorsRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const {
    createVectorPopUpIsOpen,
    setCreateVectorPopUpIsOpen,
    setConfirmData,
    toggleConvertedYaml
  } = React.useContext(FeatureStoreContext)

  const pageData = useMemo(() => generatePageData(selectedFeatureVector), [selectedFeatureVector])

  const fetchData = useCallback(
    filters => {
      const config = {
        cancelToken: new axios.CancelToken(cancel => {
          featureVectorsRef.current.cancel = cancel
        })
      }

      return fetchFeatureVectors(params.projectName, filters, config).then(result => {
        setFeatureVectors(parseFeatureVectors(result))

        return result
      })
    },
    [fetchFeatureVectors, params.projectName]
  )

  const handleDeleteFeatureVector = useCallback(
    featureVector => {
      deleteFeatureVector(params.projectName, featureVector.name)
        .then(() => {
          if (!isEmpty(selectedFeatureVector)) {
            setSelectedFeatureVector({})
            navigate(`/projects/${params.projectName}/feature-store/feature-vectors`, {
              replace: true
            })
          }

          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Feature vector deleted successfully'
          })

          getFilterTagOptions(fetchFeatureVectorsTags, params.projectName).then(response => {
            const tag = [...response.payload, TAG_FILTER_ALL_ITEMS].includes(filtersStore.tag)
              ? filtersStore.tag
              : TAG_FILTER_LATEST

            setFilters({ tag })
            fetchData({ ...filtersStore, tag })
          })
        })
        .catch(() => {
          setNotification({
            status: 400,
            id: Math.random(),
            retry: () => handleDeleteFeatureVector(featureVector),
            message: 'Feature vector failed to delete'
          })
        })

      setConfirmData(null)
    },
    [
      deleteFeatureVector,
      fetchData,
      fetchFeatureVectorsTags,
      filtersStore,
      getFilterTagOptions,
      navigate,
      params.projectName,
      selectedFeatureVector,
      setConfirmData,
      setFilters,
      setNotification
    ]
  )

  const onDeleteFeatureVector = useCallback(
    featureVector => {
      setConfirmData({
        item: featureVector,
        header: 'Delete feature vector?',
        message: `You try to delete feature vector "${featureVector.name}". Deleted feature vectors cannot be restored.`,
        btnCancelLabel: 'Cancel',
        btnCancelVariant: LABEL_BUTTON,
        btnConfirmLabel: 'Delete',
        btnConfirmVariant: DANGER_BUTTON,
        rejectHandler: () => setConfirmData(null),
        confirmHandler: () => handleDeleteFeatureVector(featureVector)
      })
    },
    [handleDeleteFeatureVector, setConfirmData]
  )

  const actionsMenu = useMemo(
    () => generateActionsMenu(onDeleteFeatureVector, toggleConvertedYaml),
    [onDeleteFeatureVector, toggleConvertedYaml]
  )

  const handleRefresh = filters => {
    getFilterTagOptions(fetchFeatureVectorsTags, params.projectName)

    return fetchData(filters)
  }

  const handleRemoveFeatureVector = useCallback(
    featureVector => {
      const newStoreSelectedRowData = {
        ...featureStore.featureVectors.selectedRowData.content
      }

      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[featureVector.ui.identifier]
      delete newPageDataSelectedRowData[featureVector.ui.identifier]

      removeFeatureVector(newStoreSelectedRowData)
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [featureStore.featureVectors.selectedRowData.content, selectedRowData, removeFeatureVector]
  )

  const handleRequestOnExpand = useCallback(
    featureVector => {
      const featureVectorIdentifier = getFeatureVectorIdentifier(featureVector)

      setSelectedRowData(state => ({
        ...state,
        [featureVectorIdentifier]: {
          loading: true
        }
      }))

      fetchFeatureVector(featureVector.project, featureVector.name, filtersStore.tag)
        .then(result => {
          const content = [...parseFeatureVectors(result)].map(contentItem =>
            createFeatureVectorsRowData(
              contentItem,
              params.projectName,
              !isEmpty(selectedFeatureVector)
            )
          )
          setSelectedRowData(state => ({
            ...state,
            [featureVectorIdentifier]: {
              content,
              error: null,
              loading: false
            }
          }))
        })
        .catch(error => {
          setSelectedRowData(state => ({
            ...state,
            [featureVectorIdentifier]: {
              ...state.selectedRowData[featureVectorIdentifier],
              error,
              loading: false
            }
          }))
        })
    },
    [fetchFeatureVector, filtersStore.tag, params.projectName, selectedFeatureVector]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    featureVectors,
    getFeatureVectorIdentifier,
    handleRemoveFeatureVector,
    handleRequestOnExpand,
    FEATURE_STORE_PAGE,
    FEATURE_VECTORS_TAB
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createFeatureVectorsRowData(
            contentItem,
            params.projectName,
            !isEmpty(selectedFeatureVector),
            true
          )
        })
      : featureVectors.map(contentItem =>
          createFeatureVectorsRowData(
            contentItem,
            params.projectName,
            !isEmpty(selectedFeatureVector)
          )
        )
  }, [featureVectors, filtersStore.groupBy, latestItems, params.projectName, selectedFeatureVector])

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        fetchData,
        params.projectName,
        params.name,
        FEATURE_VECTORS_TAB,
        selectedFeatureVector,
        setNotification,
        updateFeatureStoreData,
        filtersStore
      )
    },
    [
      fetchData,
      filtersStore,
      params.name,
      params.projectName,
      selectedFeatureVector,
      setNotification,
      updateFeatureStoreData
    ]
  )

  const createFeatureVector = featureVectorData => {
    setCreateVectorPopUpIsOpen(false)
    dispatch(
      setFeaturesPanelData({
        currentProject: params.projectName,
        featureVector: {
          kind: 'FeatureVector',
          metadata: {
            name: featureVectorData.name,
            project: params.projectName,
            tag: featureVectorData.tag,
            labels: featureVectorData.labels
          },
          spec: {
            description: featureVectorData.description,
            features: [],
            label_feature: ''
          },
          status: {}
        },
        groupedFeatures: {
          [params.projectName]: []
        },
        isNewFeatureVector: true
      })
    )
    navigate(`/projects/${params.projectName}/feature-store/add-to-feature-vector`)
  }

  useEffect(() => {
    setSelectedRowData({})
  }, [filtersStore.tag])

  useEffect(() => {
    if (urlTagOption) {
      fetchData({
        tag: urlTagOption,
        iter: ''
      })
    }
  }, [fetchData, urlTagOption])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [filtersStore.groupBy, filtersStore.tag, setFilters])

  useEffect(() => {
    const content = cloneDeep(featureStore.featureVectors?.allData)

    if (params.name && content.length !== 0) {
      const selectedItem = content.find(contentItem => {
        return (
          contentItem.name === params.name &&
          (contentItem.tag === params.tag || contentItem.uid === params.tag)
        )
      })

      if (!selectedItem) {
        navigate(`/projects/${params.projectName}/feature-store/${FEATURE_VECTORS_TAB}`, {
          replace: true
        })
      } else {
        setSelectedFeatureVector(selectedItem)
      }
    } else {
      setSelectedFeatureVector({})
    }
  }, [featureStore.featureVectors?.allData, navigate, params.name, params.projectName, params.tag])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  useEffect(() => {
    checkTabIsValid(navigate, params, setSelectedFeatureVector, FEATURE_VECTORS_TAB)
  }, [navigate, params, setSelectedFeatureVector])

  useEffect(() => {
    if (openPanelByDefault) {
      setCreateVectorPopUpIsOpen(true)
    }
  }, [openPanelByDefault, setCreateVectorPopUpIsOpen])

  useEffect(() => {
    return () => {
      setFeatureVectors([])
      removeFeatureVectors()
      setSelectedFeatureVector({})
      setSelectedRowData({})
      cancelRequest(featureVectorsRef, 'cancel')
      setCreateVectorPopUpIsOpen(false)
    }
  }, [removeFeatureVector, removeFeatureVectors, setCreateVectorPopUpIsOpen, params.projectName])

  return (
    <FeatureVectorsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      createFeatureVector={createFeatureVector}
      createVectorPopUpIsOpen={createVectorPopUpIsOpen}
      featureStore={featureStore}
      featureVectors={featureVectors}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={featureVectorsRef}
      selectedFeatureVector={selectedFeatureVector}
      selectedRowData={selectedRowData}
      setCreateVectorPopUpIsOpen={setCreateVectorPopUpIsOpen}
      setSelectedFeatureVector={setSelectedFeatureVector}
      tableContent={tableContent}
    />
  )
}

export default connect(null, {
  ...featuresActionCreator
})(FeatureVectors)

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { connect, useSelector } from 'react-redux'
import { cloneDeep, isEmpty } from 'lodash'

import FeatureSetsView from './FeatureSetsView'

import { featureSetsActionCreator, featureSetsFilters, generatePageData } from './featureSets.util'
import {
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  TAG_FILTER_ALL_ITEMS
} from '../../../constants'
import { useOpenPanel } from '../../../hooks/openPanel.hook'
import { useGetTagOptions } from '../../../hooks/useGetTagOptions.hook'
import { parseFeatureSets } from '../../../utils/parseFeatureSets'
import { getFeatureSetIdentifier } from '../../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { checkTabIsValid, handleApplyDetailsChanges } from '../featureStore.util'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { createFeatureSetsRowData } from '../../../utils/createFeatureStoreContent'
import { FeatureStoreContext } from '../FeatureStore'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const FeatureSets = ({
  fetchFeatureSet,
  fetchFeatureSets,
  fetchFeatureSetsTags,
  getFilterTagOptions,
  removeFeatureSet,
  removeFeatureSets,
  removeFeatureStoreError,
  removeNewFeatureSet,
  setFilters,
  setNotification,
  updateFeatureStoreData
}) => {
  const [featureSets, setFeatureSets] = useState([])
  const [selectedFeatureSet, setSelectedFeatureSet] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})

  const openPanelByDefault = useOpenPanel()
  const urlTagOption = useGetTagOptions(fetchFeatureSetsTags, featureSetsFilters)
  const params = useParams()
  const featureStore = useSelector(store => store.featureStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const featureStoreRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const { featureSetsPanelIsOpen, setFeatureSetsPanelIsOpen, toggleConvertedYaml } =
    React.useContext(FeatureStoreContext)

  const pageData = useMemo(() => generatePageData(selectedFeatureSet), [selectedFeatureSet])

  const actionsMenu = useMemo(
    () => [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ],
    [toggleConvertedYaml]
  )

  const fetchData = useCallback(
    filters => {
      const config = {
        cancelToken: new axios.CancelToken(cancel => {
          featureStoreRef.current.cancel = cancel
        })
      }

      return fetchFeatureSets(params.projectName, filters, config).then(result => {
        setFeatureSets(parseFeatureSets(result))

        return result
      })
    },
    [fetchFeatureSets, params.projectName]
  )

  const cancelRequest = message => {
    featureStoreRef.current?.cancel && featureStoreRef.current.cancel(message)
  }

  const handleRefresh = filters => {
    getFilterTagOptions(fetchFeatureSetsTags, params.projectName)

    return fetchData(filters)
  }

  const handleRemoveFeatureSet = useCallback(
    featureSet => {
      const newStoreSelectedRowData = {
        ...featureStore.featureSets.selectedRowData.content
      }

      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[featureSet.ui.identifier]
      delete newPageDataSelectedRowData[featureSet.ui.identifier]

      removeFeatureSet(newStoreSelectedRowData)
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [featureStore.featureSets.selectedRowData.content, selectedRowData, removeFeatureSet]
  )

  const handleRequestOnExpand = useCallback(
    item => {
      const featureSetIdentifier = getFeatureSetIdentifier(item)

      setSelectedRowData(state => ({
        ...state,
        [featureSetIdentifier]: {
          loading: true
        }
      }))

      fetchFeatureSet(item.project, item.name, filtersStore.tag)
        .then(result => {
          const content = [...parseFeatureSets(result)].map(contentItem =>
            createFeatureSetsRowData(
              contentItem,
              params.projectName,
              !isEmpty(selectedFeatureSet),
              true
            )
          )
          setSelectedRowData(state => ({
            ...state,
            [featureSetIdentifier]: {
              content,
              error: null,
              loading: false
            }
          }))
        })
        .catch(error => {
          setSelectedRowData(state => ({
            ...state,
            [featureSetIdentifier]: {
              ...state.selectedRowData[featureSetIdentifier],
              error,
              loading: false
            }
          }))
        })
    },
    [fetchFeatureSet, filtersStore.tag, params.projectName, selectedFeatureSet]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    featureSets,
    getFeatureSetIdentifier,
    handleRemoveFeatureSet,
    handleRequestOnExpand,
    FEATURE_STORE_PAGE,
    FEATURE_SETS_TAB
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createFeatureSetsRowData(
            contentItem,
            params.projectName,
            !isEmpty(selectedFeatureSet),
            true
          )
        })
      : featureSets.map(contentItem =>
          createFeatureSetsRowData(contentItem, params.projectName, !isEmpty(selectedFeatureSet))
        )
  }, [featureSets, filtersStore.groupBy, latestItems, params.projectName, selectedFeatureSet])

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        fetchData,
        params.projectName,
        params.name,
        FEATURE_SETS_TAB,
        selectedFeatureSet,
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
      selectedFeatureSet,
      setNotification,
      updateFeatureStoreData
    ]
  )

  const createFeatureSetSuccess = tag => {
    const currentTag = filtersStore.tag === TAG_FILTER_ALL_ITEMS ? TAG_FILTER_ALL_ITEMS : tag

    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()
    setFilters({
      name: '',
      labels: '',
      tag: currentTag
    })

    return handleRefresh({
      project: params.projectName,
      tag: currentTag
    })
  }

  const closePanel = () => {
    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()

    if (featureStore.error) {
      removeFeatureStoreError()
    }
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
    const content = cloneDeep(featureStore.featureSets?.allData)

    if (params.name && content.length !== 0) {
      const selectedItem = content.find(contentItem => {
        return (
          contentItem.name === params.name &&
          (contentItem.tag === params.tag || contentItem.uid === params.tag)
        )
      })

      if (!selectedItem) {
        navigate(`/projects/${params.projectName}/feature-store/${FEATURE_SETS_TAB}`, {
          replace: true
        })
      } else {
        setSelectedFeatureSet(selectedItem)
      }
    } else {
      setSelectedFeatureSet({})
    }
  }, [featureStore.featureSets.allData, navigate, params.name, params.projectName, params.tag])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(FEATURE_STORE_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, params, pageData.details.menu])

  useEffect(() => {
    checkTabIsValid(navigate, params, selectedFeatureSet, FEATURE_SETS_TAB)
  }, [navigate, params, selectedFeatureSet])

  useEffect(() => {
    if (openPanelByDefault) {
      setFeatureSetsPanelIsOpen(true)
    }
  }, [openPanelByDefault, setFeatureSetsPanelIsOpen])

  useEffect(() => {
    return () => {
      setFeatureSets([])
      removeFeatureSets()
      removeFeatureSet()
      setSelectedFeatureSet({})
      setSelectedRowData({})
      cancelRequest('cancel')
    }
  }, [removeFeatureSet, removeFeatureSets, params.projectName])

  return (
    <FeatureSetsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      closePanel={closePanel}
      createFeatureSetSuccess={createFeatureSetSuccess}
      featureSets={featureSets}
      featureSetsPanelIsOpen={featureSetsPanelIsOpen}
      featureStore={featureStore}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={featureStoreRef}
      selectedFeatureSet={selectedFeatureSet}
      selectedRowData={selectedRowData}
      setSelectedFeatureSet={setSelectedFeatureSet}
      tableContent={tableContent}
    />
  )
}

export default connect(null, {
  ...featureSetsActionCreator
})(FeatureSets)

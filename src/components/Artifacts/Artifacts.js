import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import parseTargetPath from '../../utils/parseTargetPath'

import artifactApi from '../../api/artifacts-api'
import artifactsAction from '../../actions/artifacts'
import artifactsData from './artifactsData'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'

import './artifacts.scss'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

const Artifacts = ({
  artifactsStore,
  fetchArtifacts,
  history,
  match,
  removeArtifacts
}) => {
  const [artifacts, _setArtifacts] = useState([])
  const [selectedArtifact, setSelectedArtifact] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  console.log(selectedArtifact)

  const [pageData, setPageData] = useState({
    detailsMenu: artifactsData.detailsMenu,
    filters: artifactsData.filters,
    page: artifactsData.page,
    tableHeaders: artifactsData.tableHeaders
  })

  const fetchData = useCallback(
    item => {
      fetchArtifacts(item).then(data => {
        const artifacts = data
          .map(artifact => {
            let item = null

            if (artifact.link_iteration) {
              let { link_iteration } = artifact.link_iteration
              item = artifact.data.filter(
                item => item.iter === link_iteration
              )[0]
            } else {
              item = artifact.data[0]
            }

            if (item) {
              item.target_path = parseTargetPath(item.target_path)

              if (item.extra_data) {
                const generatedPreviewData = generateArtifactPreviewData(
                  item.extra_data,
                  item.target_path.schema
                )

                item.preview = generatedPreviewData.preview

                if (generatedPreviewData.extraDataPath) {
                  item.target_path.path = generatedPreviewData.extraDataPath
                }
              } else {
                item.preview = item.preview ?? []
              }
            }

            return item
          })
          .filter(item => item !== undefined)

        _setArtifacts([
          ...artifacts,
          {
            key: 'iris_dataset',
            kind: 'dataset',
            iter: 0,
            tree: '5a0edb70-2ca4-4c92-bb80-337202e6dc49',
            target_path:
              '/User/ml/demos/sklearn-pipe/pipe/5a0edb70-2ca4-4c92-bb80-337202e6dc49/iris_dataset.parquet',
            hash: '0e8e5917f4226688bb172a8190d8ad878d582837',
            format: 'parquet',
            size: 5205,
            db_key: 'get-data_iris_dataset',
            extra_data: {
              histograms: '/User/functions/describe/plots/hist.html',
              correlation: '/User/functions/describe/plots/corr.html',
              violin: '/User/functions/describe/plots/violin.html'
            },
            schema: {
              fields: [
                {
                  name: 'index',
                  type: 'integer'
                },
                {
                  name: 'sepal length (cm)',
                  type: 'number'
                },
                {
                  name: 'sepal width (cm)',
                  type: 'number'
                },
                {
                  name: 'petal length (cm)',
                  type: 'number'
                },
                {
                  name: 'petal width (cm)',
                  type: 'number'
                },
                {
                  name: 'label',
                  type: 'integer'
                }
              ],
              primaryKey: ['index'],
              pandas_version: '0.20.0'
            },
            header: [
              'index',
              'sepal length (cm)',
              'sepal width (cm)',
              'petal length (cm)',
              'petal width (cm)',
              'label'
            ],
            length: 150,
            preview: [
              [0.0, 5.1, 3.5, 1.4, 0.2, 0.0],
              [1.0, 4.9, 3.0, 1.4, 0.2, 0.0],
              [2.0, 4.7, 3.2, 1.3, 0.2, 0.0],
              [3.0, 4.6, 3.1, 1.5, 0.2, 0.0],
              [4.0, 5.0, 3.6, 1.4, 0.2, 0.0],
              [5.0, 5.4, 3.9, 1.7, 0.4, 0.0],
              [6.0, 4.6, 3.4, 1.4, 0.3, 0.0],
              [7.0, 5.0, 3.4, 1.5, 0.2, 0.0],
              [8.0, 4.4, 2.9, 1.4, 0.2, 0.0],
              [9.0, 4.9, 3.1, 1.5, 0.1, 0.0],
              [10.0, 5.4, 3.7, 1.5, 0.2, 0.0],
              [11.0, 4.8, 3.4, 1.6, 0.2, 0.0],
              [12.0, 4.8, 3.0, 1.4, 0.1, 0.0],
              [13.0, 4.3, 3.0, 1.1, 0.1, 0.0],
              [14.0, 5.8, 4.0, 1.2, 0.2, 0.0],
              [15.0, 5.7, 4.4, 1.5, 0.4, 0.0],
              [16.0, 5.4, 3.9, 1.3, 0.4, 0.0],
              [17.0, 5.1, 3.5, 1.4, 0.3, 0.0],
              [18.0, 5.7, 3.8, 1.7, 0.3, 0.0],
              [19.0, 5.1, 3.8, 1.5, 0.3, 0.0]
            ],
            stats: {
              'sepal length (cm)': {
                count: 150.0,
                mean: 5.843333333333334,
                std: 0.828066127977863,
                min: 4.3,
                '25%': 5.1,
                '50%': 5.8,
                '75%': 6.4,
                max: 7.9
              },
              'sepal width (cm)': {
                count: 150.0,
                mean: 3.0573333333333337,
                std: 0.4358662849366982,
                min: 2.0,
                '25%': 2.8,
                '50%': 3.0,
                '75%': 3.3,
                max: 4.4
              },
              'petal length (cm)': {
                count: 150.0,
                mean: 3.7580000000000005,
                std: 1.7652982332594662,
                min: 1.0,
                '25%': 1.6,
                '50%': 4.35,
                '75%': 5.1,
                max: 6.9
              },
              'petal width (cm)': {
                count: 150.0,
                mean: 1.1993333333333336,
                std: 0.7622376689603465,
                min: 0.1,
                '25%': 0.3,
                '50%': 1.3,
                '75%': 1.8,
                max: 2.5
              },
              label: {
                count: 150.0,
                mean: 1.0,
                std: 0.8192319205190405,
                min: 0.0,
                '25%': 0.0,
                '50%': 1.0,
                '75%': 2.0,
                max: 2.0
              }
            },
            updated: '2020-07-15T22:29:16.927609+00:00',
            producer: {
              name: 'get-data',
              kind: 'run',
              uri: 'sk-project/8d01f2e16a05466cafd437dff04efe4f',
              owner: 'admin',
              workflow: '5a0edb70-2ca4-4c92-bb80-337202e6dc49'
            },
            sources: [],
            project: 'sk-project'
          }
        ])
        return artifacts
      })
    },
    [fetchArtifacts]
  )

  useEffect(() => {
    fetchData({ tag: 'latest', project: match.params.projectName })

    return () => {
      _setArtifacts([])
      removeArtifacts()
    }
  }, [fetchData, match.params.projectName, removeArtifacts])

  useEffect(() => {
    if (
      match.params.name !== undefined &&
      artifactsStore.artifacts.length !== 0
    ) {
      const { name } = match.params

      const [searchItem] = artifactsStore.artifacts.filter(item => {
        return item.key === name
      })

      if (searchItem === undefined) {
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

  const handleSelectArtifact = (item, preview) => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedArtifact({ item })
  }

  useEffect(() => {
    if (match.params.tab === 'metadata' && !selectedArtifact.item?.schema) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )
    }

    setPageData(state => {
      if (selectedArtifact.item?.schema) {
        return {
          ...state,
          detailsMenu: [...artifactsData.detailsMenu, 'metadata']
        }
      }

      return {
        ...state,
        detailsMenu: artifactsData.detailsMenu
      }
    })
  }, [
    match.params.tab,
    match.params.projectName,
    match.params.name,
    history,
    selectedArtifact.item
  ])

  useEffect(() => {
    if (
      match.params.tab === 'analysis' &&
      !selectedArtifact.item?.kind === 'dataset' &&
      !selectedArtifact.item?.extra_data
    ) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )
    }
    console.log(
      selectedArtifact.item?.kind === 'dataset' &&
        selectedArtifact.item?.extra_data
    )

    setPageData(state => {
      if (
        selectedArtifact.item?.kind === 'dataset' &&
        selectedArtifact.item?.extra_data
      ) {
        return {
          ...state,
          detailsMenu: [...artifactsData.detailsMenu, 'analysis']
        }
      }

      return {
        ...state,
        detailsMenu: artifactsData.detailsMenu
      }
    })
  }, [
    match.params.tab,
    match.params.projectName,
    match.params.name,
    history,
    selectedArtifact.item
  ])

  const handleCancel = () => {
    setSelectedArtifact({})
  }

  console.log(pageData)

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={artifacts}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectArtifact}
        loading={artifactsStore.loading}
        match={match}
        pageData={pageData}
        refresh={fetchData}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        selectedItem={selectedArtifact.item}
        yamlContent={artifactsStore.artifacts}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          match={match}
          refresh={fetchData}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
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

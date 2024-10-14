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
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { groupBy, uniqBy } from 'lodash'

import CreateFeatureVectorPopUp from '../CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'
import Select from '../../common/Select/Select'
import { Button, PopUpDialog } from 'igz-controls/components'

import { parseFeatureTemplate } from '../../utils/parseFeatureTemplate'
import { generateProjectsList } from '../../utils/projects'
import { TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { setFeaturesPanelData, setTablePanelOpen } from '../../reducers/tableReducer'

import { ReactComponent as AddCircle } from 'igz-controls/images/add-circle.svg'

import './addToFeatureVectorPopUp.scss'

const AddToFeatureVectorPopUp = ({
  action,
  currentProject,
  fetchFeatureVectors,
  featureStore,
  projectStore
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)
  const [isCreateFeaturePopUpOpen, setIsCreateFeaturePopUpOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedFeatureVector, setSelectedFeatureVector] = useState('')
  const [selectedFeatureVectorTag, setSelectedFeatureVectorTag] = useState('')
  const [featureVectors, setFeatureVectors] = useState([])
  const [featureVectorsList, setFeatureVectorsList] = useState([])
  const [featureVectorTagsList, setFeatureVectorTagsList] = useState([])
  const [projectsList, setProjectsList] = useState(
    generateProjectsList(projectStore.projectsNames.data)
  )
  const addToFeatureVectorBtn = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (projectsList.length === 0) {
      setProjectsList(generateProjectsList(projectStore.projectsNames.data, currentProject))
    }
  }, [currentProject, projectStore.projectsNames.data, projectsList.length])

  const closePopUp = () => {
    setIsPopUpOpen(false)
    resetData()
  }

  const onSelectProject = projectName => {
    setSelectedProject(projectName)
    fetchFeatureVectors(projectName).then(result => {
      if (result) {
        const featureVectorsOptions = result.map(featureVector => {
          return {
            id: featureVector.metadata.name,
            label: featureVector.metadata.name
          }
        })

        setFeatureVectors(result)
        setFeatureVectorsList(uniqBy(featureVectorsOptions, 'id'))
        setFeatureVectorTagsList([])
        setSelectedFeatureVector('')
        setSelectedFeatureVectorTag('')
      }
    })
  }

  const onSelectFeatureVector = featureVectorName => {
    setSelectedFeatureVector(featureVectorName)
    setSelectedFeatureVectorTag('')
    setFeatureVectorTagsList(
      featureVectors
        .filter(featureVector => {
          return (
            featureVector.metadata.name === featureVectorName && Boolean(featureVector.metadata.tag)
          )
        })
        .map(featureVector => {
          return {
            id: featureVector.metadata.tag,
            label: featureVector.metadata.tag
          }
        })
    )
  }

  const createFeatureVector = featureVectorData => {
    setIsPopUpOpen(false)
    setIsCreateFeaturePopUpOpen(false)
    dispatch(
      setFeaturesPanelData({
        currentProject: currentProject,
        featureVector: {
          kind: 'FeatureVector',
          metadata: {
            name: featureVectorData.name,
            project: currentProject,
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
          [currentProject]: []
        },
        isNewFeatureVector: true
      })
    )
    dispatch(setTablePanelOpen(true))
  }

  const resetData = () => {
    setSelectedProject('')
    setSelectedFeatureVector('')
    setFeatureVectorsList([])
    setSelectedFeatureVectorTag('')
    setFeatureVectorTagsList([])
  }

  const selectFeatureVector = () => {
    const featureVector = featureVectors.find(
      featureVector =>
        featureVector.metadata.name === selectedFeatureVector &&
        featureVector.metadata.tag === selectedFeatureVectorTag
    )

    if (featureVector) {
      setIsPopUpOpen(false)

      const groupedFeatures = groupBy(
        featureVector.spec.features.map(feature => {
          return parseFeatureTemplate(feature, currentProject)
        }),
        feature => feature.project || currentProject
      )

      dispatch(
        setFeaturesPanelData({
          currentProject: currentProject,
          featureVector: featureVector,
          groupedFeatures: groupedFeatures,
          isNewFeatureVector: false
        })
      )
      dispatch(setTablePanelOpen(true))
      resetData()
    }
  }

  const handleAddToFeatureVector = () => {
    if (!isPopUpOpen) {
      onSelectProject(currentProject)
    } else {
      resetData()
    }

    setIsPopUpOpen(state => !state)
  }

  return (
    <>
      <Button
        ref={addToFeatureVectorBtn}
        variant={action.variant}
        label={action.label}
        tooltip={
          action.tooltip ||
          (featureStore.features?.allData?.length === 0 ? 'No features in the project.' : '')
        }
        disabled={action.disabled || !featureStore.features?.allData?.length}
        onClick={handleAddToFeatureVector}
      />
      {isPopUpOpen && (
        <PopUpDialog
          headerText="Select feature vector"
          customPosition={{
            element: addToFeatureVectorBtn,
            position: 'bottom-left'
          }}
          closePopUp={closePopUp}
          className="add-to-feature-vector"
        >
          <div className="select-row">
            <Select
              className="project-name"
              density="chunky"
              floatingLabel
              label="Project name"
              onClick={onSelectProject}
              options={projectsList}
              search
              selectedId={selectedProject}
            />
            <Select
              className="vector-name"
              density="chunky"
              disabled={featureVectorsList.length === 0}
              floatingLabel
              label="Vector name"
              search
              selectedId={selectedFeatureVector}
              onClick={onSelectFeatureVector}
              options={featureVectorsList}
            />
            <Select
              className="vector-tag"
              density="chunky"
              floatingLabel
              options={featureVectorTagsList}
              label="Tag"
              search
              disabled={featureVectorTagsList.length === 0}
              selectedId={selectedFeatureVectorTag}
              onClick={setSelectedFeatureVectorTag}
            />
          </div>
          <div className="pop-up-dialog__footer-container">
            <Button
              variant={TERTIARY_BUTTON}
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={closePopUp}
            />
            <Button
              variant={PRIMARY_BUTTON}
              disabled={[selectedProject, selectedFeatureVector, selectedFeatureVectorTag].includes(
                ''
              )}
              label="Select"
              onClick={selectFeatureVector}
            />
          </div>
          <div className="divider" />
          <div
            className="create-feature-vector__btn"
            onClick={() => setIsCreateFeaturePopUpOpen(true)}
          >
            <AddCircle />
            Create new feature vector
          </div>
          {isCreateFeaturePopUpOpen &&
            createPortal(
              <CreateFeatureVectorPopUp
                closePopUp={() => {
                  setIsCreateFeaturePopUpOpen(false)
                }}
                createFeatureVector={createFeatureVector}
              />,
              document.getElementById('root')
            )}
        </PopUpDialog>
      )}
    </>
  )
}

AddToFeatureVectorPopUp.propTypes = {
  action: PropTypes.shape({}).isRequired,
  currentProject: PropTypes.string.isRequired,
  fetchFeatureVectors: PropTypes.func.isRequired
}

export default connect(
  (projectStore, featureStore) => ({
    ...projectStore,
    ...featureStore
  }),
  {}
)(AddToFeatureVectorPopUp)

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { groupBy, uniqBy } from 'lodash'

import Button from '../../common/Button/Button'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Select from '../../common/Select/Select'
import CreateFeatureVectorPopUp from '../CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'

import { parseFeatureTemplate } from '../../utils/parseFeatureTemplate'
import { generateProjectsList } from '../../utils/projects'
import tableActions from '../../actions/table'

import { ReactComponent as AddCircle } from '../../images/add-circle.svg'

import './addToFeatureVectorPopUp.scss'

const AddToFeatureVectorPopUp = ({
  action,
  currentProject,
  fetchFeatureVectors,
  projectStore,
  setFeaturesPanelData,
  setTablePanelOpen
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)
  const [isCreateFeaturePopUpOpen, setIsCreateFeaturePopUpOpen] = useState(
    false
  )
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedFeatureVector, setSelectedFeatureVector] = useState('')
  const [selectedFeatureVectorTag, setSelectedFeatureVectorTag] = useState('')
  const [featureVectors, setFeatureVectors] = useState([])
  const [featureVectorsList, setFeatureVectorsList] = useState([])
  const [featureVectorTagsList, setFeatureVectorTagsList] = useState([])
  const [projectsList, setProjectsList] = useState(
    generateProjectsList(projectStore.projectsNames.data)
  )

  useEffect(() => {
    if (projectsList.length === 0) {
      setProjectsList(
        generateProjectsList(projectStore.projectsNames.data, currentProject)
      )
    }
  }, [currentProject, projectStore.projectsNames.data, projectsList.length])

  const closePopUp = () => {
    setIsPopUpOpen(false)
    resetData()
  }

  const onSelectProject = projectName => {
    setSelectedProject(projectName)
    fetchFeatureVectors({}, projectName).then(result => {
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
    })
  }

  const onSelectFeatureVector = featureVectorName => {
    setSelectedFeatureVector(featureVectorName)
    setSelectedFeatureVectorTag('')
    setFeatureVectorTagsList(
      featureVectors
        .filter(featureVector => {
          return (
            featureVector.metadata.name === featureVectorName &&
            Boolean(featureVector.metadata.tag)
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
    setTablePanelOpen(true)
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

      setFeaturesPanelData({
        currentProject: currentProject,
        featureVector: featureVector,
        groupedFeatures: groupedFeatures,
        isNewFeatureVector: false
      })
      setTablePanelOpen(true)
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
    <div className="add-to-feature-vector">
      <Button
        variant={action.variant}
        label={action.label}
        tooltip={action.tooltip}
        disabled={action.disabled}
        onClick={handleAddToFeatureVector}
      />
      {isPopUpOpen && (
        <PopUpDialog headerText="Select feature vector" closePopUp={closePopUp}>
          <div className="select-row">
            <Select
              className="project-name"
              floatingLabel
              options={projectsList}
              label="Project name"
              search
              selectedId={selectedProject}
              onClick={onSelectProject}
            />
            <Select
              className="vector-name"
              floatingLabel
              options={featureVectorsList}
              label="Vector name"
              search
              disabled={featureVectorsList.length === 0}
              selectedId={selectedFeatureVector}
              onClick={onSelectFeatureVector}
            />
            <Select
              className="vector-tag"
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
              variant="label"
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={closePopUp}
            />
            <Button
              variant="primary"
              disabled={[
                selectedProject,
                selectedFeatureVector,
                selectedFeatureVectorTag
              ].includes('')}
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
    </div>
  )
}

AddToFeatureVectorPopUp.propTypes = {
  action: PropTypes.shape({}).isRequired,
  currentProject: PropTypes.string.isRequired,
  fetchFeatureVectors: PropTypes.func.isRequired
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  { ...tableActions }
)(AddToFeatureVectorPopUp)

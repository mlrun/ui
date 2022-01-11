import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { connect } from 'react-redux'
import { cloneDeep, isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import Button from '../../common/Button/Button'
import Tip from '../../common/Tip/Tip'
import Accordion from '../../common/Accordion/Accordion'
import FeaturesTablePanelRow from './FeatureTablePanleRow/FeaturesTablePanelRow'
import CreateFeatureVectorPopUp from '../CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import tableActions from '../../actions/table'
import featureStoreActions from '../../actions/featureStore'
import notificationActions from '../../actions/notification'
import { LABEL_BUTTON, PRIMARY_BUTTON } from '../../constants'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

import './featuresTablePanel.scss'

const FeaturesTablePanel = ({
  createNewFeatureVector,
  filtersStore,
  handleCancel,
  onSubmit,
  setTablePanelOpen,
  tableStore,
  setLabelFeature,
  setNotification,
  updateCurrentProjectName,
  updateFeatureVector,
  updateFeatureVectorData,
  updateGroupedFeatures
}) => {
  const [isCreateFeaturePopUpOpen, setIsCreateFeaturePopUpOpen] = useState(
    false
  )

  useEffect(() => {
    if (tableStore.features.isNewFeatureVector) {
      updateCurrentProjectName(
        filtersStore.project ||
          tableStore.features.featureVector.metadata.project
      )
    }
  }, [
    filtersStore.project,
    tableStore.features.featureVector.metadata.project,
    tableStore.features.isNewFeatureVector,
    updateCurrentProjectName
  ])

  useEffect(() => {
    if (
      !tableStore.features.isNewFeatureVector &&
      isEmpty(tableStore.features.labelFeature)
    ) {
      setLabelFeature({
        [tableStore.features
          .currentProject]: tableStore.features.groupedFeatures[
          tableStore.features.currentProject
        ]?.some(
          feature =>
            feature.originalTemplate ===
            tableStore.features.featureVector.spec.label_feature
        )
          ? tableStore.features.featureVector.spec.label_feature
          : ''
      })
    }
  }, [
    setLabelFeature,
    tableStore.features.currentProject,
    tableStore.features.featureVector.spec.label_feature,
    tableStore.features.groupedFeatures,
    tableStore.features.isNewFeatureVector,
    tableStore.features.labelFeature
  ])

  const addFeatures = () => {
    let featureVector = cloneDeep(tableStore.features.featureVector)
    let addFeaturesPromise = null

    featureVector.spec.features = Object.keys(
      tableStore.features.groupedFeatures
    ).reduce(
      (accum, project) => [
        ...accum,
        ...tableStore.features.groupedFeatures[project].map(
          feature => feature.originalTemplate
        )
      ],
      []
    )

    featureVector.spec.label_feature =
      tableStore.features.labelFeature?.[tableStore.features.currentProject]

    if (onSubmit) {
      onSubmit(featureVector)
    } else {
      if (tableStore.features.isNewFeatureVector) {
        addFeaturesPromise = createNewFeatureVector(featureVector)
      } else {
        addFeaturesPromise = updateFeatureVectorData(featureVector)
      }

      addFeaturesPromise
        .then(response => {
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Features successfully added'
          })
        })
        .catch(() => {
          setNotification({
            status: 400,
            id: Math.random(),
            message: 'Failed to add features',
            retry: addFeatures
          })
        })

      setTablePanelOpen(false)
    }
  }

  const deleteFeature = featureTemplate => {
    const filteredFeatures = tableStore.features.groupedFeatures[
      tableStore.features.currentProject
    ].filter(feature => feature.originalTemplate !== featureTemplate)

    updateGroupedFeatures(filteredFeatures)

    if (
      featureTemplate ===
      tableStore.features.labelFeature?.[tableStore.features.currentProject]
    ) {
      setLabelFeature({
        [tableStore.features.currentProject]: ''
      })
    }
  }

  const createFeatureVector = featureVectorData => {
    setIsCreateFeaturePopUpOpen(false)
    updateFeatureVector({
      metadata: {
        name: featureVectorData.name,
        tag: featureVectorData.tag,
        labels: featureVectorData.labels
      },
      spec: {
        description: featureVectorData.description
      }
    })
  }

  const toggleLabelFeature = featureTemplate => {
    setLabelFeature({
      [tableStore.features.currentProject]: tableStore.features.labelFeature?.[
        tableStore.features.currentProject
      ]
        ? ''
        : featureTemplate
    })
  }

  return (
    <div className="features-panel">
      <div className="features-panel__content">
        <div className="features-panel__header">
          <div className="features-panel__header-project">
            {tableStore.features.featureVector.metadata.project}
          </div>
          <div className="features-panel__header-vector">
            <Tooltip
              className="features-panel__header-vector-name"
              template={
                <TextTooltipTemplate
                  text={tableStore.features.featureVector.metadata.name}
                />
              }
            >
              {tableStore.features.featureVector.metadata.name}
            </Tooltip>
            <Tooltip
              className="features-panel__header-vector-tag"
              template={
                <TextTooltipTemplate
                  text={tableStore.features.featureVector.metadata.tag}
                />
              }
            >
              {tableStore.features.featureVector.metadata.tag}
            </Tooltip>
            {tableStore.features.isNewFeatureVector && (
              <div className="features-panel__header-vector-actions actions">
                <button onClick={() => setIsCreateFeaturePopUpOpen(true)}>
                  <Edit />
                </button>
                {isCreateFeaturePopUpOpen &&
                  createPortal(
                    <CreateFeatureVectorPopUp
                      closePopUp={() => {
                        setIsCreateFeaturePopUpOpen(false)
                      }}
                      createFeatureVector={createFeatureVector}
                      featureVectorData={{
                        name: tableStore.features.featureVector.metadata.name,
                        tag: tableStore.features.featureVector.metadata.tag,
                        description:
                          tableStore.features.featureVector.spec.description,
                        labels:
                          tableStore.features.featureVector.metadata.labels
                      }}
                    />,
                    document.getElementById('root')
                  )}
              </div>
            )}
            <div className="features-panel__header-vector-tooltip">
              <Tip text="Add features from the list on the left to this feature vector" />
            </div>
          </div>
        </div>
        <div className="features-panel__divider" />
        <Accordion
          accordionClassName="features-panel__expand-item"
          icon={<Arrow />}
          iconClassName="features-panel__expand-icon"
          openByDefault
        >
          <div className="features-panel__expand-title">Selected project</div>
          <div className="features-panel__expand-content">
            {tableStore.features.groupedFeatures[
              tableStore.features.currentProject
            ]?.length > 0 ? (
              tableStore.features.groupedFeatures[
                tableStore.features.currentProject
              ].map(feature => (
                <FeaturesTablePanelRow
                  key={feature.originalTemplate}
                  labelFeature={
                    tableStore.features.labelFeature?.[
                      tableStore.features.currentProject
                    ]
                      ? tableStore.features.labelFeature[
                          tableStore.features.currentProject
                        ]
                      : ''
                  }
                  isEditEnabled={
                    tableStore.features.currentProject === feature.project
                  }
                  feature={feature}
                  toggleLabelFeature={toggleLabelFeature}
                  deleteFeature={deleteFeature}
                />
              ))
            ) : (
              <div className="features-panel__empty-content">
                Add features from the list on the left to this feature vector
              </div>
            )}
          </div>
        </Accordion>
        <div className="features-panel__divider" />
        <div className="features-panel__sub-title">Features by projects:</div>
        {Object.entries(tableStore.features.groupedFeatures).map(
          ([projectName, features]) =>
            projectName !== tableStore.features.currentProject && (
              <Accordion
                key={projectName}
                accordionClassName="features-panel__expand-item"
                icon={<Arrow />}
                iconClassName="features-panel__expand-icon"
              >
                <div className="features-panel__expand-title">
                  {projectName}
                </div>
                <div className="features-panel__expand-content">
                  {features.map(feature => (
                    <FeaturesTablePanelRow
                      key={feature.originalTemplate}
                      labelFeature={
                        tableStore.features.labelFeature?.[projectName]
                          ? tableStore.features.labelFeature[projectName]
                          : ''
                      }
                      isEditEnabled={
                        tableStore.features.currentProject === feature.project
                      }
                      feature={feature}
                      toggleLabelFeature={toggleLabelFeature}
                      deleteFeature={deleteFeature}
                    />
                  ))}
                </div>
              </Accordion>
            )
        )}
      </div>
      <div className="features-panel__buttons">
        <Button
          label="Cancel"
          variant={LABEL_BUTTON}
          onClick={() => {
            handleCancel ? handleCancel() : setTablePanelOpen(false)
          }}
        />
        <Button variant={PRIMARY_BUTTON} label="Add" onClick={addFeatures} />
      </div>
    </div>
  )
}

FeaturesTablePanel.defaultProps = {
  handleCancel: null,
  onSubmit: null
}

FeaturesTablePanel.propTypes = {
  handleCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default connect(
  (tableStore, filtersStore) => ({
    ...tableStore,
    ...filtersStore
  }),
  { ...tableActions, ...featureStoreActions, ...notificationActions }
)(FeaturesTablePanel)

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
import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

import Accordion from '../../common/Accordion/Accordion'
import CreateFeatureVectorPopUp from '../CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'
import FeaturesTablePanelRow from './FeatureTablePanleRow/FeaturesTablePanelRow'
import { Button, Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

import './featuresTablePanel.scss'

function FeaturesTablePanelView({
  addFeatures,
  createFeatureVector,
  deleteFeature,
  handleCancel,
  isCreateFeaturePopUpOpen,
  setIsCreateFeaturePopUpOpen,
  tableStore,
  toggleLabelFeature
}) {
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
                <TextTooltipTemplate text={tableStore.features.featureVector.metadata.name} />
              }
            >
              {tableStore.features.featureVector.metadata.name}
            </Tooltip>
            <Tooltip
              className="features-panel__header-vector-tag"
              template={
                <TextTooltipTemplate text={tableStore.features.featureVector.metadata.tag} />
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
                        description: tableStore.features.featureVector.spec.description,
                        labels: tableStore.features.featureVector.metadata.labels
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
            {tableStore.features.groupedFeatures[tableStore.features.currentProject]?.length > 0 ? (
              tableStore.features.groupedFeatures[tableStore.features.currentProject].map(
                feature => (
                  <FeaturesTablePanelRow
                    key={feature.originalTemplate}
                    labelFeature={
                      tableStore.features.labelFeature ? tableStore.features.labelFeature : ''
                    }
                    isEditEnabled={true}
                    feature={feature}
                    toggleLabelFeature={toggleLabelFeature}
                    deleteFeature={featureTemplate => {
                      deleteFeature(featureTemplate, feature.project)
                    }}
                  />
                )
              )
            ) : (
              <div className="features-panel__empty-content">
                Add features from the list on the left to this feature vector
              </div>
            )}
          </div>
        </Accordion>
        <div className="features-panel__divider" />
        <div className="features-panel__sub-title">Features by projects:</div>
        {Object.entries(tableStore.features.groupedFeatures).map(([projectName, features]) => {
          return (
            projectName !== tableStore.features.currentProject && (
              <Accordion
                key={projectName}
                accordionClassName="features-panel__expand-item"
                icon={<Arrow />}
                iconClassName="features-panel__expand-icon"
              >
                <div className="features-panel__expand-title">{projectName}</div>
                <div className="features-panel__expand-content">
                  {features.map(feature => {
                    return (
                      <FeaturesTablePanelRow
                        key={feature.originalTemplate}
                        labelFeature={
                          tableStore.features.labelFeature ? tableStore.features.labelFeature : ''
                        }
                        isEditEnabled={true}
                        feature={feature}
                        toggleLabelFeature={toggleLabelFeature}
                        deleteFeature={featureTemplate =>
                          deleteFeature(featureTemplate, feature.project)
                        }
                      />
                    )
                  })}
                </div>
              </Accordion>
            )
          )
        })}
      </div>
      <div className="features-panel__buttons">
        <Button label="Cancel" variant={TERTIARY_BUTTON} onClick={handleCancel} />
        <Button variant={PRIMARY_BUTTON} label="Add" onClick={addFeatures} />
      </div>
    </div>
  )
}

FeaturesTablePanelView.propTypes = {
  addFeatures: PropTypes.func.isRequired,
  createFeatureVector: PropTypes.func.isRequired,
  deleteFeature: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  isCreateFeaturePopUpOpen: PropTypes.bool.isRequired,
  setIsCreateFeaturePopUpOpen: PropTypes.func.isRequired,
  tableStore: PropTypes.object.isRequired,
  toggleLabelFeature: PropTypes.func.isRequired
}

export default FeaturesTablePanelView

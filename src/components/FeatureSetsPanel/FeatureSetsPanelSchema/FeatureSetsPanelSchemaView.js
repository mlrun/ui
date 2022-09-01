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

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Input from '../../../common/Input/Input'

import './featureSetsPanelSchema.scss'

const FeatureSetsPanelSchemaView = ({
  data,
  featureStore,
  handleEntitiesOnBlur,
  handleEntitiesOnChange,
  setData,
  setNewFeatureSetSchemaTimestampKey,
  setValidation,
  validation
}) => {
  return (
    <div className="feature-set-panel__item new-item-side-panel__item schema">
      <FeatureSetsPanelSection title="Schema">
        <div className="schema__description">
          <span>
            Each feature set must be associated with one or more index column.
            when joining feature sets the entity is used as the key column.
            <a
              className="link"
              href="https://docs.mlrun.org/en/latest/feature-store/feature-sets.html"
              target="_blank"
              rel="noreferrer"
            >
              Read more
            </a>
          </span>
        </div>
        <div className="schema__inputs">
          <Input
            floatingLabel
            invalid={!validation.isEntitiesValid}
            label="Entities"
            onBlur={handleEntitiesOnBlur}
            onChange={handleEntitiesOnChange}
            placeholder="entity1,entity2,entity3"
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isEntitiesValid: value
              }))
            }
            type="text"
            value={data.entities}
          />
          <Input
            floatingLabel
            invalid={!validation.isTimestampKeyValid}
            label="Timestamp key"
            onChange={timestamp_key =>
              setData(state => ({ ...state, timestamp_key }))
            }
            onBlur={event => {
              if (
                featureStore.newFeatureSet.spec.timestamp_key !==
                event.target.value
              ) {
                setNewFeatureSetSchemaTimestampKey(event.target.value)
              }
            }}
            required={featureStore.newFeatureSet.spec.targets.some(target =>
              Boolean(target.time_partitioning_granularity)
            )}
            requiredText="Timestamp Key is required for offline target when partitioning by time is enabled - see the Target Store section."
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isTimestampKeyValid: value
              }))
            }
            tip="Used for specifying the time field when joining by time"
            type="text"
          />
        </div>
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelSchemaView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  featureStore: PropTypes.shape({}).isRequired,
  handleEntitiesOnBlur: PropTypes.func.isRequired,
  handleEntitiesOnChange: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetSchemaTimestampKey: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelSchemaView
